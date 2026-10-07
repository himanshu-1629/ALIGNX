"""
ALIGNX Prompt Engineering & Anti-Hallucination Template Engine
Author: Arpit (Data & LLM Layer)
Project: ALIGNX / PRISM Engine (DataQuest 3.0)

This module defines system instructions, context formatters, and few-shot prompt
templates that strictly ground Google Gemini in ALIGNX's verified Career Knowledge Base.
"""

import json
from typing import Dict, Any, List


SYSTEM_INSTRUCTION = """You are ALIGNX's Career Intelligence & Explanation AI, an authoritative, culturally-aware, and objective career advisory system for Indian STEAM students and parents.

CRITICAL RULES:
1. STRICT GROUNDING: You MUST ONLY use the facts, salary ranges, exam authorities, and cost bands provided in the structured context. DO NOT hallucinate fake universities, non-existent scholarship schemes, or unverified salary claims.
2. EXPLANATION ONLY: You do NOT rank or alter mathematical scores. You explain the Decision Engine's scores clearly and transparently.
3. OUTPUT FORMAT: You MUST ALWAYS respond in valid, parseable JSON matching the requested schema. No markdown wraps (like ```json), no extraneous conversational preamble.
"""


def build_career_dna_prompt(student_name: str, aptitude: Dict[str, Any], interests: Dict[str, Any], top_traits: List[str]) -> str:
    """Builds prompt for Career DNA synthesis."""
    context = {
        "studentName": student_name,
        "aptitudeProfile": aptitude,
        "interestProfile": interests,
        "topTraits": top_traits
    }
    return f"""Task: Synthesize the student's Career DNA narrative from their psychometric RIASEC profile and 5-factor cognitive aptitude scores.

Context:
{json.dumps(context, indent=2)}

Output JSON Schema:
{{
  "archetypeTitle": "string (e.g. The Deep-Tech Systems Architect)",
  "executiveSummary": "string (2-3 sentences synthesizing core cognitive and vocational identity)",
  "primarySuperpowers": ["string", "string", "string"],
  "optimalWorkEnvironments": ["string", "string"],
  "growthAreas": ["string", "string"]
}}

Respond with raw JSON only.
"""


def build_recommendation_explanation_prompt(
    student_profile: Dict[str, Any],
    career_data: Dict[str, Any],
    decision_scores: Dict[str, Any]
) -> str:
    """Builds prompt to explain why a career was recommended by the Decision Engine."""
    context = {
        "student": student_profile,
        "career": {
            "id": career_data.get("id"),
            "name": career_data.get("name"),
            "domain": career_data.get("domain"),
            "description": career_data.get("description"),
            "riskLevel": career_data.get("riskLevel"),
            "salaryRange": career_data.get("salaryRange"),
            "educationCost": career_data.get("educationCost"),
            "marketData": career_data.get("marketData"),
            "locationDemand": career_data.get("locationDemand")
        },
        "decisionEngineScores": decision_scores
    }
    return f"""Task: Explain why the Decision Engine recommended this career. Connect student strengths, market indicators, and financial viability into a clear explanation.

Context:
{json.dumps(context, indent=2)}

Output JSON Schema:
{{
  "careerId": "{career_data.get('id')}",
  "careerName": "{career_data.get('name')}",
  "overallFitScore": {decision_scores.get('overallScore', 85.0)},
  "whyRecommended": "string (2-3 sentences highlighting student fit, market demand, and viability)",
  "strengths": ["string", "string", "string"],
  "concerns": ["string (or empty if none)"],
  "fitBreakdownNarrative": {{
    "studentFit": "string (1-2 sentences on cognitive/skills synergy)",
    "financialFit": "string (1-2 sentences on college tiers vs budget)",
    "marketFit": "string (1-2 sentences on hiring velocity & disruption index)",
    "locationFit": "string (1-2 sentences on top regional hub demand)"
  }}
}}

Respond with raw JSON only.
"""


def build_parent_reassurance_prompt(
    parent_budget: Dict[str, Any],
    parent_expectations: Dict[str, Any],
    career_data: Dict[str, Any],
    financial_fit_score: float
) -> str:
    """Builds prompt for parent-facing financial and career reassurance."""
    context = {
        "parentFinancialProfile": parent_budget,
        "parentExpectations": parent_expectations,
        "career": {
            "id": career_data.get("id"),
            "name": career_data.get("name"),
            "riskLevel": career_data.get("riskLevel"),
            "educationCost": career_data.get("educationCost"),
            "salaryRange": career_data.get("salaryRange"),
            "scholarships": career_data.get("scholarships"),
            "entranceExams": career_data.get("entranceExams")
        },
        "financialFitScore": financial_fit_score
    }
    return f"""Task: Provide a respectful, culturally conscious parent-facing reassurance summary. Address educational cost feasibility, starting salaries, long-term ROI, and risk mitigation without technical jargon.

Context:
{json.dumps(context, indent=2)}

Output JSON Schema:
{{
  "careerId": "{career_data.get('id')}",
  "executiveSummary": "string (Respectful, clear summary tailored for parents)",
  "financialRoadmap": {{
    "budgetStatus": "string (e.g. Within Budget / Manageable via Govt Tier or Scholarships)",
    "estimatedCostRange": "string (e.g. ₹6.5L–₹10.5L Govt / ₹24L–₹30L Private)",
    "scholarshipMitigation": "string (Key scholarships mentioned in context)"
  }},
  "careerStabilityAndROI": {{
    "entrySalaryExpectation": "string (from context salaryRange)",
    "midCareerPotential": "string (from context salaryRange)",
    "industryDemand": "string (stability and growth summary)"
  }},
  "riskMitigationStrategy": "string (how alternative pathways or core skills safeguard against career risk)"
}}

Respond with raw JSON only.
"""


def build_skill_gap_roadmap_prompt(
    target_career: Dict[str, Any],
    student_skills: Dict[str, int]
) -> str:
    """Builds prompt for skill gap analysis and 36-month phased milestone plan."""
    context = {
        "targetCareer": {
            "id": target_career.get("id"),
            "name": target_career.get("name"),
            "requiredSkills": target_career.get("skills", [])
        },
        "studentCurrentSkills": student_skills
    }
    return f"""Task: Analyze skill gaps and construct an actionable 3-phase milestone roadmap (0-6m, 6-18m, 18-36m) to prepare the student for this STEAM career.

Context:
{json.dumps(context, indent=2)}

Output JSON Schema:
{{
  "careerId": "{target_career.get('id')}",
  "criticalGaps": [
    {{
      "skillId": "string",
      "name": "string",
      "currentLevel": 0,
      "requiredLevel": 0,
      "urgency": "high | medium | low"
    }}
  ],
  "milestonePlan": [
    {{
      "phase": "Months 0–6: Foundations & Core Tools",
      "targetSkills": ["string", "string"],
      "actionItems": ["string", "string"],
      "checkpoint": "string (tangible deliverable or project)"
    }},
    {{
      "phase": "Months 6–18: Intermediate Projects & Applied Systems",
      "targetSkills": ["string", "string"],
      "actionItems": ["string", "string"],
      "checkpoint": "string (tangible deliverable or project)"
    }},
    {{
      "phase": "Months 18–36: Advanced Mastery & Industry Readiness",
      "targetSkills": ["string", "string"],
      "actionItems": ["string", "string"],
      "checkpoint": "string (tangible deliverable or project)"
    }}
  ]
}}

Respond with raw JSON only.
"""
