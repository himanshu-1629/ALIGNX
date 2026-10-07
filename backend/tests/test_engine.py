"""
Comprehensive Test Suite for the ALIGNX Decision Engine
Author: Himanshu (AI/ML & Decision Engine)
Project: ALIGNX / PRISM Engine (DataQuest 3.0)

Tests vector math, Holland codes, financial solver, conflict index,
master ranking over real careers (careers.json), and what-if simulation deltas.
"""

import os
import json
import time
import unittest
from backend.engine.models import (
    AptitudeProfile,
    InterestProfile,
    StudentSkill,
    StudentProfileInput,
    FamilyProfileInput,
    CareerProfile,
    WhatIfParameters,
    EngineConfig,
)
from backend.engine.dna_generator import CareerDNAGenerator
from backend.engine.financial_solver import FinancialConstraintSolver
from backend.engine.conflict_index import ConflictIndexCalculator
from backend.engine.market_evaluator import MarketEvaluator
from backend.engine.scoring_engine import AlignxDecisionEngine
from backend.engine.what_if_simulator import WhatIfSimulator


class TestAlignxDecisionEngine(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        """Loads real careers from database/seeds/careers.json."""
        root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
        careers_path = os.path.join(root_dir, "database", "seeds", "careers.json")
        with open(careers_path, "r", encoding="utf-8") as f:
            raw_careers = json.load(f)
        cls.careers = [CareerProfile.model_validate(c) for c in raw_careers]

        # Sample Student Profile (AI/ML Aspirant from Bangalore)
        cls.student = StudentProfileInput(
            id="std_himanshu_01",
            name="Himanshu",
            currentEducation="12th PCM / B.Tech Year 1",
            location="Bangalore",
            willingToRelocate=True,
            interests=InterestProfile(
                realistic=40,
                investigative=92,
                artistic=35,
                social=25,
                enterprising=65,
                conventional=45
            ),
            aptitude=AptitudeProfile(
                logical=90,
                numerical=88,
                analytical=94,
                spatial=70,
                verbal=65
            ),
            skills=[
                StudentSkill(skillId="python", proficiency=85),
                StudentSkill(skillId="data_structures", proficiency=75)
            ]
        )

        # Sample Family Profile (₹15L Budget, Medium Risk)
        cls.family = FamilyProfileInput(
            totalBudgetINR=1500000,
            loanWillingnessINR=500000,
            riskAppetite="medium",
            expectedSalaryLPA=12.0,
            preferredLocations=["Bangalore", "Hyderabad"],
            hasParentResponse=True
        )

    def test_01_loaded_careers_count(self):
        """Ensures that careers.json contains at least 20 valid STEAM career definitions."""
        self.assertGreaterEqual(len(self.careers), 20)
        ai_career = next((c for c in self.careers if c.id == "ai_ml_engineer"), None)
        self.assertIsNotNone(ai_career)
        self.assertEqual(ai_career.domain, "ai_data")

    def test_02_riasec_interest_similarity(self):
        """Verifies Holland Code cosine similarity yields high resonance for AI Engineer."""
        ai_career = next(c for c in self.careers if c.id == "ai_ml_engineer")
        sim = CareerDNAGenerator.calculate_interest_similarity(
            self.student.interests, ai_career.interest_profile
        )
        # Both student and career are heavily investigative
        self.assertGreaterEqual(sim, 85.0)
        self.assertLessEqual(sim, 100.0)

    def test_03_trait_extraction(self):
        """Verifies dominant trait categorization."""
        primary, secondary = CareerDNAGenerator.extract_dominant_traits(self.student.interests)
        self.assertIn("Investigative", primary)
        self.assertIn("Enterprising", secondary)

    def test_04_financial_solver(self):
        """Tests affordability curve and margin calculation."""
        ai_career = next(c for c in self.careers if c.id == "ai_ml_engineer")
        fit_score, margin, cov_ratio, sch_applied, desc = FinancialConstraintSolver.evaluate_financial_fit(
            self.family, ai_career
        )
        self.assertGreaterEqual(fit_score, 70.0)
        self.assertTrue(sch_applied)
        self.assertGreater(cov_ratio, 0.9)

    def test_05_conflict_index_graceful_fallback(self):
        """Verifies graceful fallback when parent form is pending."""
        pending_family = FamilyProfileInput(hasParentResponse=False)
        ai_career = next(c for c in self.careers if c.id == "ai_ml_engineer")
        align, conflict, reason = ConflictIndexCalculator.evaluate_conflict(
            pending_family, self.student, ai_career
        )
        self.assertEqual(align, 75.0)
        self.assertEqual(conflict, 25.0)
        self.assertIn("pending", reason.lower())

    def test_06_conflict_index_risk_divergence(self):
        """Verifies penalty when conservative parent faces high-risk career."""
        strict_family = FamilyProfileInput(
            riskAppetite="low",
            expectedSalaryLPA=30.0,  # Unrealistic entry expectation
            hasParentResponse=True
        )
        ai_career = next(c for c in self.careers if c.id == "ai_ml_engineer")
        align, conflict, reason = ConflictIndexCalculator.evaluate_conflict(
            strict_family, self.student, ai_career
        )
        self.assertGreater(conflict, 20.0)
        self.assertLess(align, 80.0)

    def test_07_full_pipeline_ranking_and_performance(self):
        """Benchmarks execution speed and verifies top recommendation ranking."""
        engine = AlignxDecisionEngine()
        start_time = time.perf_counter()
        results = engine.rank_careers(self.student, self.family, self.careers)
        elapsed_ms = (time.perf_counter() - start_time) * 1000.0

        # Assert performance requirement (< 50 milliseconds)
        self.assertLess(elapsed_ms, 50.0, f"Ranking took too long: {elapsed_ms:.2f}ms")
        self.assertEqual(len(results), len(self.careers))

        # First ranked career should have top score
        top_career = results[0]
        self.assertEqual(top_career.rank, 1)
        self.assertGreaterEqual(top_career.alignx_score, results[1].alignx_score)

        # AI & ML or Data Platform should lead for an investigative PCM profile
        top_ids = [r.career_id for r in results[:3]]
        self.assertTrue(
            "ai_ml_engineer" in top_ids or "data_platform_engineer" in top_ids
        )

    def test_08_what_if_simulation_rank_deltas(self):
        """Verifies What-If Simulator computes positive rank velocity when student acquires key skill."""
        simulator = WhatIfSimulator()
        # Student acquires Deep Learning & Cloud Computing
        params = WhatIfParameters(
            added_skills=[
                StudentSkill(skillId="deep_learning", proficiency=90),
                StudentSkill(skillId="cloud_computing", proficiency=85)
            ],
            budget_delta_inr=300000
        )
        simulation_out = simulator.simulate(self.student, self.family, self.careers, params)
        self.assertIn("simulation_results", simulation_out)
        self.assertIn("rank_deltas", simulation_out)
        self.assertIn("ai_ml_engineer", simulation_out["rank_deltas"])
        delta_info = simulation_out["rank_deltas"]["ai_ml_engineer"]
        self.assertGreaterEqual(delta_info["score_delta"], 0.0)


if __name__ == "__main__":
    unittest.main()
