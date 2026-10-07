"""
Market Fit & Location Alignment Evaluator
Author: Himanshu (AI/ML & Decision Engine)
Project: ALIGNX / PRISM Engine (DataQuest 3.0)

Calculates Market Fit (M_fit) and Location Fit (L_fit) using industry hiring velocity,
5-year growth trajectory, entry salaries, and regional job hubs.
"""

from typing import Tuple, Optional
from .models import CareerProfile, StudentProfileInput


class MarketEvaluator:
    """Evaluates macro market demand and regional hub alignment."""

    @staticmethod
    def evaluate_market_fit(career: CareerProfile) -> float:
        """
        Computes Market Fit (M_fit) in [0, 100].
        Formulation:
            M_fit = 0.40 * HiringVelocity + 0.35 * GrowthScore + 0.25 * SalaryTierScore
        """
        m_data = career.market_data
        hiring_velocity = m_data.hiring_velocity
        growth_score = m_data.growth_score

        # Normalize entry salary potential [4 LPA = 40 pts, 20+ LPA = 100 pts]
        entry_mid = (career.salary_range.entry_lpa.min + career.salary_range.entry_lpa.max) / 2.0
        salary_score = min(100.0, max(30.0, entry_mid * 5.0))

        market_fit = (
            0.40 * hiring_velocity +
            0.35 * growth_score +
            0.25 * salary_score
        )
        return round(min(100.0, max(0.0, market_fit)), 2)

    @staticmethod
    def evaluate_location_fit(
        student: StudentProfileInput,
        career: CareerProfile,
        target_city_override: Optional[str] = None
    ) -> float:
        """
        Computes Location Fit (L_fit) in [0, 100].
        Considers student home city, willingness to relocate, and career hub specializations.
        """
        if not career.location_demand:
            return 80.0  # Distributed / remote friendly default

        eval_city = (target_city_override or student.location).strip().lower()

        # Check for direct presence in current city
        matching_hub = next(
            (loc for loc in career.location_demand if loc.location.lower() == eval_city),
            None
        )

        if matching_hub:
            # Home city is an established cluster
            demand = matching_hub.demand_score
            cost = matching_hub.cost_index
            # High demand with moderate living cost is optimal
            score = 0.70 * demand + 0.30 * (100.0 - (cost * 0.25))
            return round(min(100.0, max(50.0, score)), 2)

        if student.willing_to_relocate:
            # Student can relocate to top regional cluster
            best_hub = max(career.location_demand, key=lambda x: x.demand_score)
            relocation_penalty = 12.0  # Small friction cost of relocation
            score = best_hub.demand_score - relocation_penalty
            return round(min(100.0, max(40.0, score)), 2)
        else:
            # Relocation required, but student cannot relocate
            return 35.0
