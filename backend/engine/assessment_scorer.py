"""
Assessment Scorer & Vector Normalizer
Author: Himanshu (AI/ML & Decision Engine)
Project: ALIGNX / PRISM Engine (DataQuest 3.0)

Converts raw user UI assessment clicks (Likert scale 1-5 and cognitive options)
into normalized Holland InterestProfile and AptitudeProfile vectors [0, 100].
"""

import os
import json
from typing import Dict, Any, Tuple
from .models import InterestProfile, AptitudeProfile


class AssessmentScorer:
    """Parses student quiz responses and outputs normalized vectors."""

    CORRECT_APTITUDE_ANSWERS = {
        "apt_logical": "B",
        "apt_numerical": "B",
        "apt_analytical": "B",
        "apt_spatial": "B",
        "apt_verbal": "B",
    }

    QUESTION_TO_DIMENSION = {
        "riasec_r1": "realistic",
        "riasec_r2": "realistic",
        "riasec_r3": "realistic",
        "riasec_i1": "investigative",
        "riasec_i2": "investigative",
        "riasec_i3": "investigative",
        "riasec_a1": "artistic",
        "riasec_a2": "artistic",
        "riasec_a3": "artistic",
        "riasec_s1": "social",
        "riasec_s2": "social",
        "riasec_s3": "social",
        "riasec_e1": "enterprising",
        "riasec_e2": "enterprising",
        "riasec_e3": "enterprising",
        "riasec_c1": "conventional",
        "riasec_c2": "conventional",
        "riasec_c3": "conventional",
    }

    @classmethod
    def score_interests(cls, responses: Dict[str, Any]) -> InterestProfile:
        """
        Computes Holland RIASEC dimensions normalized to [0, 100].
        Each dimension has 3 questions on scale 1 to 5 (min sum: 3, max sum: 15).
        Formula: ((score_sum - 3) / 12) * 100
        """
        dimension_sums = {
            "realistic": 0.0,
            "investigative": 0.0,
            "artistic": 0.0,
            "social": 0.0,
            "enterprising": 0.0,
            "conventional": 0.0,
        }
        dimension_counts = {k: 0 for k in dimension_sums}

        for q_id, val in responses.items():
            dim = cls.QUESTION_TO_DIMENSION.get(q_id)
            if dim and isinstance(val, (int, float)):
                clamped_val = max(1.0, min(5.0, float(val)))
                dimension_sums[dim] += clamped_val
                dimension_counts[dim] += 1

        normalized_scores = {}
        for dim, total in dimension_sums.items():
            count = dimension_counts[dim]
            if count == 0:
                normalized_scores[dim] = 50.0  # Neutral baseline
            else:
                # Average per-question score on scale [1, 5] mapped to [0, 100]
                avg_val = total / count
                norm = ((avg_val - 1.0) / 4.0) * 100.0
                normalized_scores[dim] = round(max(0.0, min(100.0, norm)), 2)

        return InterestProfile(
            realistic=normalized_scores["realistic"],
            investigative=normalized_scores["investigative"],
            artistic=normalized_scores["artistic"],
            social=normalized_scores["social"],
            enterprising=normalized_scores["enterprising"],
            conventional=normalized_scores["conventional"],
        )

    @classmethod
    def score_aptitude(cls, responses: Dict[str, Any]) -> AptitudeProfile:
        """
        Evaluates cognitive aptitude challenges into [0, 100].
        Supports either:
        - Option letters (e.g. "B" -> 100 if correct, 40 baseline if incorrect)
        - Numeric scores directly (e.g. 85.0)
        """
        dim_map = {
            "apt_logical": "logical",
            "apt_numerical": "numerical",
            "apt_analytical": "analytical",
            "apt_spatial": "spatial",
            "apt_verbal": "verbal",
        }

        scores = {dim: 50.0 for dim in dim_map.values()}

        for q_id, chosen in responses.items():
            dim = dim_map.get(q_id)
            if not dim:
                # Direct dimension name override (e.g. {"logical": 90})
                if q_id in scores and isinstance(chosen, (int, float)):
                    scores[q_id] = float(chosen)
                continue

            if isinstance(chosen, (int, float)):
                scores[dim] = max(0.0, min(100.0, float(chosen)))
            elif isinstance(chosen, str):
                correct = cls.CORRECT_APTITUDE_ANSWERS.get(q_id)
                if chosen.strip().upper() == correct:
                    scores[dim] = 95.0
                else:
                    scores[dim] = 45.0  # Baseline attempt score

        return AptitudeProfile(
            logical=scores["logical"],
            numerical=scores["numerical"],
            analytical=scores["analytical"],
            spatial=scores["spatial"],
            verbal=scores["verbal"],
        )

    @classmethod
    def score_full_assessment(cls, responses: Dict[str, Any]) -> Tuple[InterestProfile, AptitudeProfile]:
        """Convenience method returning both InterestProfile and AptitudeProfile."""
        interests = cls.score_interests(responses)
        aptitude = cls.score_aptitude(responses)
        return interests, aptitude
