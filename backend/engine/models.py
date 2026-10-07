"""
Pydantic Data Schemas for the ALIGNX Decision Engine
Author: Himanshu (AI/ML & Decision Engine)
Project: ALIGNX / PRISM Engine (DataQuest 3.0)

Defines strict input and output contracts for student vectors, family constraints,
career knowledge profiles, multi-fit scoring diagnostics, and what-if simulation parameters.
"""

from typing import List, Dict, Optional, Any, Literal
from pydantic import BaseModel, Field, field_validator


# ==============================================================================
# 1. PSYCHOMETRIC & STUDENT SCHEMAS
# ==============================================================================

class AptitudeProfile(BaseModel):
    """Normalized cognitive aptitude scores on scale [0, 100]."""
    logical: float = Field(default=50.0, ge=0.0, le=100.0, description="Logical & Deductive Reasoning")
    numerical: float = Field(default=50.0, ge=0.0, le=100.0, description="Mathematical & Number Facility")
    analytical: float = Field(default=50.0, ge=0.0, le=100.0, description="Systemic Problem Solving")
    spatial: float = Field(default=50.0, ge=0.0, le=100.0, description="Spatial Orientation & 3D Visualization")
    verbal: float = Field(default=50.0, ge=0.0, le=100.0, description="Verbal Comprehension & Communication")


class InterestProfile(BaseModel):
    """Standardized Holland RIASEC Interest dimensions on scale [0, 100]."""
    realistic: float = Field(default=0.0, ge=0.0, le=100.0, description="Realistic (Hands-on, Tool-oriented)")
    investigative: float = Field(default=0.0, ge=0.0, le=100.0, description="Investigative (Analytical, Scientific)")
    artistic: float = Field(default=0.0, ge=0.0, le=100.0, description="Artistic (Creative, Expressive)")
    social: float = Field(default=0.0, ge=0.0, le=100.0, description="Social (Helping, People-oriented)")
    enterprising: float = Field(default=0.0, ge=0.0, le=100.0, description="Enterprising (Leadership, Persuasive)")
    conventional: float = Field(default=0.0, ge=0.0, le=100.0, description="Conventional (Structured, Data-oriented)")


class StudentSkill(BaseModel):
    """Specific technical or domain skill reported or verified for student."""
    skill_id: str = Field(..., alias="skillId", description="Skill identifier matching skills.json")
    proficiency: float = Field(default=50.0, ge=0.0, le=100.0, description="Assessed or self-reported proficiency")

    model_config = {"populate_by_name": True}


class StudentProfileInput(BaseModel):
    """Complete Student Dimension payload supplied to the Decision Engine."""
    id: str = Field(..., description="Student unique ID")
    name: str = Field(default="Student")
    current_education: str = Field(default="12th / Undergraduate", alias="currentEducation")
    location: str = Field(default="Bangalore", description="Current residential city / State")
    willing_to_relocate: bool = Field(default=True, alias="willingToRelocate")
    target_locations: List[str] = Field(default_factory=list, alias="targetLocations")
    interests: InterestProfile = Field(default_factory=InterestProfile)
    aptitude: AptitudeProfile = Field(default_factory=AptitudeProfile)
    skills: List[StudentSkill] = Field(default_factory=list)

    model_config = {"populate_by_name": True}


# ==============================================================================
# 2. FAMILY & FINANCIAL SCHEMAS
# ==============================================================================

class FamilyProfileInput(BaseModel):
    """Family Dimension payload for financial constraints and parental expectations."""
    total_budget_inr: float = Field(
        default=1500000.0,
        ge=0.0,
        alias="totalBudgetINR",
        description="Total family budget available for education across the degree duration"
    )
    loan_willingness_inr: float = Field(
        default=500000.0,
        ge=0.0,
        alias="loanWillingnessINR",
        description="Maximum education loan the family is willing or eligible to take"
    )
    risk_appetite: Literal["low", "medium", "high"] = Field(
        default="medium",
        alias="riskAppetite",
        description="Parent risk tolerance: low (demands stability), medium (balanced), high (open to emerging/startups)"
    )
    expected_salary_lpa: Optional[float] = Field(
        default=None,
        alias="expectedSalaryLPA",
        description="Minimum starting salary in Lakhs Per Annum expected by parents"
    )
    preferred_locations: List[str] = Field(
        default_factory=list,
        alias="preferredLocations",
        description="Cities or states parents strongly prefer the student to study or work in"
    )
    has_parent_response: bool = Field(
        default=True,
        alias="hasParentResponse",
        description="Indicates whether parent has submitted the questionnaire (handles graceful fallback)"
    )

    model_config = {"populate_by_name": True}


# ==============================================================================
# 3. CAREER KNOWLEDGE BASE SCHEMAS (Matches database/seeds/careers.json)
# ==============================================================================

class CareerSkillRequirement(BaseModel):
    skill_id: str = Field(..., alias="skillId")
    name: str
    importance: float = Field(default=0.8, ge=0.0, le=1.0)
    required_level: float = Field(default=80.0, ge=0.0, le=100.0, alias="requiredLevel")

    model_config = {"populate_by_name": True}


class EducationPathway(BaseModel):
    degrees: List[str] = Field(default_factory=list)
    duration_years: int = Field(default=4, alias="durationYears")
    min_degree: str = Field(default="B.Tech / B.E.", alias="minDegree")

    model_config = {"populate_by_name": True}


class CostTier(BaseModel):
    min_inr: float = Field(..., alias="minINR")
    max_inr: float = Field(..., alias="maxINR")
    description: Optional[str] = None

    model_config = {"populate_by_name": True}


class EducationCost(BaseModel):
    govt_tier: CostTier = Field(..., alias="govtTier")
    pvt_tier1: CostTier = Field(..., alias="pvtTier1")
    pvt_tier2: CostTier = Field(..., alias="pvtTier2")
    scholarship_waiver_available: bool = Field(default=True, alias="scholarshipWaiverAvailable")

    model_config = {"populate_by_name": True}


class LPABound(BaseModel):
    min: float
    max: float


class SalaryRange(BaseModel):
    entry_lpa: LPABound = Field(..., alias="entryLPA")
    mid_lpa: LPABound = Field(..., alias="midLPA")
    senior_lpa: LPABound = Field(..., alias="seniorLPA")
    currency: str = "INR"

    model_config = {"populate_by_name": True}


class CareerMarketData(BaseModel):
    hiring_velocity: float = Field(default=75.0, ge=0.0, le=100.0, alias="hiringVelocity")
    growth_score: float = Field(default=75.0, ge=0.0, le=100.0, alias="growthScore")
    disruption_index: float = Field(default=50.0, ge=0.0, le=100.0, alias="disruptionIndex")
    data_date: Optional[str] = Field(default=None, alias="dataDate")
    data_source: Optional[str] = Field(default=None, alias="dataSource")

    model_config = {"populate_by_name": True}


class LocationDemandItem(BaseModel):
    location: str
    demand_score: float = Field(default=70.0, ge=0.0, le=100.0, alias="demandScore")
    cost_index: float = Field(default=70.0, ge=0.0, le=100.0, alias="costIndex")
    hub_specialization: Optional[str] = Field(default=None, alias="hubSpecialization")

    model_config = {"populate_by_name": True}


class CareerProfile(BaseModel):
    """Complete Career Knowledge item matching database/seeds/careers.json."""
    id: str
    name: str
    domain: str
    description: str
    risk_level: Literal["low", "medium", "high"] = Field(default="medium", alias="riskLevel")
    aptitude_profile: AptitudeProfile = Field(..., alias="aptitudeProfile")
    interest_profile: InterestProfile = Field(..., alias="interestProfile")
    skills: List[CareerSkillRequirement] = Field(default_factory=list)
    education_pathway: EducationPathway = Field(..., alias="educationPathway")
    education_cost: EducationCost = Field(..., alias="educationCost")
    salary_range: SalaryRange = Field(..., alias="salaryRange")
    market_data: CareerMarketData = Field(..., alias="marketData")
    location_demand: List[LocationDemandItem] = Field(default_factory=list, alias="locationDemand")
    alternative_careers: List[str] = Field(default_factory=list, alias="alternativeCareers")

    model_config = {"populate_by_name": True}


# ==============================================================================
# 4. DECISION ENGINE OUTPUT SCHEMAS
# ==============================================================================

class ComponentScores(BaseModel):
    """The 5 primary sub-fit dimensions normalized to [0, 100]."""
    student_fit: float = Field(..., ge=0.0, le=100.0, description="Aptitude + RIASEC interest + Skill overlap")
    financial_fit: float = Field(..., ge=0.0, le=100.0, description="Education affordability vs budget & loans")
    family_alignment: float = Field(..., ge=0.0, le=100.0, description="Parent preferences congruence & conflict index")
    market_fit: float = Field(..., ge=0.0, le=100.0, description="Hiring velocity, 5-yr growth, salary potential")
    location_fit: float = Field(..., ge=0.0, le=100.0, description="Regional clusters and mobility feasibility")


class ScoringDiagnostics(BaseModel):
    """Explainable diagnostics and mathematical facts powering the LLM explanation layer."""
    interest_similarity: float = Field(..., description="Cosine similarity of Holland RIASEC vectors (0-100)")
    aptitude_match: float = Field(..., description="Normalized cognitive aptitude score (0-100)")
    skill_overlap_score: float = Field(..., description="Acquired vs required weighted skill match (0-100)")
    conflict_index: float = Field(..., description="Parent-Student Conflict Index (PSCI) (0-100)")
    affordability_margin_inr: float = Field(..., description="Available budget buffer (+) or deficit (-) in INR")
    coverage_ratio: float = Field(..., description="Ratio of available funds to effective degree cost")
    scholarship_offset_applied: bool = Field(default=False)
    primary_match_factor: str = Field(..., description="Dominant reason for recommendation")
    primary_risk_factor: str = Field(..., description="Primary hurdle or constraint")


class CareerScoringResult(BaseModel):
    """Final scored and ranked career object returned to backend API and frontend."""
    career_id: str
    career_name: str
    domain: str
    alignx_score: float = Field(..., ge=0.0, le=100.0, description="Weighted composite score")
    rank: int = Field(..., ge=1)
    component_scores: ComponentScores
    diagnostics: ScoringDiagnostics
    skill_gaps: List[str] = Field(default_factory=list, description="Missing high-importance skills")
    recommended_degree: str = Field(default="")
    median_entry_lpa: float = Field(...)


class EngineConfig(BaseModel):
    """Configurable weights for the multi-factor ALIGNX formula."""
    w_student: float = Field(default=0.35, description="Weight of Student Fit")
    w_financial: float = Field(default=0.20, description="Weight of Financial Fit")
    w_family: float = Field(default=0.15, description="Weight of Family Alignment")
    w_market: float = Field(default=0.20, description="Weight of Market Fit")
    w_location: float = Field(default=0.10, description="Weight of Location Fit")

    @field_validator("w_location")
    @classmethod
    def validate_weights_sum(cls, v: float, info: Any) -> float:
        values = info.data
        total = values.get("w_student", 0) + values.get("w_financial", 0) + values.get("w_family", 0) + values.get("w_market", 0) + v
        if abs(total - 1.0) > 0.001:
            raise ValueError(f"Weights must sum to 1.0, got {total}")
        return v


class WhatIfParameters(BaseModel):
    """Dynamic override parameters for the What-If simulation engine."""
    budget_delta_inr: float = Field(default=0.0, description="Change in family budget (+/- INR)")
    added_skills: List[StudentSkill] = Field(default_factory=list, description="Hypothetical acquired skills")
    override_location: Optional[str] = Field(default=None, description="Hypothetical relocation target city")
    override_risk_appetite: Optional[Literal["low", "medium", "high"]] = None
    override_weights: Optional[EngineConfig] = None
