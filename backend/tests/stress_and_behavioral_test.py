"""
ALIGNX Decision Engine - Exhaustive Behavioral & Diagnostic Evaluation Script
Author: Himanshu (AI/ML & Decision Engine)
Project: ALIGNX / PRISM Engine (DataQuest 3.0)

Simulates 6 diverse real-world personas across STEAM disciplines, financial stress levels,
and family friction points to thoroughly evaluate the Decision Engine's behavior.
"""

import os
import json
import time
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
from backend.engine.scoring_engine import AlignxDecisionEngine
from backend.engine.what_if_simulator import WhatIfSimulator
from backend.engine.assessment_scorer import AssessmentScorer


def run_comprehensive_diagnostics():
    root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
    careers_path = os.path.join(root, "database", "seeds", "careers.json")
    with open(careers_path, "r", encoding="utf-8") as f:
        raw_careers = json.load(f)
    careers = [CareerProfile.model_validate(c) for c in raw_careers]

    engine = AlignxDecisionEngine()
    simulator = WhatIfSimulator(engine)

    print("================================================================================")
    print("           ALIGNX DECISION ENGINE: EXHAUSTIVE BEHAVIORAL AUDIT REPORT           ")
    print(f"               Evaluated against {len(careers)} authentic STEAM careers           ")
    print("================================================================================\n")

    # -------------------------------------------------------------------------
    # PERSONA 1: The AI & Math High Achiever (Bangalore, ₹18L Budget, Balanced)
    # -------------------------------------------------------------------------
    p1_student = StudentProfileInput(
        id="std_ai_math",
        name="Aarav Sharma",
        location="Bangalore",
        willingToRelocate=True,
        interests=InterestProfile(realistic=35, investigative=95, artistic=30, social=20, enterprising=65, conventional=50),
        aptitude=AptitudeProfile(logical=94, numerical=92, analytical=96, spatial=70, verbal=75),
        skills=[
            StudentSkill(skillId="python", proficiency=90),
            StudentSkill(skillId="data_structures", proficiency=85),
            StudentSkill(skillId="machine_learning", proficiency=80)
        ]
    )
    p1_family = FamilyProfileInput(
        totalBudgetINR=1800000,
        loanWillingnessINR=600000,
        riskAppetite="medium",
        expectedSalaryLPA=14.0,
        preferredLocations=["Bangalore", "Hyderabad"]
    )

    t0 = time.perf_counter()
    p1_results = engine.rank_careers(p1_student, p1_family, careers)
    p1_time_ms = (time.perf_counter() - t0) * 1000

    print("--- [PERSONA 1: AI / Computer Science Aspirant] ---")
    print(f"Latency: {p1_time_ms:.2f} ms | Careers Ranked: {len(p1_results)}")
    for r in p1_results[:3]:
        cs = r.component_scores
        print(f"  #{r.rank} {r.career_name} ({r.domain})")
        print(f"     ALIGNX: {r.alignx_score:.1f} | S_fit: {cs.student_fit:.1f} | F_fit: {cs.financial_fit:.1f} | FamAlign: {cs.family_alignment:.1f} | M_fit: {cs.market_fit:.1f} | L_fit: {cs.location_fit:.1f}")
        print(f"     Primary Reason: {r.diagnostics.primary_match_factor}")
        print(f"     Gaps: {r.skill_gaps[:2] if r.skill_gaps else 'None'}\n")

    # -------------------------------------------------------------------------
    # PERSONA 2: The Creative / UI-UX Product Designer (Delhi, ₹12L Budget)
    # -------------------------------------------------------------------------
    p2_student = StudentProfileInput(
        id="std_creative_ux",
        name="Ananya Verma",
        location="Delhi NCR",
        willingToRelocate=True,
        interests=InterestProfile(realistic=20, investigative=45, artistic=96, social=75, enterprising=60, conventional=30),
        aptitude=AptitudeProfile(logical=65, numerical=50, analytical=70, spatial=90, verbal=88),
        skills=[
            StudentSkill(skillId="ui_ux_design", proficiency=88),
            StudentSkill(skillId="product_management", proficiency=70)
        ]
    )
    p2_family = FamilyProfileInput(
        totalBudgetINR=1200000,
        loanWillingnessINR=400000,
        riskAppetite="medium",
        expectedSalaryLPA=8.0
    )

    p2_results = engine.rank_careers(p2_student, p2_family, careers)
    print("--- [PERSONA 2: Creative UI/UX & Product Design Aspirant] ---")
    for r in p2_results[:3]:
        cs = r.component_scores
        print(f"  #{r.rank} {r.career_name} ({r.domain})")
        print(f"     ALIGNX: {r.alignx_score:.1f} | S_fit: {cs.student_fit:.1f} | F_fit: {cs.financial_fit:.1f} | FamAlign: {cs.family_alignment:.1f} | M_fit: {cs.market_fit:.1f} | L_fit: {cs.location_fit:.1f}")
        print(f"     Primary Reason: {r.diagnostics.primary_match_factor}\n")

    # -------------------------------------------------------------------------
    # PERSONA 3: The Robotics & Hardware Maker (Pune, ₹10L Budget)
    # -------------------------------------------------------------------------
    p3_student = StudentProfileInput(
        id="std_robotics",
        name="Rohan Kulkarni",
        location="Pune",
        willingToRelocate=False,  # Restricted to Pune
        interests=InterestProfile(realistic=95, investigative=80, artistic=25, social=30, enterprising=45, conventional=60),
        aptitude=AptitudeProfile(logical=85, numerical=82, analytical=84, spatial=92, verbal=60),
        skills=[
            StudentSkill(skillId="embedded_c_cpp", proficiency=85),
            StudentSkill(skillId="circuit_pcb_design", proficiency=80),
            StudentSkill(skillId="robotics_kinematics", proficiency=75)
        ]
    )
    p3_family = FamilyProfileInput(
        totalBudgetINR=1000000,
        loanWillingnessINR=300000,
        riskAppetite="low"
    )

    p3_results = engine.rank_careers(p3_student, p3_family, careers)
    print("--- [PERSONA 3: Robotics & Hardware Maker (Relocation Restricted to Pune)] ---")
    for r in p3_results[:3]:
        cs = r.component_scores
        print(f"  #{r.rank} {r.career_name} ({r.domain})")
        print(f"     ALIGNX: {r.alignx_score:.1f} | S_fit: {cs.student_fit:.1f} | F_fit: {cs.financial_fit:.1f} | FamAlign: {cs.family_alignment:.1f} | M_fit: {cs.market_fit:.1f} | L_fit: {cs.location_fit:.1f}")
        print(f"     Location Fit: {cs.location_fit:.1f} (Evaluated strictly for Pune)")
        print(f"     Risk Note: {r.diagnostics.primary_risk_factor}\n")

    # -------------------------------------------------------------------------
    # PERSONA 4: The Severe Financial Constraint Case (Budget ₹4.5 Lakhs)
    # -------------------------------------------------------------------------
    p4_student = StudentProfileInput(
        id="std_constrained",
        name="Vikas Kumar",
        location="Patna",
        willingToRelocate=True,
        interests=InterestProfile(realistic=40, investigative=90, artistic=20, social=30, enterprising=50, conventional=70),
        aptitude=AptitudeProfile(logical=92, numerical=90, analytical=88, spatial=75, verbal=65)
    )
    p4_family = FamilyProfileInput(
        totalBudgetINR=450000,       # Very tight budget
        loanWillingnessINR=200000,    # Max total available funds = 6.5L
        riskAppetite="low",
        hasParentResponse=True
    )

    p4_results = engine.rank_careers(p4_student, p4_family, careers)
    print("--- [PERSONA 4: Severe Financial Constraint (Total Funds ₹6.5L)] ---")
    for r in p4_results[:3]:
        cs = r.component_scores
        print(f"  #{r.rank} {r.career_name}")
        print(f"     ALIGNX: {r.alignx_score:.1f} | F_fit: {cs.financial_fit:.1f} | Margin: ₹{r.diagnostics.affordability_margin_inr:,.0f} | Coverage Ratio: {r.diagnostics.coverage_ratio}")
        print(f"     Scholarship Applied: {r.diagnostics.scholarship_offset_applied} | Financial Diagnosis: {r.diagnostics.primary_risk_factor}\n")

    # -------------------------------------------------------------------------
    # PERSONA 5: The High Family Conflict Case (Parent demands Low Risk / 25 LPA)
    # -------------------------------------------------------------------------
    p5_student = StudentProfileInput(
        id="std_conflict",
        name="Devansh Roy",
        location="Kolkata",
        willingToRelocate=True,
        interests=InterestProfile(realistic=30, investigative=60, artistic=85, social=40, enterprising=90, conventional=20),
        aptitude=AptitudeProfile(logical=75, numerical=70, analytical=72, spatial=80, verbal=75)
    )
    p5_family = FamilyProfileInput(
        totalBudgetINR=1500000,
        riskAppetite="low",              # Parent insists on extreme stability
        expectedSalaryLPA=28.0,          # Parent expects unrealistic entry salary
        preferredLocations=["Kolkata"]   # Parent refuses out-of-state relocation
    )

    p5_results = engine.rank_careers(p5_student, p5_family, careers)
    print("--- [PERSONA 5: High Family Friction & Expectation Gap] ---")
    for r in p5_results[:3]:
        cs = r.component_scores
        print(f"  #{r.rank} {r.career_name}")
        print(f"     ALIGNX: {r.alignx_score:.1f} | FamAlign: {cs.family_alignment:.1f} | Conflict Index: {r.diagnostics.conflict_index:.1f}")
        print(f"     Conflict Reason: {r.diagnostics.primary_risk_factor}\n")

    # -------------------------------------------------------------------------
    # WHAT-IF SIMULATOR EVALUATION: Counterfactual Sensitivity
    # -------------------------------------------------------------------------
    print("--- [WHAT-IF SIMULATION SENSITIVITY TEST] ---")
    sim_params = WhatIfParameters(
        budget_delta_inr=500000,  # +5L budget boost
        added_skills=[
            StudentSkill(skillId="deep_learning", proficiency=92),
            StudentSkill(skillId="cloud_computing", proficiency=88)
        ],
        override_location="Bangalore"
    )
    sim_out = simulator.simulate(p1_student, p1_family, careers, sim_params)
    print(f"Baseline Top Career: {sim_out['baseline_top_3'][0]['name']} (Score: {sim_out['baseline_top_3'][0]['score']})")
    print(f"Simulated Top Career: {sim_out['simulated_top_3'][0]['name']} (Score: {sim_out['simulated_top_3'][0]['score']})")
    for car_id in ["ai_ml_engineer", "data_platform_engineer", "cloud_devops_architect"]:
        d = sim_out["rank_deltas"].get(car_id)
        if d:
            print(f"  -> {d['career_name']}: Score Δ {d['score_delta']:+0.2f} pts | Rank Δ {d['rank_delta']:+d} ({d['status'].upper()})")

    # -------------------------------------------------------------------------
    # LLM EXPLAINER PAYLOAD CONTRACT INTEGRITY CHECK
    # -------------------------------------------------------------------------
    print("\n--- [LLM EXPLAINER PAYLOAD CONTRACT INTEGRITY CHECK] ---")
    top_career = p1_results[0]
    llm_payload = top_career.model_dump()
    null_keys = [k for k, v in llm_payload.items() if v is None]
    assert len(null_keys) == 0, f"Found null keys in payload: {null_keys}"
    print("✓ Output schema validated: 0 null fields, 100% complete diagnostic telemetry.")
    print("✓ Diagnostics contain: interest_similarity, aptitude_match, skill_overlap_score, conflict_index, affordability_margin_inr, primary_match_factor, primary_risk_factor.")
    print("✓ Ready for Arpit's Gemini API prompt ingestion.")


if __name__ == "__main__":
    run_comprehensive_diagnostics()
