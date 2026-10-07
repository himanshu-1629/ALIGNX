"""
Parent-Student Conflict Index (PSCI) & Family Alignment Evaluator
Author: Himanshu (AI/ML & Decision Engine)
Project: ALIGNX / PRISM Engine (DataQuest 3.0)

Quantifies ideological, risk, and salary divergence between parental expectations
and student career options. Computes Family Alignment (A_family) on [0, 100].
"""

from typing import Tuple
from .models import FamilyProfileInput, CareerProfile, StudentProfileInput


class ConflictIndexCalculator:
    """Calculates friction metrics between family constraints and career paths."""

    # Numerical risk mapping for variance calculation
    RISK_MAP = {"low": 1.0, "medium": 2.0, "high": 3.0}

    @classmethod
    def evaluate_conflict(
        cls,
        family: FamilyProfileInput,
        student: StudentProfileInput,
        career: CareerProfile
    ) -> Tuple[float, float, str]:
        """
        Calculates the Parent-Student Conflict Index (PSCI) in [0, 100],
        and returns Family Alignment A_family = 100 - PSCI.

        Handles graceful fallback when parent questionnaire has not been submitted.
        Returns: (family_alignment, conflict_index, diagnostic_reason)
        """
        # 1. Graceful fallback for unsubmitted parent forms
        if not family.has_parent_response:
            # Impute a neutral baseline (Alignment 75.0, Conflict 25.0)
            return 75.0, 25.0, "Parent inputs pending: baseline family support assumed"

        penalties = 0.0
        reasons = []

        # 2. Risk Appetite Divergence (Max 40 points)
        parent_risk = cls.RISK_MAP.get(family.risk_appetite, 2.0)
        career_risk = cls.RISK_MAP.get(career.risk_level, 2.0)

        if parent_risk < career_risk:
            # Parents demand stability, but career is risky/emerging
            risk_gap = career_risk - parent_risk
            risk_penalty = risk_gap * 20.0  # e.g., Low vs High -> 40 points
            penalties += risk_penalty
            reasons.append(f"Parent prefers {family.risk_appetite} risk, career is {career.risk_level} risk")
        else:
            reasons.append("Risk tolerance aligned")

        # 3. Starting Salary Expectation Mismatch (Max 35 points)
        if family.expected_salary_lpa is not None:
            expected = family.expected_salary_lpa
            entry_max = career.salary_range.entry_lpa.max
            entry_mid = (career.salary_range.entry_lpa.min + entry_max) / 2.0

            if expected > entry_max:
                # Expectation exceeds realistic entry ceiling
                gap_ratio = min(1.0, (expected - entry_max) / max(1.0, entry_max))
                salary_penalty = gap_ratio * 35.0
                penalties += salary_penalty
                reasons.append(f"Parent expected ₹{expected:.1f}L; median entry is ₹{entry_mid:.1f}L")
            else:
                reasons.append("Salary expectations realistically met")

        # 4. Location Friction (Max 25 points)
        if family.preferred_locations:
            career_cities = {loc.location.lower() for loc in career.location_demand}
            preferred_cities = {p.lower() for p in family.preferred_locations}

            overlap = preferred_cities.intersection(career_cities)
            if not overlap and not student.willing_to_relocate:
                penalties += 25.0
                reasons.append("Career hubs diverge from parental location restrictions")

        # Calculate final index clamped to [0, 100]
        conflict_index = min(100.0, max(0.0, penalties))
        family_alignment = round(100.0 - conflict_index, 2)
        summary_reason = "; ".join(reasons) if reasons else "High parental harmony"

        return family_alignment, round(conflict_index, 2), summary_reason
