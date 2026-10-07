"""
ALIGNX LLM Explanation & Narrative Generation Service
Author: Arpit (Data & LLM Layer)
Project: ALIGNX / PRISM Engine (DataQuest 3.0)

This service provides end-to-end integration with Google Gemini for:
1. Career DNA Narrative Synthesis
2. Decision Engine Recommendation Explanations
3. Parent Reassurance & Financial ROI Translations
4. Skill-Gap 3-Year Milestone Roadmaps

Includes a 100% deterministic offline fallback engine for continuous uptime during offline development/testing.
"""

import os
import sys
import json
import re
from typing import Dict, Any, List, Optional

# Import Prompt Templates
try:
    from backend.prompts.templates import (
        SYSTEM_INSTRUCTION,
        build_career_dna_prompt,
        build_recommendation_explanation_prompt,
        build_parent_reassurance_prompt,
        build_skill_gap_roadmap_prompt,
    )
except ImportError:
    # Direct script execution fallback
    sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
    from backend.prompts.templates import (
        SYSTEM_INSTRUCTION,
        build_career_dna_prompt,
        build_recommendation_explanation_prompt,
        build_parent_reassurance_prompt,
        build_skill_gap_roadmap_prompt,
    )


# Graceful Gemini SDK Detection
GEMINI_SDK_AVAILABLE = False
try:
    import google.generativeai as genai
    GEMINI_SDK_AVAILABLE = True
except ImportError:
    try:
        from google import genai
        GEMINI_SDK_AVAILABLE = True
    except ImportError:
        GEMINI_SDK_AVAILABLE = False


def clean_json_response(raw_text: str) -> Dict[str, Any]:
    """Extracts and parses JSON object from LLM response text."""
    text = raw_text.strip()
    # Remove markdown codeblocks if present
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    text = text.strip()

    # Try direct parse
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Regex search for outermost JSON object
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(0))
            except Exception:
                pass
        raise ValueError(f"Could not parse valid JSON from LLM response: {raw_text[:200]}...")


class LLMExplanationService:
    def __init__(self, api_key: Optional[str] = None, model_name: str = "gemini-1.5-flash"):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self.model_name = model_name
        self.client = None
        self.is_online = False

        if self.api_key and GEMINI_SDK_AVAILABLE:
            try:
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel(
                    model_name=self.model_name,
                    system_instruction=SYSTEM_INSTRUCTION
                )
                self.is_online = True
            except Exception as e:
                print(f"⚠️ Gemini SDK initialization notice: {e}. Defaulting to deterministic offline engine.")
                self.is_online = False
        else:
            self.is_online = False

    # =========================================================================
    # 1. Career DNA Synthesis
    # =========================================================================
    def generate_career_dna(
        self,
        student_name: str,
        aptitude: Dict[str, Any],
        interests: Dict[str, Any],
        top_traits: List[str]
    ) -> Dict[str, Any]:
        """Synthesizes student's Career DNA narrative from psychometric & cognitive profiles."""
        if self.is_online:
            try:
                prompt = build_career_dna_prompt(student_name, aptitude, interests, top_traits)
                response = self.model.generate_content(prompt)
                return clean_json_response(response.text)
            except Exception as ex:
                print(f"⚠️ Live LLM invocation error: {ex}. Using deterministic generator.")

        # Deterministic Grounded Fallback
        logical = aptitude.get("logical", 50)
        analytical = aptitude.get("analytical", 50)
        investigative = interests.get("investigative", 50)

        if logical >= 80 and analytical >= 80:
            archetype = "The Deep-Tech Systems Architect"
            summary = f"{student_name} demonstrates exceptional logical reasoning ({logical}/100) and high analytical acumen ({analytical}/100), excelling in decomposing complex computational and scientific architectures."
        elif investigative >= 75:
            archetype = "The Empirical Research Innovator"
            summary = f"{student_name} combines strong investigative curiosity ({investigative}/100) with methodical analytical problem solving, thriving in exploratory research environments."
        else:
            archetype = "The Applied Technology Strategist"
            summary = f"{student_name} possesses a balanced cognitive profile with strong practical execution capabilities across multidisciplinary technical environments."

        return {
            "archetypeTitle": archetype,
            "executiveSummary": summary,
            "primarySuperpowers": [
                f"High-acuity analytical problem decomposition ({analytical}/100)",
                f"Logical pattern synthesis and structured reasoning ({logical}/100)",
                "Rapid technical skill acquisition in quantitative disciplines"
            ],
            "optimalWorkEnvironments": [
                "Advanced computational research labs",
                "High-velocity engineering & data teams"
            ],
            "growthAreas": [
                "Translating complex technical concepts to non-technical stakeholders",
                "Balancing deep exploratory inquiry with rapid production deadlines"
            ]
        }

    # =========================================================================
    # 2. Recommendation Explanation
    # =========================================================================
    def explain_recommendation(
        self,
        student_profile: Dict[str, Any],
        career_data: Dict[str, Any],
        decision_scores: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Explains Decision Engine ranking breakdown in student-friendly terms."""
        if self.is_online:
            try:
                prompt = build_recommendation_explanation_prompt(student_profile, career_data, decision_scores)
                response = self.model.generate_content(prompt)
                return clean_json_response(response.text)
            except Exception as ex:
                print(f"⚠️ Live LLM invocation error: {ex}. Using deterministic generator.")

        # Deterministic Grounded Fallback
        cid = career_data.get("id", "career")
        cname = career_data.get("name", "STEAM Career")
        overall = decision_scores.get("overallScore", 88.0)
        mkt = career_data.get("marketData", {})
        sal = career_data.get("salaryRange", {})
        entry_sal = sal.get("entryLPA", {})

        return {
            "careerId": cid,
            "careerName": cname,
            "overallFitScore": round(float(overall), 1),
            "whyRecommended": f"Strong alignment across your cognitive profile and technical aptitudes, backed by robust national hiring velocity ({mkt.get('hiringVelocity', 85)}/100) and competitive starting salary bands (₹{entry_sal.get('min', 8)}L–₹{entry_sal.get('max', 15)}L).",
            "strengths": [
                f"High cognitive synergy with {cname} core skill requirements",
                f"Strong macroeconomic demand with {mkt.get('hiringVelocity', 85)}/100 hiring velocity",
                "Viable educational pathways across premier government and accredited institutions"
            ],
            "concerns": [
                "Requires consistent structured project portfolio development to stay competitive in top-tier roles"
            ],
            "fitBreakdownNarrative": {
                "studentFit": f"Your logical and problem-solving aptitude matches the top percentile required for {cname}.",
                "financialFit": f"Education costs are highly optimized for government tiers (₹{career_data.get('educationCost', {}).get('govtTier', {}).get('minINR', 600000) / 100000:.1f}L–₹{career_data.get('educationCost', {}).get('govtTier', {}).get('maxINR', 1000000) / 100000:.1f}L) and eligible for merit waivers.",
                "marketFit": f"National industry demand shows a growth score of {mkt.get('growthScore', 90)}/100 across major technology hubs.",
                "locationFit": "High concentration of career opportunities in Bangalore, Hyderabad, and Pune."
            }
        }

    # =========================================================================
    # 3. Parent Reassurance & Financial ROI
    # =========================================================================
    def generate_parent_reassurance(
        self,
        parent_budget: Dict[str, Any],
        parent_expectations: Dict[str, Any],
        career_data: Dict[str, Any],
        financial_fit_score: float = 85.0
    ) -> Dict[str, Any]:
        """Translates career pathways into culturally conscious, respectful financial explanations."""
        if self.is_online:
            try:
                prompt = build_parent_reassurance_prompt(parent_budget, parent_expectations, career_data, financial_fit_score)
                response = self.model.generate_content(prompt)
                return clean_json_response(response.text)
            except Exception as ex:
                print(f"⚠️ Live LLM invocation error: {ex}. Using deterministic generator.")

        # Deterministic Grounded Fallback
        cname = career_data.get("name", "STEAM Career")
        cid = career_data.get("id", "career")
        cost = career_data.get("educationCost", {})
        sal = career_data.get("salaryRange", {})
        govt = cost.get("govtTier", {})
        pvt = cost.get("pvtTier1", {})
        entry = sal.get("entryLPA", {})
        mid = sal.get("midLPA", {})

        return {
            "careerId": cid,
            "executiveSummary": f"{cname} offers a high-stability, high-growth professional trajectory with clear entry pathways through accredited Indian institutions.",
            "financialRoadmap": {
                "budgetStatus": "Within Budget (Govt Tier) / Scholarship Eligible",
                "estimatedCostRange": f"₹{govt.get('minINR', 650000) / 100000:.1f}L – ₹{govt.get('maxINR', 1050000) / 100000:.1f}L (Govt Tier-1) | ₹{pvt.get('minINR', 2400000) / 100000:.1f}L (Private Tier-1)",
                "scholarshipMitigation": "Eligible for Central Sector Scheme and National Scholarship Portal assistance."
            },
            "careerStabilityAndROI": {
                "entrySalaryExpectation": f"₹{entry.get('min', 8)} LPA – ₹{entry.get('max', 15)} LPA",
                "midCareerPotential": f"₹{mid.get('min', 20)} LPA – ₹{mid.get('max', 35)} LPA",
                "industryDemand": "Strong long-term industry expansion across domestic tech leaders and Global Capability Centers (GCCs)."
            },
            "riskMitigationStrategy": "The accredited curriculum builds foundational engineering competencies, ensuring smooth lateral mobility across software, data, and hardware sectors."
        }

    # =========================================================================
    # 4. Skill Gap & 3-Year Milestone Roadmap
    # =========================================================================
    def generate_skill_roadmap(
        self,
        target_career: Dict[str, Any],
        student_skills: Dict[str, int]
    ) -> Dict[str, Any]:
        """Generates actionable 3-phase milestone roadmap."""
        if self.is_online:
            try:
                prompt = build_skill_gap_roadmap_prompt(target_career, student_skills)
                response = self.model.generate_content(prompt)
                return clean_json_response(response.text)
            except Exception as ex:
                print(f"⚠️ Live LLM invocation error: {ex}. Using deterministic generator.")

        # Deterministic Grounded Fallback
        cname = target_career.get("name", "Target Career")
        cid = target_career.get("id", "career")
        req_skills = target_career.get("skills", [])

        gaps = []
        for s in req_skills:
            sid = s.get("skillId", "")
            sname = s.get("name", sid)
            req_lvl = s.get("requiredLevel", 80)
            curr_lvl = student_skills.get(sid, 0)
            if curr_lvl < req_lvl:
                urgency = "high" if (req_lvl - curr_lvl) > 40 else "medium"
                gaps.append({
                    "skillId": sid,
                    "name": sname,
                    "currentLevel": curr_lvl,
                    "requiredLevel": req_lvl,
                    "urgency": urgency
                })

        return {
            "careerId": cid,
            "criticalGaps": gaps[:4],
            "milestonePlan": [
                {
                    "phase": "Months 0–6: Foundations & Core Tools",
                    "targetSkills": [g["name"] for g in gaps[:2]] if gaps else ["Core Programming", "Mathematics"],
                    "actionItems": [
                        "Complete foundational coursework in algorithmic problem solving and programming",
                        "Build 2 portfolio mini-projects to validate core competencies"
                    ],
                    "checkpoint": "Pass foundational skill benchmark assessment and publish code to GitHub."
                },
                {
                    "phase": "Months 6–18: Applied Domain Systems & Project Development",
                    "targetSkills": [g["name"] for g in gaps[2:4]] if len(gaps) >= 4 else ["Domain Systems", "Database Integration"],
                    "actionItems": [
                        "Implement production-grade pipelines and domain-specific architectures",
                        "Participate in national collegiate hackathons and open-source contributions"
                    ],
                    "checkpoint": "Deploy a functional full-scale system and author a technical documentation post."
                },
                {
                    "phase": "Months 18–36: Advanced Specialization & Industry Readiness",
                    "targetSkills": ["System Optimization", "Industry Capstone"],
                    "actionItems": [
                        "Engage in faculty-mentored research or industry internships",
                        "Prepare for competitive technical interviews and campus placements"
                    ],
                    "checkpoint": "Secure a formal pre-placement offer (PPO) or research internship."
                }
            ]
        }
