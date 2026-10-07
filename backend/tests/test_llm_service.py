"""
ALIGNX LLM Explanation Service & Schema Conformance Test Suite
Author: Arpit (Data & LLM Layer)
Project: ALIGNX / PRISM Engine (DataQuest 3.0)
"""

import os
import sys
import json
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from backend.services.llm_service import LLMExplanationService


class TestLLMService(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.service = LLMExplanationService()
        seed_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../database/seeds/careers.json"))
        with open(seed_path, "r", encoding="utf-8") as f:
            cls.careers = json.load(f)
        cls.ai_engineer = next((c for c in cls.careers if c["id"] == "ai_ml_engineer"), cls.careers[0])

    def test_career_dna_synthesis(self):
        """Test Career DNA narrative synthesis matches schema."""
        result = self.service.generate_career_dna(
            student_name="Aarav Sharma",
            aptitude={"logical": 92, "numerical": 88, "analytical": 95, "spatial": 72, "verbal": 68},
            interests={"realistic": 45, "investigative": 95, "artistic": 30, "social": 25, "enterprising": 60, "conventional": 50},
            top_traits=["Analytical", "Builder"]
        )
        self.assertIn("archetypeTitle", result)
        self.assertIn("executiveSummary", result)
        self.assertIsInstance(result["primarySuperpowers"], list)
        self.assertTrue(len(result["primarySuperpowers"]) > 0)
        self.assertIsInstance(result["growthAreas"], list)
        print("\n✅ Career DNA Test Passed:", result["archetypeTitle"])

    def test_recommendation_explanation(self):
        """Test Decision Engine recommendation explanation matches API doc Section 21."""
        student = {
            "name": "Aarav",
            "aptitude": {"logical": 92, "numerical": 88, "analytical": 95}
        }
        decision_scores = {
            "overallScore": 91.5,
            "studentFit": 93.0,
            "financialFit": 88.0,
            "marketFit": 95.0,
            "locationFit": 90.0
        }
        result = self.service.explain_recommendation(student, self.ai_engineer, decision_scores)
        self.assertEqual(result["careerId"], "ai_ml_engineer")
        self.assertIn("whyRecommended", result)
        self.assertIsInstance(result["strengths"], list)
        self.assertIn("fitBreakdownNarrative", result)
        self.assertIn("studentFit", result["fitBreakdownNarrative"])
        self.assertIn("financialFit", result["fitBreakdownNarrative"])
        print("✅ Recommendation Explanation Test Passed:", result["careerName"])

    def test_parent_reassurance(self):
        """Test parent reassurance and financial ROI summary."""
        parent_budget = {
            "income_range": "6L_12L",
            "education_budget": 1000000,
            "risk_appetite": "moderate"
        }
        parent_expectations = {
            "priority_factors": ["stability", "salary", "prestige"]
        }
        result = self.service.generate_parent_reassurance(parent_budget, parent_expectations, self.ai_engineer)
        self.assertEqual(result["careerId"], "ai_ml_engineer")
        self.assertIn("financialRoadmap", result)
        self.assertIn("careerStabilityAndROI", result)
        self.assertIn("riskMitigationStrategy", result)
        print("✅ Parent Reassurance Test Passed:", result["executiveSummary"][:60], "...")

    def test_skill_gap_roadmap(self):
        """Test skill-gap analysis and 3-year phased milestone plan."""
        student_skills = {
            "python": 70,
            "deep_learning": 20,
            "machine_learning": 40
        }
        result = self.service.generate_skill_roadmap(self.ai_engineer, student_skills)
        self.assertEqual(result["careerId"], "ai_ml_engineer")
        self.assertIsInstance(result["criticalGaps"], list)
        self.assertIsInstance(result["milestonePlan"], list)
        self.assertEqual(len(result["milestonePlan"]), 3)
        self.assertIn("Months 0–6", result["milestonePlan"][0]["phase"])
        print("✅ Skill Gap & 3-Year Roadmap Test Passed: 3 phases generated.")


if __name__ == "__main__":
    unittest.main()
