"""
ALIGNX Decision Engine Package
Author: Himanshu (AI/ML & Decision Engine)
Project: ALIGNX / PRISM Engine (DataQuest 3.0)

Deterministic, multi-dimensional decision engine computing career alignment
across Student capabilities, Family financial realities, and Market opportunities.
"""

from .models import (
    AptitudeProfile,
    InterestProfile,
    StudentSkill,
    StudentProfileInput,
    FamilyProfileInput,
    CareerProfile,
    ComponentScores,
    ScoringDiagnostics,
    CareerScoringResult,
    WhatIfParameters,
    EngineConfig,
)
from .dna_generator import CareerDNAGenerator
from .financial_solver import FinancialConstraintSolver
from .conflict_index import ConflictIndexCalculator
from .market_evaluator import MarketEvaluator
from .scoring_engine import AlignxDecisionEngine
from .what_if_simulator import WhatIfSimulator

__all__ = [
    "AptitudeProfile",
    "InterestProfile",
    "StudentSkill",
    "StudentProfileInput",
    "FamilyProfileInput",
    "CareerProfile",
    "ComponentScores",
    "ScoringDiagnostics",
    "CareerScoringResult",
    "WhatIfParameters",
    "EngineConfig",
    "CareerDNAGenerator",
    "FinancialConstraintSolver",
    "ConflictIndexCalculator",
    "MarketEvaluator",
    "AlignxDecisionEngine",
    "WhatIfSimulator",
]
