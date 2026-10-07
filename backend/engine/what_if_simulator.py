"""
Dynamic What-If Career Simulation Engine
Author: Himanshu (AI/ML & Decision Engine)
Project: ALIGNX / PRISM Engine (DataQuest 3.0)

Simulates real-time parameter counterfactuals ("What if budget increases by ₹2L?",
"What if student learns PyTorch?", "What if family relocates to Bangalore?")
and computes rank velocity (+/- delta) against baseline recommendations.
"""

from typing import List, Dict, Any, Optional
from copy import deepcopy
from .models import (
    StudentProfileInput,
    FamilyProfileInput,
    CareerProfile,
    CareerScoringResult,
    WhatIfParameters,
    EngineConfig,
)
from .scoring_engine import AlignxDecisionEngine


class WhatIfSimulator:
    """Computes counterfactual scenario deltas in real-time."""

    def __init__(self, engine: Optional[AlignxDecisionEngine] = None):
        self.engine = engine or AlignxDecisionEngine()

    def simulate(
        self,
        base_student: StudentProfileInput,
        base_family: FamilyProfileInput,
        careers: List[CareerProfile],
        params: WhatIfParameters
    ) -> Dict[str, Any]:
        """
        Executes a counterfactual simulation and calculates deltas against baseline.

        Returns:
            {
                "baseline_top_3": [...],
                "simulated_top_3": [...],
                "rank_deltas": { career_id: {"delta_rank": int, "delta_score": float, ...} },
                "simulation_results": List[CareerScoringResult]
            }
        """
        # 1. Compute baseline rankings
        baseline_results = self.engine.rank_careers(
            student=base_student,
            family=base_family,
            careers=careers
        )
        baseline_map = {r.career_id: r for r in baseline_results}

        # 2. Construct simulated counterfactual profiles
        sim_student = deepcopy(base_student)
        sim_family = deepcopy(base_family)

        # Apply added hypothetical skills
        if params.added_skills:
            existing_skill_ids = {s.skill_id for s in sim_student.skills}
            for skill in params.added_skills:
                if skill.skill_id in existing_skill_ids:
                    # Update proficiency
                    for s in sim_student.skills:
                        if s.skill_id == skill.skill_id:
                            s.proficiency = max(s.proficiency, skill.proficiency)
                else:
                    sim_student.skills.append(skill)

        # Apply parental risk appetite override
        if params.override_risk_appetite:
            sim_family.risk_appetite = params.override_risk_appetite

        # Apply weight overrides if requested
        active_engine = self.engine
        if params.override_weights:
            active_engine = AlignxDecisionEngine(config=params.override_weights)

        # 3. Compute simulated rankings
        simulated_results = active_engine.rank_careers(
            student=sim_student,
            family=sim_family,
            careers=careers,
            budget_override_inr=params.budget_delta_inr,
            target_city_override=params.override_location
        )

        # 4. Compute comparative deltas
        deltas: Dict[str, Dict[str, Any]] = {}
        for sim_res in simulated_results:
            base_res = baseline_map.get(sim_res.career_id)
            if base_res:
                rank_change = base_res.rank - sim_res.rank  # Positive means improved rank
                score_change = round(sim_res.alignx_score - base_res.alignx_score, 2)
                deltas[sim_res.career_id] = {
                    "career_name": sim_res.career_name,
                    "previous_rank": base_res.rank,
                    "new_rank": sim_res.rank,
                    "rank_delta": rank_change,
                    "score_delta": score_change,
                    "status": "improved" if rank_change > 0 else ("dropped" if rank_change < 0 else "unchanged")
                }

        return {
            "baseline_top_3": [
                {"rank": r.rank, "name": r.career_name, "score": r.alignx_score}
                for r in baseline_results[:3]
            ],
            "simulated_top_3": [
                {"rank": r.rank, "name": r.career_name, "score": r.alignx_score}
                for r in simulated_results[:3]
            ],
            "rank_deltas": deltas,
            "simulation_results": simulated_results
        }
