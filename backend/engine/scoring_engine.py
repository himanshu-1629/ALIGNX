"""
ALIGNX Master Decision Engine
Author: Himanshu (AI/ML & Decision Engine)
Project: ALIGNX / PRISM Engine (DataQuest 3.0)

Main algorithmic orchestrator computing multi-fit composite scoring,
deterministic ranking, tie-breaking, and structured diagnostic insights.
"""

from typing import List, Optional, Tuple
from .models import (
    StudentProfileInput,
    FamilyProfileInput,
    CareerProfile,
    CareerScoringResult,
    ComponentScores,
    ScoringDiagnostics,
    EngineConfig,
)
from .dna_generator import CareerDNAGenerator
from .financial_solver import FinancialConstraintSolver
from .conflict_index import ConflictIndexCalculator
from .market_evaluator import MarketEvaluator


class AlignxDecisionEngine:
    """The core decision intelligence engine of ALIGNX."""

    def __init__(self, config: Optional[EngineConfig] = None):
        self.config = config or EngineConfig()

    def score_single_career(
        self,
        student: StudentProfileInput,
        family: FamilyProfileInput,
        career: CareerProfile,
        budget_override_inr: float = 0.0,
        target_city_override: Optional[str] = None
    ) -> Tuple[float, ComponentScores, ScoringDiagnostics, List[str]]:
        """
        Calculates all 5 sub-fit dimensions and the composite ALIGNX Score for one career.
        """
        # 1. Student Fit (S_fit)
        s_fit, interest_sim, apt_match, skill_score, skill_gaps = CareerDNAGenerator.evaluate_student_fit(
            student, career
        )

        # 2. Financial Fit (F_fit)
        f_fit, margin_inr, cov_ratio, sch_applied, pathway_desc = FinancialConstraintSolver.evaluate_financial_fit(
            family, career, budget_override_inr=budget_override_inr
        )

        # 3. Family Alignment (A_family)
        a_family, conflict_idx, conflict_reason = ConflictIndexCalculator.evaluate_conflict(
            family, student, career
        )

        # 4. Market Fit (M_fit)
        m_fit = MarketEvaluator.evaluate_market_fit(career)

        # 5. Location Fit (L_fit)
        l_fit = MarketEvaluator.evaluate_location_fit(
            student, career, target_city_override=target_city_override
        )

        # Weighted Master Composite Score
        cfg = self.config
        composite_score = (
            cfg.w_student * s_fit +
            cfg.w_financial * f_fit +
            cfg.w_family * a_family +
            cfg.w_market * m_fit +
            cfg.w_location * l_fit
        )
        composite_score = round(min(100.0, max(0.0, composite_score)), 2)

        component_scores = ComponentScores(
            student_fit=s_fit,
            financial_fit=f_fit,
            family_alignment=a_family,
            market_fit=m_fit,
            location_fit=l_fit
        )

        # Synthesize primary match & risk factors for explainability layer
        match_factors = []
        if interest_sim >= 80.0:
            match_factors.append("Strong cognitive & Holland interest resonance")
        if m_fit >= 85.0:
            match_factors.append("Surging industrial demand and hiring velocity")
        if f_fit >= 90.0:
            match_factors.append("Highly affordable within family budget")
        primary_match = "; ".join(match_factors) if match_factors else "Balanced multi-dimensional alignment"

        risk_factors = []
        if skill_gaps:
            risk_factors.append(f"{len(skill_gaps)} critical skill prerequisites to acquire")
        if conflict_idx >= 30.0:
            risk_factors.append(conflict_reason)
        if cov_ratio < 1.0:
            risk_factors.append(f"Financial stretch (Requires ₹{abs(margin_inr):,.0f} loan/scholarship)")
        primary_risk = "; ".join(risk_factors) if risk_factors else "Low friction entry pathway"

        diagnostics = ScoringDiagnostics(
            interest_similarity=interest_sim,
            aptitude_match=apt_match,
            skill_overlap_score=skill_score,
            conflict_index=conflict_idx,
            affordability_margin_inr=margin_inr,
            coverage_ratio=cov_ratio,
            scholarship_offset_applied=sch_applied,
            primary_match_factor=primary_match,
            primary_risk_factor=primary_risk
        )

        return composite_score, component_scores, diagnostics, skill_gaps

    def rank_careers(
        self,
        student: StudentProfileInput,
        family: FamilyProfileInput,
        careers: List[CareerProfile],
        budget_override_inr: float = 0.0,
        target_city_override: Optional[str] = None
    ) -> List[CareerScoringResult]:
        """
        Evaluates, ranks, and sorts all candidate careers.
        Applies deterministic multi-level tie-breaking:
        1. Composite ALIGNX Score (descending)
        2. Student Fit (descending)
        3. Market Fit (descending)
        4. Financial Fit (descending)
        5. Career Name (alphabetical)
        """
        evaluated = []

        for career in careers:
            score, components, diagnostics, skill_gaps = self.score_single_career(
                student=student,
                family=family,
                career=career,
                budget_override_inr=budget_override_inr,
                target_city_override=target_city_override
            )

            entry_mid = (career.salary_range.entry_lpa.min + career.salary_range.entry_lpa.max) / 2.0
            rec_deg = career.education_pathway.degrees[0] if career.education_pathway.degrees else "B.Tech"

            evaluated.append({
                "score": score,
                "s_fit": components.student_fit,
                "m_fit": components.market_fit,
                "f_fit": components.financial_fit,
                "name": career.name,
                "career_id": career.id,
                "career_name": career.name,
                "domain": career.domain,
                "component_scores": components,
                "diagnostics": diagnostics,
                "skill_gaps": skill_gaps,
                "recommended_degree": rec_deg,
                "median_entry_lpa": round(entry_mid, 1)
            })

        # Deterministic multi-attribute sort
        evaluated.sort(
            key=lambda item: (
                item["score"],
                item["s_fit"],
                item["m_fit"],
                item["f_fit"],
                -ord(item["name"][0]) if item["name"] else 0
            ),
            reverse=True
        )

        # Assign 1-indexed ranks and build models
        results: List[CareerScoringResult] = []
        for rank_idx, item in enumerate(evaluated, start=1):
            results.append(
                CareerScoringResult(
                    career_id=item["career_id"],
                    career_name=item["career_name"],
                    domain=item["domain"],
                    alignx_score=item["score"],
                    rank=rank_idx,
                    component_scores=item["component_scores"],
                    diagnostics=item["diagnostics"],
                    skill_gaps=item["skill_gaps"],
                    recommended_degree=item["recommended_degree"],
                    median_entry_lpa=item["median_entry_lpa"]
                )
            )

        return results
