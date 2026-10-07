import type { CareerRecommendation, MarketSignal, OpportunityNode, CareerDnaProfile } from '../types/alignx';
import { ALL_AUTHENTIC_CAREERS } from './allCareers';

// All 25 Authentic STEAM Careers generated from database/seeds/careers.json via the ALIGNX Decision Engine
export const INITIAL_CAREERS: CareerRecommendation[] = ALL_AUTHENTIC_CAREERS;

export const MARKET_SIGNALS: MarketSignal[] = [
  { sector: 'AI & NEURAL COMPUTE', growthPercent: 31, talentShortage: 'Critical', keyHubs: ['Bangalore', 'Hyderabad', 'Singapore'], driver: 'Enterprise LLM deployments and sovereign GPU clusters' },
  { sector: 'SEMICONDUCTOR & VLSI', growthPercent: 24, talentShortage: 'Critical', keyHubs: ['Chennai', 'Bangalore', 'Berlin'], driver: 'Global supply-chain reshoring & India Semiconductor Mission' },
  { sector: 'AUTONOMOUS ROBOTICS', growthPercent: 18, talentShortage: 'Elevated', keyHubs: ['Pune', 'Chennai', 'Tokyo'], driver: 'Industrial automation, drone logistics & surgical robotics' },
  { sector: 'CYBERSECURITY & DEFENSE TECH', growthPercent: 22, talentShortage: 'Elevated', keyHubs: ['Hyderabad', 'Delhi NCR', 'Tel Aviv'], driver: 'Critical national infrastructure & zero-trust compliance' },
  { sector: 'CLEAN ENERGY & BATTERY TECH', growthPercent: 27, talentShortage: 'Elevated', keyHubs: ['Chennai', 'Pune', 'Toronto'], driver: 'Grid-scale storage, EV chemistries & hydrogen fuel transitions' },
  { sector: 'QUANTITATIVE COMPUTING', growthPercent: 19, talentShortage: 'Stable', keyHubs: ['Mumbai', 'Singapore', 'London'], driver: 'Algorithmic market making and systematic multi-asset funds' }
];

export const OPPORTUNITY_NODES: OpportunityNode[] = [
  { city: 'Bangalore', country: 'India', coordinates: { x: 38, y: 64 }, primarySectors: ['AI Systems', 'Silicon Design', 'SaaS'], avgStartingCtcLakhs: 16.5, livingCostIndex: 'Medium' },
  { city: 'Chennai', country: 'India', coordinates: { x: 42, y: 70 }, primarySectors: ['DeepTech Hardware', 'EV & CleanTech', 'Semiconductors'], avgStartingCtcLakhs: 13.0, livingCostIndex: 'Medium' },
  { city: 'Hyderabad', country: 'India', coordinates: { x: 40, y: 58 }, primarySectors: ['Cloud Infrastructure', 'Cybersecurity', 'Life Sciences'], avgStartingCtcLakhs: 14.5, livingCostIndex: 'Low' },
  { city: 'Pune', country: 'India', coordinates: { x: 32, y: 56 }, primarySectors: ['Automotive Robotics', 'Industrial IoT', 'Embedded'], avgStartingCtcLakhs: 12.0, livingCostIndex: 'Low' },
  { city: 'Singapore', country: 'Singapore', coordinates: { x: 68, y: 72 }, primarySectors: ['Quantitative Finance', 'APAC DeepTech', 'Venture'], avgStartingCtcLakhs: 36.0, livingCostIndex: 'High' },
  { city: 'Berlin', country: 'Germany', coordinates: { x: 22, y: 28 }, primarySectors: ['Applied AI', 'Robotics', 'Industrial 4.0'], avgStartingCtcLakhs: 32.0, livingCostIndex: 'Medium' },
  { city: 'Tokyo', country: 'Japan', coordinates: { x: 88, y: 44 }, primarySectors: ['Kinetic Robotics', 'Semiconductors', 'Precision Sensors'], avgStartingCtcLakhs: 34.0, livingCostIndex: 'High' },
  { city: 'Toronto', country: 'Canada', coordinates: { x: 12, y: 35 }, primarySectors: ['AI Research', 'Quantum Computing', 'Biotech'], avgStartingCtcLakhs: 38.0, livingCostIndex: 'High' }
];

export const DEFAULT_CAREER_DNA: CareerDnaProfile = {
  dominantArchetype: 'SYSTEMS ARCHITECT & ALGORITHMIC STRATEGIST',
  subType: 'Investigative-Analytical (Type 7-A)',
  description: 'You thrive when disassembling ambiguous complex systems into deterministic, predictable mathematical abstractions. Rather than treating decisions as emotional impulses, you evaluate risk surfaces, feedback loops, and long-term leverage.',
  traits: [
    { dimension: 'Algorithmic Decomposition', score: 95, descriptor: 'Investigative & Systematic', implication: 'Naturally divides multi-tier challenges into modular executable pipelines.' },
    { dimension: 'Spatial & Structural Logic', score: 86, descriptor: 'High Architectural Topology', implication: 'Visualizes interconnected dependencies, data flows, and physical constraints.' },
    { dimension: 'Empirical Skepticism', score: 90, descriptor: 'Data-Driven Validation', implication: 'Rejects unfounded claims; relies on verifiable telemetry and measured benchmarks.' },
    { dimension: 'Systemic Persistence', score: 88, descriptor: 'Resilient Debugger', implication: 'Retains cognitive focus through extended root-cause analysis without fatigue.' },
    { dimension: 'Calculated Risk Tolerance', score: 72, descriptor: 'Prudent Opportunist', implication: 'Willing to take non-consensus bets when downside is strictly bounded.' }
  ],
  idealEnvironments: [
    'Deep engineering labs with high individual autonomy',
    'High-signal technical teams with low bureaucracy',
    'Environments prioritizing rigorous logic over organizational politics'
  ]
};

export const LIFE_STAGE_DATA = [
  {
    stage: 'class10' as const,
    label: 'Class 10',
    question: 'WHAT SHOULD I STUDY NEXT?',
    context: 'Subject stream selection (PCM, PCB, Commerce, Arts) + foundational aptitude mapping.',
    deliverable: 'Subject Stream Matrix, Aptitude Diagnostics, 5-Year Horizon Projection'
  },
  {
    stage: 'class12' as const,
    label: 'Class 12',
    question: 'WHAT SHOULD I DO AFTER SCHOOL?',
    context: 'Degree pathways, entrance exam trade-offs, college tier vs. family budget optimization.',
    deliverable: 'Degree Feasibility Matrix, Entrance Strategy, Scholarship Roadmap'
  },
  {
    stage: 'ug' as const,
    label: 'Undergraduate',
    question: 'WHAT SHOULD I SPECIALIZE IN?',
    context: 'Core vs interdisciplinary specializations, industry internships, research vs. employment.',
    deliverable: 'Specialization Radar, Skill Gap Audit, Portfolio Blueprint'
  },
  {
    stage: 'pg' as const,
    label: 'Postgraduate',
    question: 'WHAT COMES NEXT?',
    context: 'R&D leadership vs management tracks, global relocation vs domestic high-growth ecosystems.',
    deliverable: 'Market Yield Analysis, Geographic Opportunity Map, ROI Calculator'
  },
  {
    stage: 'professional' as const,
    label: 'Professional',
    question: 'WHAT SHOULD MY NEXT MOVE BE?',
    context: 'Strategic career pivots, upskilling into emergent technologies, executive vs specialist track.',
    deliverable: 'Pivot Risk Assessment, Compensation Arbitrage, Transition Plan'
  }
];

// Authenticated Cognitive Aptitude Questions from database/seeds/assessment_questions.json
export const APTITUDE_QUESTIONS = [
  {
    "id": 1,
    "dimension": "Logical & Deductive Reasoning",
    "llmTag": "cognitive.logical",
    "weight": 0.2,
    "prompt": "If all Quantum models require Linear Algebra, and System X is a Quantum model, which statement is definitely true?",
    "options": [
      {
        "text": "[A] System X does not use Linear Algebra",
        "score": 5
      },
      {
        "text": "[B] System X requires Linear Algebra",
        "score": 20
      },
      {
        "text": "[C] All Linear Algebra algorithms are Quantum models",
        "score": 5
      },
      {
        "text": "[D] None of the above",
        "score": 5
      }
    ],
    "rationale": "Correct answer is B: System X requires Linear Algebra."
  },
  {
    "id": 2,
    "dimension": "Numerical Facility & Estimation",
    "llmTag": "cognitive.numerical",
    "weight": 0.2,
    "prompt": "A cloud server costs \u20b912,000/month. By migrating to serverless, the cost drops by 35%. What is the annual saving?",
    "options": [
      {
        "text": "[A] \u20b942,000",
        "score": 5
      },
      {
        "text": "[B] \u20b950,400",
        "score": 20
      },
      {
        "text": "[C] \u20b948,000",
        "score": 5
      },
      {
        "text": "[D] \u20b954,200",
        "score": 5
      }
    ],
    "rationale": "Correct answer is B: \u20b950,400."
  },
  {
    "id": 3,
    "dimension": "Systemic & Analytical Problem Solving",
    "llmTag": "cognitive.analytical",
    "weight": 0.2,
    "prompt": "In a distributed pipeline, Node B processes 2x data of Node A, and Node C processes 3x data of Node B. If total records are 180,000, how many does Node B process?",
    "options": [
      {
        "text": "[A] 20,000",
        "score": 5
      },
      {
        "text": "[B] 40,000",
        "score": 20
      },
      {
        "text": "[C] 60,000",
        "score": 5
      },
      {
        "text": "[D] 120,000",
        "score": 5
      }
    ],
    "rationale": "Correct answer is B: 40,000."
  },
  {
    "id": 4,
    "dimension": "Spatial Orientation & 3D Visualization",
    "llmTag": "cognitive.spatial",
    "weight": 0.2,
    "prompt": "A 3D coordinate frame is rotated 90\u00b0 clockwise around the Z-axis. What happens to the positive X-axis orientation?",
    "options": [
      {
        "text": "[A] Points along positive Y-axis",
        "score": 5
      },
      {
        "text": "[B] Points along negative Y-axis",
        "score": 20
      },
      {
        "text": "[C] Points along negative X-axis",
        "score": 5
      },
      {
        "text": "[D] Remains unchanged",
        "score": 5
      }
    ],
    "rationale": "Correct answer is B: Points along negative Y-axis."
  },
  {
    "id": 5,
    "dimension": "Verbal & Conceptual Analogy",
    "llmTag": "cognitive.verbal",
    "weight": 0.2,
    "prompt": "Choose the word most analogous to: 'HEURISTIC' : 'DISCOVERY' :: 'ALGORITHM' : '______'",
    "options": [
      {
        "text": "[A] AMBIGUITY",
        "score": 5
      },
      {
        "text": "[B] PRECISION",
        "score": 20
      },
      {
        "text": "[C] CONJECTURE",
        "score": 5
      },
      {
        "text": "[D] INTUITION",
        "score": 5
      }
    ],
    "rationale": "Correct answer is B: PRECISION."
  }
];

// Authenticated 18 Holland RIASEC Questions from database/seeds/assessment_questions.json
export const DISCOVERY_SCENARIOS = [
  {
    "id": 1,
    "category": "Realistic \u2014 Hands-on, Physical & Hardware Systems",
    "scenario": "How much do you enjoy assembling hardware, operating tools, or building physical prototypes?",
    "choices": [
      {
        "text": "Strongly Enjoy (5/5) \u2014 Energized and highly inclined toward this activity.",
        "tag": "Realistic - High (5/5)"
      },
      {
        "text": "Enjoy (4/5) \u2014 Positively disposed toward engaging in this work.",
        "tag": "Realistic - Medium-High (4/5)"
      },
      {
        "text": "Neutral / Moderate (3/5) \u2014 Balanced or indifferent to this activity.",
        "tag": "Realistic - Neutral (3/5)"
      },
      {
        "text": "Dislike (2/5) \u2014 Prefer alternative intellectual or creative tasks.",
        "tag": "Realistic - Low (2/5)"
      },
      {
        "text": "Strongly Dislike (1/5) \u2014 Avoid this type of activity or experience high friction.",
        "tag": "Realistic - Strongly Dislike (1/5)"
      }
    ]
  },
  {
    "id": 2,
    "category": "Realistic \u2014 Hands-on, Physical & Hardware Systems",
    "scenario": "Do you prefer working outdoors or in a laboratory/workshop with physical equipment rather than at an office desk?",
    "choices": [
      {
        "text": "Strongly Enjoy (5/5) \u2014 Energized and highly inclined toward this activity.",
        "tag": "Realistic - High (5/5)"
      },
      {
        "text": "Enjoy (4/5) \u2014 Positively disposed toward engaging in this work.",
        "tag": "Realistic - Medium-High (4/5)"
      },
      {
        "text": "Neutral / Moderate (3/5) \u2014 Balanced or indifferent to this activity.",
        "tag": "Realistic - Neutral (3/5)"
      },
      {
        "text": "Dislike (2/5) \u2014 Prefer alternative intellectual or creative tasks.",
        "tag": "Realistic - Low (2/5)"
      },
      {
        "text": "Strongly Dislike (1/5) \u2014 Avoid this type of activity or experience high friction.",
        "tag": "Realistic - Strongly Dislike (1/5)"
      }
    ]
  },
  {
    "id": 3,
    "category": "Realistic \u2014 Hands-on, Physical & Hardware Systems",
    "scenario": "How interested are you in diagnosing mechanical, electrical, or robotic hardware malfunctions?",
    "choices": [
      {
        "text": "Strongly Enjoy (5/5) \u2014 Energized and highly inclined toward this activity.",
        "tag": "Realistic - High (5/5)"
      },
      {
        "text": "Enjoy (4/5) \u2014 Positively disposed toward engaging in this work.",
        "tag": "Realistic - Medium-High (4/5)"
      },
      {
        "text": "Neutral / Moderate (3/5) \u2014 Balanced or indifferent to this activity.",
        "tag": "Realistic - Neutral (3/5)"
      },
      {
        "text": "Dislike (2/5) \u2014 Prefer alternative intellectual or creative tasks.",
        "tag": "Realistic - Low (2/5)"
      },
      {
        "text": "Strongly Dislike (1/5) \u2014 Avoid this type of activity or experience high friction.",
        "tag": "Realistic - Strongly Dislike (1/5)"
      }
    ]
  },
  {
    "id": 4,
    "category": "Investigative \u2014 Research, Mathematics & Analytical Modeling",
    "scenario": "How much do you enjoy researching complex scientific problems, exploring mathematical theories, or analyzing data?",
    "choices": [
      {
        "text": "Strongly Enjoy (5/5) \u2014 Energized and highly inclined toward this activity.",
        "tag": "Investigative - High (5/5)"
      },
      {
        "text": "Enjoy (4/5) \u2014 Positively disposed toward engaging in this work.",
        "tag": "Investigative - Medium-High (4/5)"
      },
      {
        "text": "Neutral / Moderate (3/5) \u2014 Balanced or indifferent to this activity.",
        "tag": "Investigative - Neutral (3/5)"
      },
      {
        "text": "Dislike (2/5) \u2014 Prefer alternative intellectual or creative tasks.",
        "tag": "Investigative - Low (2/5)"
      },
      {
        "text": "Strongly Dislike (1/5) \u2014 Avoid this type of activity or experience high friction.",
        "tag": "Investigative - Strongly Dislike (1/5)"
      }
    ]
  },
  {
    "id": 5,
    "category": "Investigative \u2014 Research, Mathematics & Analytical Modeling",
    "scenario": "Do you find satisfaction in uncovering underlying root causes and patterns behind unexplained phenomena?",
    "choices": [
      {
        "text": "Strongly Enjoy (5/5) \u2014 Energized and highly inclined toward this activity.",
        "tag": "Investigative - High (5/5)"
      },
      {
        "text": "Enjoy (4/5) \u2014 Positively disposed toward engaging in this work.",
        "tag": "Investigative - Medium-High (4/5)"
      },
      {
        "text": "Neutral / Moderate (3/5) \u2014 Balanced or indifferent to this activity.",
        "tag": "Investigative - Neutral (3/5)"
      },
      {
        "text": "Dislike (2/5) \u2014 Prefer alternative intellectual or creative tasks.",
        "tag": "Investigative - Low (2/5)"
      },
      {
        "text": "Strongly Dislike (1/5) \u2014 Avoid this type of activity or experience high friction.",
        "tag": "Investigative - Strongly Dislike (1/5)"
      }
    ]
  },
  {
    "id": 6,
    "category": "Investigative \u2014 Research, Mathematics & Analytical Modeling",
    "scenario": "How eager are you to learn new programming paradigms, statistical methods, or scientific literature?",
    "choices": [
      {
        "text": "Strongly Enjoy (5/5) \u2014 Energized and highly inclined toward this activity.",
        "tag": "Investigative - High (5/5)"
      },
      {
        "text": "Enjoy (4/5) \u2014 Positively disposed toward engaging in this work.",
        "tag": "Investigative - Medium-High (4/5)"
      },
      {
        "text": "Neutral / Moderate (3/5) \u2014 Balanced or indifferent to this activity.",
        "tag": "Investigative - Neutral (3/5)"
      },
      {
        "text": "Dislike (2/5) \u2014 Prefer alternative intellectual or creative tasks.",
        "tag": "Investigative - Low (2/5)"
      },
      {
        "text": "Strongly Dislike (1/5) \u2014 Avoid this type of activity or experience high friction.",
        "tag": "Investigative - Strongly Dislike (1/5)"
      }
    ]
  },
  {
    "id": 7,
    "category": "Artistic \u2014 Creative Expression, UI/UX & Open-ended Design",
    "scenario": "How often do you express ideas through visual design, digital sketches, user interfaces, or creative storytelling?",
    "choices": [
      {
        "text": "Strongly Enjoy (5/5) \u2014 Energized and highly inclined toward this activity.",
        "tag": "Artistic - High (5/5)"
      },
      {
        "text": "Enjoy (4/5) \u2014 Positively disposed toward engaging in this work.",
        "tag": "Artistic - Medium-High (4/5)"
      },
      {
        "text": "Neutral / Moderate (3/5) \u2014 Balanced or indifferent to this activity.",
        "tag": "Artistic - Neutral (3/5)"
      },
      {
        "text": "Dislike (2/5) \u2014 Prefer alternative intellectual or creative tasks.",
        "tag": "Artistic - Low (2/5)"
      },
      {
        "text": "Strongly Dislike (1/5) \u2014 Avoid this type of activity or experience high friction.",
        "tag": "Artistic - Strongly Dislike (1/5)"
      }
    ]
  },
  {
    "id": 8,
    "category": "Artistic \u2014 Creative Expression, UI/UX & Open-ended Design",
    "scenario": "Do you prefer unstructured, open-ended problem solving that allows creative freedom over rigid rules?",
    "choices": [
      {
        "text": "Strongly Enjoy (5/5) \u2014 Energized and highly inclined toward this activity.",
        "tag": "Artistic - High (5/5)"
      },
      {
        "text": "Enjoy (4/5) \u2014 Positively disposed toward engaging in this work.",
        "tag": "Artistic - Medium-High (4/5)"
      },
      {
        "text": "Neutral / Moderate (3/5) \u2014 Balanced or indifferent to this activity.",
        "tag": "Artistic - Neutral (3/5)"
      },
      {
        "text": "Dislike (2/5) \u2014 Prefer alternative intellectual or creative tasks.",
        "tag": "Artistic - Low (2/5)"
      },
      {
        "text": "Strongly Dislike (1/5) \u2014 Avoid this type of activity or experience high friction.",
        "tag": "Artistic - Strongly Dislike (1/5)"
      }
    ]
  },
  {
    "id": 9,
    "category": "Artistic \u2014 Creative Expression, UI/UX & Open-ended Design",
    "scenario": "How important is aesthetic elegance, user experience, or brand identity to you when evaluating a product?",
    "choices": [
      {
        "text": "Strongly Enjoy (5/5) \u2014 Energized and highly inclined toward this activity.",
        "tag": "Artistic - High (5/5)"
      },
      {
        "text": "Enjoy (4/5) \u2014 Positively disposed toward engaging in this work.",
        "tag": "Artistic - Medium-High (4/5)"
      },
      {
        "text": "Neutral / Moderate (3/5) \u2014 Balanced or indifferent to this activity.",
        "tag": "Artistic - Neutral (3/5)"
      },
      {
        "text": "Dislike (2/5) \u2014 Prefer alternative intellectual or creative tasks.",
        "tag": "Artistic - Low (2/5)"
      },
      {
        "text": "Strongly Dislike (1/5) \u2014 Avoid this type of activity or experience high friction.",
        "tag": "Artistic - Strongly Dislike (1/5)"
      }
    ]
  },
  {
    "id": 10,
    "category": "Social \u2014 Mentorship, Collaboration & Human Impact",
    "scenario": "How energized do you feel when mentoring, teaching, or explaining difficult technical concepts to peers?",
    "choices": [
      {
        "text": "Strongly Enjoy (5/5) \u2014 Energized and highly inclined toward this activity.",
        "tag": "Social - High (5/5)"
      },
      {
        "text": "Enjoy (4/5) \u2014 Positively disposed toward engaging in this work.",
        "tag": "Social - Medium-High (4/5)"
      },
      {
        "text": "Neutral / Moderate (3/5) \u2014 Balanced or indifferent to this activity.",
        "tag": "Social - Neutral (3/5)"
      },
      {
        "text": "Dislike (2/5) \u2014 Prefer alternative intellectual or creative tasks.",
        "tag": "Social - Low (2/5)"
      },
      {
        "text": "Strongly Dislike (1/5) \u2014 Avoid this type of activity or experience high friction.",
        "tag": "Social - Strongly Dislike (1/5)"
      }
    ]
  },
  {
    "id": 11,
    "category": "Social \u2014 Mentorship, Collaboration & Human Impact",
    "scenario": "Do you prefer collaborative team projects with high interpersonal interaction over solitary tasks?",
    "choices": [
      {
        "text": "Strongly Enjoy (5/5) \u2014 Energized and highly inclined toward this activity.",
        "tag": "Social - High (5/5)"
      },
      {
        "text": "Enjoy (4/5) \u2014 Positively disposed toward engaging in this work.",
        "tag": "Social - Medium-High (4/5)"
      },
      {
        "text": "Neutral / Moderate (3/5) \u2014 Balanced or indifferent to this activity.",
        "tag": "Social - Neutral (3/5)"
      },
      {
        "text": "Dislike (2/5) \u2014 Prefer alternative intellectual or creative tasks.",
        "tag": "Social - Low (2/5)"
      },
      {
        "text": "Strongly Dislike (1/5) \u2014 Avoid this type of activity or experience high friction.",
        "tag": "Social - Strongly Dislike (1/5)"
      }
    ]
  },
  {
    "id": 12,
    "category": "Social \u2014 Mentorship, Collaboration & Human Impact",
    "scenario": "How important is it that your work directly improves human welfare, healthcare, or community well-being?",
    "choices": [
      {
        "text": "Strongly Enjoy (5/5) \u2014 Energized and highly inclined toward this activity.",
        "tag": "Social - High (5/5)"
      },
      {
        "text": "Enjoy (4/5) \u2014 Positively disposed toward engaging in this work.",
        "tag": "Social - Medium-High (4/5)"
      },
      {
        "text": "Neutral / Moderate (3/5) \u2014 Balanced or indifferent to this activity.",
        "tag": "Social - Neutral (3/5)"
      },
      {
        "text": "Dislike (2/5) \u2014 Prefer alternative intellectual or creative tasks.",
        "tag": "Social - Low (2/5)"
      },
      {
        "text": "Strongly Dislike (1/5) \u2014 Avoid this type of activity or experience high friction.",
        "tag": "Social - Strongly Dislike (1/5)"
      }
    ]
  },
  {
    "id": 13,
    "category": "Enterprising \u2014 Strategic Leadership, Risk & Commercialization",
    "scenario": "How comfortable are you taking calculated risks to pitch ideas, launch projects, or persuade stakeholders?",
    "choices": [
      {
        "text": "Strongly Enjoy (5/5) \u2014 Energized and highly inclined toward this activity.",
        "tag": "Enterprising - High (5/5)"
      },
      {
        "text": "Enjoy (4/5) \u2014 Positively disposed toward engaging in this work.",
        "tag": "Enterprising - Medium-High (4/5)"
      },
      {
        "text": "Neutral / Moderate (3/5) \u2014 Balanced or indifferent to this activity.",
        "tag": "Enterprising - Neutral (3/5)"
      },
      {
        "text": "Dislike (2/5) \u2014 Prefer alternative intellectual or creative tasks.",
        "tag": "Enterprising - Low (2/5)"
      },
      {
        "text": "Strongly Dislike (1/5) \u2014 Avoid this type of activity or experience high friction.",
        "tag": "Enterprising - Strongly Dislike (1/5)"
      }
    ]
  },
  {
    "id": 14,
    "category": "Enterprising \u2014 Strategic Leadership, Risk & Commercialization",
    "scenario": "Do you naturally take on leadership roles, delegate responsibilities, and drive teams toward strategic goals?",
    "choices": [
      {
        "text": "Strongly Enjoy (5/5) \u2014 Energized and highly inclined toward this activity.",
        "tag": "Enterprising - High (5/5)"
      },
      {
        "text": "Enjoy (4/5) \u2014 Positively disposed toward engaging in this work.",
        "tag": "Enterprising - Medium-High (4/5)"
      },
      {
        "text": "Neutral / Moderate (3/5) \u2014 Balanced or indifferent to this activity.",
        "tag": "Enterprising - Neutral (3/5)"
      },
      {
        "text": "Dislike (2/5) \u2014 Prefer alternative intellectual or creative tasks.",
        "tag": "Enterprising - Low (2/5)"
      },
      {
        "text": "Strongly Dislike (1/5) \u2014 Avoid this type of activity or experience high friction.",
        "tag": "Enterprising - Strongly Dislike (1/5)"
      }
    ]
  },
  {
    "id": 15,
    "category": "Enterprising \u2014 Strategic Leadership, Risk & Commercialization",
    "scenario": "How motivated are you by commercial outcomes, product-market fit, and startup entrepreneurship?",
    "choices": [
      {
        "text": "Strongly Enjoy (5/5) \u2014 Energized and highly inclined toward this activity.",
        "tag": "Enterprising - High (5/5)"
      },
      {
        "text": "Enjoy (4/5) \u2014 Positively disposed toward engaging in this work.",
        "tag": "Enterprising - Medium-High (4/5)"
      },
      {
        "text": "Neutral / Moderate (3/5) \u2014 Balanced or indifferent to this activity.",
        "tag": "Enterprising - Neutral (3/5)"
      },
      {
        "text": "Dislike (2/5) \u2014 Prefer alternative intellectual or creative tasks.",
        "tag": "Enterprising - Low (2/5)"
      },
      {
        "text": "Strongly Dislike (1/5) \u2014 Avoid this type of activity or experience high friction.",
        "tag": "Enterprising - Strongly Dislike (1/5)"
      }
    ]
  },
  {
    "id": 16,
    "category": "Conventional \u2014 Systematic Processes, Architecture & Data Integrity",
    "scenario": "How much do you value clear processes, systematic documentation, and organized folder structures?",
    "choices": [
      {
        "text": "Strongly Enjoy (5/5) \u2014 Energized and highly inclined toward this activity.",
        "tag": "Conventional - High (5/5)"
      },
      {
        "text": "Enjoy (4/5) \u2014 Positively disposed toward engaging in this work.",
        "tag": "Conventional - Medium-High (4/5)"
      },
      {
        "text": "Neutral / Moderate (3/5) \u2014 Balanced or indifferent to this activity.",
        "tag": "Conventional - Neutral (3/5)"
      },
      {
        "text": "Dislike (2/5) \u2014 Prefer alternative intellectual or creative tasks.",
        "tag": "Conventional - Low (2/5)"
      },
      {
        "text": "Strongly Dislike (1/5) \u2014 Avoid this type of activity or experience high friction.",
        "tag": "Conventional - Strongly Dislike (1/5)"
      }
    ]
  },
  {
    "id": 17,
    "category": "Conventional \u2014 Systematic Processes, Architecture & Data Integrity",
    "scenario": "Do you take pride in precision, error checking, compliance, and maintaining data integrity?",
    "choices": [
      {
        "text": "Strongly Enjoy (5/5) \u2014 Energized and highly inclined toward this activity.",
        "tag": "Conventional - High (5/5)"
      },
      {
        "text": "Enjoy (4/5) \u2014 Positively disposed toward engaging in this work.",
        "tag": "Conventional - Medium-High (4/5)"
      },
      {
        "text": "Neutral / Moderate (3/5) \u2014 Balanced or indifferent to this activity.",
        "tag": "Conventional - Neutral (3/5)"
      },
      {
        "text": "Dislike (2/5) \u2014 Prefer alternative intellectual or creative tasks.",
        "tag": "Conventional - Low (2/5)"
      },
      {
        "text": "Strongly Dislike (1/5) \u2014 Avoid this type of activity or experience high friction.",
        "tag": "Conventional - Strongly Dislike (1/5)"
      }
    ]
  },
  {
    "id": 18,
    "category": "Conventional \u2014 Systematic Processes, Architecture & Data Integrity",
    "scenario": "Do you prefer work with predictable expectations, well-defined metrics, and structured milestones?",
    "choices": [
      {
        "text": "Strongly Enjoy (5/5) \u2014 Energized and highly inclined toward this activity.",
        "tag": "Conventional - High (5/5)"
      },
      {
        "text": "Enjoy (4/5) \u2014 Positively disposed toward engaging in this work.",
        "tag": "Conventional - Medium-High (4/5)"
      },
      {
        "text": "Neutral / Moderate (3/5) \u2014 Balanced or indifferent to this activity.",
        "tag": "Conventional - Neutral (3/5)"
      },
      {
        "text": "Dislike (2/5) \u2014 Prefer alternative intellectual or creative tasks.",
        "tag": "Conventional - Low (2/5)"
      },
      {
        "text": "Strongly Dislike (1/5) \u2014 Avoid this type of activity or experience high friction.",
        "tag": "Conventional - Strongly Dislike (1/5)"
      }
    ]
  }
];
