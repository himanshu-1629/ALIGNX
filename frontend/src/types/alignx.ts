export type LifeStage = 'class10' | 'class12' | 'ug' | 'pg' | 'professional';

export interface StudentProfile {
  name: string;
  stage: LifeStage;
  currentField: string;
  location: string;
  preferredLocations: string[];
  budgetAnnualLakhs: number;
  riskTolerance: 'low' | 'moderate' | 'high';
  aspirations: string[];
  interests: string[];
  targetSalaryLakhs?: number;
  preferredCountry?: string;
}

export interface AssessmentDraftState {
  profile: StudentProfile;
  discovery: {
    currentIdx: number;
    selectedChoices: Record<number, any>;
    isFinished: boolean;
  };
  aptitude: {
    currentIdx: number;
    selectedAnswers: Record<number, number>;
    score: number | null;
    metrics: AptitudeMetricScores | null;
    showResults: boolean;
  };
  dna: {
    dominantArchetype?: string;
    subType?: string;
    description?: string;
  };
}

export interface DimensionScores {
  aptitude: number;
  interest: number;
  aspiration: number;
  riskAppetite: number;
  financialFeasibility: number;
  familyAlignment: number;
  marketDemand: number;
  locationFit: number;
}

export interface CareerScoreBreakdown {
  studentFit: number;      // 35%
  financialFit: number;    // 20%
  familyAlignment: number; // 15%
  marketFit: number;       // 20%
  locationFit: number;     // 10%
  overallScore: number;
}

export interface CareerRecommendation {
  id: string;
  title: string;
  domain: string;
  tagline: string;
  scores: CareerScoreBreakdown;
  growthRate: string;
  salaryRange: string;
  riskLevel: 'Low' | 'Moderate' | 'High';
  topLocations: string[];
  requiredSkills: string[];
  studentSkillGaps: string[];
  strengthsMatch: string[];
  whyRecommended: string[];
  educationPath: string;
  entranceExams: string[];
  scholarships: string[];
}

export interface MarketSignal {
  sector: string;
  growthPercent: number;
  talentShortage: 'Critical' | 'Elevated' | 'Stable';
  keyHubs: string[];
  driver: string;
}

export interface OpportunityNode {
  city: string;
  country: string;
  coordinates: { x: number; y: number }; // normalized 0-100%
  primarySectors: string[];
  avgStartingCtcLakhs: number;
  livingCostIndex: 'Low' | 'Medium' | 'High';
}

export interface ParentInput {
  id?: string;
  parentId?: string;
  name: string;
  relation: string;
  email?: string;
  phone?: string;
  maxBudgetAnnualLakhs: number;
  preferredLocations: string[];
  riskAppetite: 'low' | 'moderate' | 'high';
  priorityFocus: 'Stability' | 'High Growth' | 'Immediate ROI' | 'Work-Life Balance';
  conflictPoints: string[];
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  invitationToken?: string;
  invitationUrl?: string;
}

export interface CareerDnaTrait {
  dimension: string;
  score: number;
  descriptor: string;
  implication: string;
}

export interface CareerDnaProfile {
  dominantArchetype: string;
  subType: string;
  description: string;
  traits: CareerDnaTrait[];
  idealEnvironments: string[];
}

export interface AptitudeMetricScores {
  abstractLogic: number;
  systemsThinking: number;
  quantitativeEstimation: number;
  spatialArchitecture: number;
  riskTolerance: number;
}

export interface AptitudeQuestion {
  id: number;
  dimension: string;
  llmTag: string;
  weight: number;
  prompt: string;
  options: {
    text: string;
    score: number;
    subDimension?: string;
  }[];
  rationale: string;
}

export interface DiscoveryScenario {
  id: number;
  category: string;
  llmMetric: string;
  scenario: string;
  choices: {
    text: string;
    tag: string;
    scoreContribution: Record<string, number>;
  }[];
}

export interface AlignxSessionProgress {
  lastActiveView: string;
  completedStages: {
    onboarding: boolean;
    discovery: boolean;
    aptitude: boolean;
    dna: boolean;
    parent: boolean;
    dashboard: boolean;
  };
  studentProfile?: StudentProfile;
  aptitudeScore?: number;
  aptitudeMetrics?: AptitudeMetricScores;
  parentInputDone: boolean;
  parentData?: {
    name: string;
    relation: string;
    maxBudgetAnnualLakhs: number;
    preferredLocations: string[];
    priorityFocus: string;
    riskAppetite: 'low' | 'moderate' | 'high';
    maxRelocationKm: number;
  };
  updatedAt: string;
}
