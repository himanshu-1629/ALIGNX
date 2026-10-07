"""
Financial Constraint Solver & Affordability Evaluator
Author: Himanshu (AI/ML & Decision Engine)
Project: ALIGNX / PRISM Engine (DataQuest 3.0)

Calculates education affordability, loan feasibility, scholarship impact,
and computes the Financial Fit (F_fit) score on [0, 100].
"""

from typing import Tuple
from .models import FamilyProfileInput, CareerProfile


class FinancialConstraintSolver:
    """Evaluates family financial capacity against career education pathways."""

    @staticmethod
    def calculate_effective_cost(
        career: CareerProfile,
        prefer_govt: bool = False,
        scholarship_eligible: bool = True
    ) -> Tuple[float, str, bool]:
        """
        Determines the realistic degree cost based on available institute tiers.
        Uses a blended median benchmark between govt and tier-2 private colleges.
        Applies a 15% scholarship/fee-waiver discount if available.
        Returns: (effective_cost_inr, tier_description, scholarship_applied)
        """
        cost_profile = career.education_cost
        govt_mid = (cost_profile.govt_tier.min_inr + cost_profile.govt_tier.max_inr) / 2.0
        pvt2_mid = (cost_profile.pvt_tier2.min_inr + cost_profile.pvt_tier2.max_inr) / 2.0

        if prefer_govt:
            base_cost = govt_mid
            tier_desc = cost_profile.govt_tier.description or "Government Institute"
        else:
            # Realistic baseline for general engineering / STEAM in India
            base_cost = (govt_mid * 0.40) + (pvt2_mid * 0.60)
            tier_desc = "Blended Govt / Tier-2 Private Benchmark"

        scholarship_applied = False
        if scholarship_eligible and cost_profile.scholarship_waiver_available:
            # Standard merit-cum-means or institutional waiver discount
            base_cost *= 0.85
            scholarship_applied = True

        return base_cost, tier_desc, scholarship_applied

    @classmethod
    def evaluate_financial_fit(
        cls,
        family: FamilyProfileInput,
        career: CareerProfile,
        budget_override_inr: float = 0.0
    ) -> Tuple[float, float, float, bool, str]:
        """
        Computes Financial Fit (F_fit) in [0, 100].
        Considers total budget, loan willingness, and degree costs.

        Returns:
            (financial_fit, affordability_margin_inr, coverage_ratio, scholarship_applied, pathway_desc)
        """
        total_budget = family.total_budget_inr + budget_override_inr
        max_funds = total_budget + family.loan_willingness_inr

        effective_cost, tier_desc, scholarship_applied = cls.calculate_effective_cost(
            career,
            prefer_govt=(total_budget < 800000),  # Prioritize govt tier for constrained budgets
            scholarship_eligible=True
        )

        affordability_margin = max_funds - effective_cost
        coverage_ratio = max_funds / max(1.0, effective_cost)

        # Affordability scoring curve:
        # R >= 1.25 -> 100 (Comfortable buffer)
        # 1.0 <= R < 1.25 -> 80 to 100 (Fully affordable with minimal stretch)
        # 0.7 <= R < 1.0 -> 50 to 80 (Manageable through student loans / partial aid)
        # R < 0.7 -> 0 to 50 (High financial strain)
        if coverage_ratio >= 1.25:
            fit_score = 100.0
        elif coverage_ratio >= 1.0:
            fit_score = 80.0 + 20.0 * ((coverage_ratio - 1.0) / 0.25)
        elif coverage_ratio >= 0.70:
            fit_score = 50.0 + 30.0 * ((coverage_ratio - 0.70) / 0.30)
        else:
            fit_score = max(5.0, 50.0 * (coverage_ratio / 0.70))

        return (
            round(fit_score, 2),
            round(affordability_margin, 2),
            round(coverage_ratio, 2),
            scholarship_applied,
            tier_desc
        )
