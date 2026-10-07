"""
Career DNA Generator & Student Fit Evaluator
Author: Himanshu (AI/ML & Decision Engine)
Project: ALIGNX / PRISM Engine (DataQuest 3.0)

Implements vectorization, Holland Code (RIASEC) cosine similarity, cognitive aptitude
alignment, weighted skill-fit calculation, and skill-gap identification.
"""

import math
from typing import Tuple, List, Dict
from .models import (
    StudentProfileInput,
    CareerProfile,
    InterestProfile,
    AptitudeProfile,
    StudentSkill,
)


class CareerDNAGenerator:
    """Computes student vector alignment against career profiles."""

    @staticmethod
    def _cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
        """Calculates cosine similarity between two non-zero vectors in range [0, 1]."""
        dot = sum(a * b for a, b in zip(vec_a, vec_b))
        norm_a = math.sqrt(sum(a * a for a in vec_a))
        norm_b = math.sqrt(sum(b * b for b in vec_b))
        if norm_a == 0.0 or norm_b == 0.0:
            return 0.5  # Neutral fallback for unpopulated vector
        similarity = dot / (norm_a * norm_b)
        return max(0.0, min(1.0, similarity))

    @classmethod
    def calculate_interest_similarity(cls, student_int: InterestProfile, career_int: InterestProfile) -> float:
        """
        Computes Holland RIASEC profile similarity using cosine similarity.
        Returns a score in range [0, 100].
        """
        s_vec = [
            student_int.realistic,
            student_int.investigative,
            student_int.artistic,
            student_int.social,
            student_int.enterprising,
            student_int.conventional,
        ]
        c_vec = [
            career_int.realistic,
            career_int.investigative,
            career_int.artistic,
            career_int.social,
            career_int.enterprising,
            career_int.conventional,
        ]
        sim = cls._cosine_similarity(s_vec, c_vec)
        return round(sim * 100.0, 2)

    @staticmethod
    def calculate_aptitude_match(student_apt: AptitudeProfile, career_apt: AptitudeProfile) -> float:
        """
        Evaluates cognitive aptitude across 5 dimensions [logical, numerical, analytical, spatial, verbal].
        Scores higher when student meets or exceeds career requirement, with soft penalties for deficit.
        Returns normalized score in [0, 100].
        """
        dims = ["logical", "numerical", "analytical", "spatial", "verbal"]
        match_scores = []
        for dim in dims:
            s_val = getattr(student_apt, dim, 50.0)
            c_val = getattr(career_apt, dim, 50.0)
            if c_val <= 0:
                match_scores.append(100.0)
                continue

            diff = s_val - c_val
            if diff >= 0:
                # Student meets or exceeds requirement
                score = 100.0
            else:
                # Proportional penalty for deficit
                deficit_ratio = abs(diff) / c_val
                score = max(0.0, 100.0 * (1.0 - deficit_ratio))
            match_scores.append(score)

        avg_score = sum(match_scores) / len(match_scores)
        return round(avg_score, 2)

    @staticmethod
    def calculate_skill_match(
        student_skills: List[StudentSkill],
        career: CareerProfile
    ) -> Tuple[float, List[str]]:
        """
        Computes weighted skill overlap and identifies missing high-importance skills.
        Returns (skill_overlap_score [0, 100], list of skill_gap names).
        """
        if not career.skills:
            return 80.0, []

        student_skill_map = {s.skill_id: s.proficiency for s in student_skills}

        total_weight = 0.0
        achieved_weight = 0.0
        skill_gaps = []

        for req in career.skills:
            weight = req.importance
            total_weight += weight
            required_lvl = req.required_level

            if req.skill_id in student_skill_map:
                prof = student_skill_map[req.skill_id]
                # Ratio of proficiency to required level, capped at 1.0
                ratio = min(1.0, prof / max(1.0, required_lvl))
                achieved_weight += weight * ratio
                if ratio < 0.6 and req.importance >= 0.8:
                    skill_gaps.append(f"{req.name} (Proficiency: {prof:.0f}/{required_lvl:.0f})")
            else:
                # Skill is missing
                if req.importance >= 0.75:
                    skill_gaps.append(req.name)

        if total_weight <= 0:
            return 80.0, []

        overlap_score = (achieved_weight / total_weight) * 100.0
        return round(overlap_score, 2), skill_gaps

    @classmethod
    def evaluate_student_fit(
        cls,
        student: StudentProfileInput,
        career: CareerProfile
    ) -> Tuple[float, float, float, float, List[str]]:
        """
        Computes Student Fit (S_fit) as a weighted blend of:
        - Holland RIASEC interest similarity (45%)
        - Cognitive aptitude alignment (35%)
        - Skill overlap (20%)
        Returns:
            (student_fit, interest_similarity, aptitude_match, skill_score, skill_gaps)
        """
        interest_sim = cls.calculate_interest_similarity(student.interests, career.interest_profile)
        aptitude_match = cls.calculate_aptitude_match(student.aptitude, career.aptitude_profile)
        skill_score, skill_gaps = cls.calculate_skill_match(student.skills, career)

        student_fit = (
            0.45 * interest_sim +
            0.35 * aptitude_match +
            0.20 * skill_score
        )
        return (
            round(student_fit, 2),
            interest_sim,
            aptitude_match,
            skill_score,
            skill_gaps
        )

    @staticmethod
    def extract_dominant_traits(student_int: InterestProfile) -> Tuple[str, str]:
        """Identifies primary and secondary Holland Career DNA archetypes."""
        mapping = {
            "Realistic": (student_int.realistic, "Builder / Hands-on"),
            "Investigative": (student_int.investigative, "Analytical / Researcher"),
            "Artistic": (student_int.artistic, "Creative / Designer"),
            "Social": (student_int.social, "Mentor / Communicator"),
            "Enterprising": (student_int.enterprising, "Strategist / Leader"),
            "Conventional": (student_int.conventional, "Organizer / Systems Thinker")
        }
        sorted_traits = sorted(mapping.items(), key=lambda x: x[1][0], reverse=True)
        primary = f"{sorted_traits[0][0]} ({sorted_traits[0][1][1]})"
        secondary = f"{sorted_traits[1][0]} ({sorted_traits[1][1][1]})"
        return primary, secondary
