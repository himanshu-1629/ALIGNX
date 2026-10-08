import { GoogleGenAI } from '@google/genai';
import { IStudent } from '../models/Student';
import { ICareer } from '../models/Career';
import { IScoreComponents } from '../models/Recommendation';
import { ISingleSkillGap } from '../models/SkillGap';
import { IRoadmapMilestone } from '../models/Roadmap';

// Initialize Gemini Client dynamically
let cachedKey: string | null = null;
let genAIClient: GoogleGenAI | null = null;
const defaultModelName = process.env.GEMINI_MODEL_NAME || 'gemini-3.5-flash-lite';

function getGenAIClient(): GoogleGenAI | null {
  const currentKey = process.env.GEMINI_API_KEY;
  if (!currentKey || currentKey.trim() === '') {
    return null;
  }
  if (currentKey !== cachedKey || !genAIClient) {
    try {
      genAIClient = new GoogleGenAI({ apiKey: currentKey.trim() });
      cachedKey = currentKey;
    } catch (err) {
      console.warn('[LLMService] Failed to initialize GoogleGenAI client:', err);
      return null;
    }
  }
  return genAIClient;
}

export interface RecommendationExplanationResult {
  whyRecommended: string;
  strengths: string[];
  concerns: string[];
  summary: string;
}

export interface RoadmapGenerationResult {
  roadmapTitle: string;
  targetRole: string;
  description: string;
  milestones: IRoadmapMilestone[];
}

/**
 * Service to generate AI explanations and roadmaps using Gemini
 * with bulletproof domain-expert deterministic fallbacks.
 */
export class LLMService {
  private static explanationCache = new Map<string, RecommendationExplanationResult>();

  /**
   * Generate narrative explanation for career recommendation
   */
  public static async generateExplanation(
    student: IStudent,
    career: ICareer,
    scores: IScoreComponents,
    overallScore: number
  ): Promise<RecommendationExplanationResult> {
    const snap = student.aptitudeSnapshot;
    const dna = student.careerDna;
    const cacheKey = `${student._id || 'anon'}_${career._id || career.name}_${overallScore}_${snap?.logical}_${snap?.numerical}_${dna?.primaryTrait}`;

    if (this.explanationCache.has(cacheKey)) {
      return this.explanationCache.get(cacheKey)!;
    }

    // Fallback template
    const fallback = this.buildFallbackExplanation(student, career, scores, overallScore);
    const client = getGenAIClient();

    if (!client) {
      this.explanationCache.set(cacheKey, fallback);
      return fallback;
    }

    try {
      const aptitudeDesc = snap
        ? `Logical Reasoning: ${snap.logical}%, Numerical Facility: ${snap.numerical}%, Analytical Systems: ${snap.analytical}%, Spatial Topology: ${snap.spatial}%, Verbal/Relational: ${snap.verbal}%`
        : 'Cognitive baseline calibrated at 75% cohort average';

      const riasecDesc = dna?.traitScores
        ? `Realistic (Builder): ${dna.traitScores.builder ?? 65}%, Investigative (Science): ${dna.traitScores.analytical ?? 70}%, Artistic (Design): ${dna.traitScores.creative ?? 60}%, Social (Mentorship): ${dna.traitScores.social ?? 60}%, Enterprising (Leadership): ${dna.traitScores.leadership ?? 65}%, Conventional (Precision): ${dna.traitScores.risk ?? 65}%`
        : 'Holland RIASEC profile aligned with technical systems';

      const prompt = `
You are the AI Career Intelligence Advisor for ALIGNX.
Analyze this student's match for the role "${career.name}" using their authentic multi-dimensional assessment telemetry.

Student Assessment Profile:
- Education / Stage: ${student.educationLevel || 'Undergraduate'}
- Measured 5D Cognitive Aptitude: ${aptitudeDesc}
- Holland RIASEC Behavioral Traits: ${riasecDesc}
- Primary Career DNA Archetype: ${dna?.primaryTrait || 'Systems Architect & Algorithmic Strategist'}
- Secondary Archetypes: ${(dna?.secondaryTraits || []).join(', ') || 'Analytical Builder'}
- Current Academic Skills: ${student.skills.map((s) => `${s.name} (${s.proficiency}%)`).join(', ') || 'Foundational engineering'}
- Domain Interests: ${student.interests.map((i) => i.name).join(', ') || 'STEAM innovation'}

Target Career Requirements:
- Career: ${career.name} (${career.category})
- Required Skills: ${career.requiredSkills?.map((s) => `${s.skillName} (Benchmark: ${s.requiredLevel || 75}%)`).join(', ')}
- Required Aptitude Baseline: ${JSON.stringify(career.aptitudeProfile || {})}
- Risk Profile: ${career.riskLevel}

Calibrated Decision Engine Match Scores (out of 100):
- Overall Match: ${overallScore}%
- Student Fit (Skills & Cognitive Aptitude): ${scores.studentFit}%
- Financial Feasibility (Family Budget Envelope): ${scores.financialFit}%
- Family Alignment: ${scores.familyAlignment}%
- Market Demand & Velocity: ${scores.marketFit}%
- Location Cluster Fit: ${scores.locationFit}%

Respond strictly in valid JSON format with this exact structure:
{
  "whyRecommended": "2-3 sentences explaining concretely how the student's specific cognitive aptitude scores and RIASEC archetype power their success in ${career.name}.",
  "strengths": ["Direct strength citing specific aptitude or RIASEC dimension", "Concrete advantage matching career requirements", "Market alignment strength"],
  "concerns": ["Specific skill or aptitude vector to reinforce for this career"],
  "summary": "1 sentence executive summary connecting their primary archetype to this pathway."
}
Only output raw JSON without markdown code fences.
`;

      const response = await client.models.generateContent({
        model: defaultModelName,
        contents: prompt
      });

      const text = response.text?.trim() || '';
      const cleanJson = text.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
      const parsed = JSON.parse(cleanJson);

      const result: RecommendationExplanationResult = {
        whyRecommended: parsed.whyRecommended || fallback.whyRecommended,
        strengths: Array.isArray(parsed.strengths) && parsed.strengths.length > 0 ? parsed.strengths : fallback.strengths,
        concerns: Array.isArray(parsed.concerns) && parsed.concerns.length > 0 ? parsed.concerns : fallback.concerns,
        summary: parsed.summary || fallback.summary
      };

      this.explanationCache.set(cacheKey, result);
      return result;
    } catch (error) {
      console.warn('[LLMService] Gemini explanation generation note (using personalized fallback):', (error as Error).message);
      this.explanationCache.set(cacheKey, fallback);
      return fallback;
    }
  }

  /**
   * Generate structured multi-phase learning roadmap
   */
  public static async generateRoadmap(
    student: IStudent,
    career: ICareer,
    skillGaps: ISingleSkillGap[]
  ): Promise<RoadmapGenerationResult> {
    const fallback = this.buildFallbackRoadmap(career, skillGaps);
    const client = getGenAIClient();

    if (!client) {
      return fallback;
    }

    try {
      const topGaps = skillGaps
        .filter((g) => g.gap > 0)
        .slice(0, 5)
        .map((g) => `${g.skillName} (Current: ${g.currentLevel}%, Target: ${g.requiredLevel}%, Priority: ${g.priority})`)
        .join('; ');

      const prompt = `
You are the ALIGNX Personalized Roadmap Engine.
Design a 4-phase career preparation roadmap for student transitioning to "${career.name}".
Primary skill gaps to close: ${topGaps || 'Foundational competencies'}

Phases required:
1. Phase 1: Foundation (Core theories, fundamentals, prerequisites)
2. Phase 2: Skill Development (Applied tools, frameworks, and core technologies)
3. Phase 3: Projects & Portfolio (Real-world capstones and open-source proofs of competence)
4. Phase 4: Professional Readiness (Mock interviews, resume refinement, internships)

Respond strictly in valid JSON format matching this schema:
{
  "roadmapTitle": "Personalized Roadmap: ${career.name}",
  "targetRole": "${career.name}",
  "description": "Comprehensive personalized roadmap to transition into ${career.name}.",
  "milestones": [
    {
      "phase": 1,
      "sequence": 1,
      "title": "Milestone title",
      "description": "Actionable milestone detail",
      "category": "course",
      "skillsCovered": ["Skill A"],
      "recommendedResources": [{"title": "Resource Name", "type": "course"}],
      "estimatedDuration": "3-4 weeks",
      "status": "pending"
    }
  ]
}
Only output raw JSON without markdown code fences.
`;

      const response = await client.models.generateContent({
        model: defaultModelName,
        contents: prompt
      });

      const text = response.text?.trim() || '';
      const cleanJson = text.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
      const parsed = JSON.parse(cleanJson);

      if (Array.isArray(parsed.milestones) && parsed.milestones.length > 0) {
        return {
          roadmapTitle: parsed.roadmapTitle || fallback.roadmapTitle,
          targetRole: parsed.targetRole || fallback.targetRole,
          description: parsed.description || fallback.description,
          milestones: parsed.milestones
        };
      }
      return fallback;
    } catch (error) {
      console.warn('[LLMService] Gemini roadmap generation failed, using rule-based fallback:', (error as Error).message);
      return fallback;
    }
  }

  /**
   * Deterministic explanation builder fallback
   */
  private static buildFallbackExplanation(
    student: IStudent,
    career: ICareer,
    scores: IScoreComponents,
    overallScore: number
  ): RecommendationExplanationResult {
    const strengths: string[] = [];
    const concerns: string[] = [];

    // 1. Detailed Aptitude Strength/Concern Mapping
    const snap = student.aptitudeSnapshot;
    if (snap) {
      const dimMap: Array<{ key: keyof typeof snap; label: string; val: number }> = [
        { key: 'logical', label: 'Logical & Deductive Reasoning', val: snap.logical || 75 },
        { key: 'numerical', label: 'Quantitative & Numerical Facility', val: snap.numerical || 75 },
        { key: 'analytical', label: 'Systems & Analytical Problem Solving', val: snap.analytical || 75 },
        { key: 'spatial', label: 'Spatial Architecture & Topology', val: snap.spatial || 75 },
        { key: 'verbal', label: 'Verbal & Relational Strategy', val: snap.verbal || 75 }
      ];
      const sortedDims = [...dimMap].sort((a, b) => b.val - a.val);
      const topDim = sortedDims[0];
      const lowestDim = sortedDims[sortedDims.length - 1];

      if (topDim && topDim.val >= 80) {
        strengths.push(`Measured high aptitude in ${topDim.label} (${topDim.val}%), providing deep cognitive leverage for ${career.name}.`);
      }

      if (lowestDim && lowestDim.val < 65) {
        concerns.push(`Baseline score in ${lowestDim.label} (${lowestDim.val}%) suggests targeted practice in foundational problem sets will accelerate readiness.`);
      }
    }

    // 2. Behavioral RIASEC Archetype Match
    if (student.careerDna?.primaryTrait) {
      strengths.push(`Behavioral archetype (${student.careerDna.primaryTrait}) demonstrates natural synergy with daily responsibilities in ${career.name}.`);
    }

    if (scores.studentFit >= 80) {
      strengths.push(`Strong overall student fit index (${scores.studentFit}%) across required competencies and cognitive baselines.`);
    }

    if (scores.marketFit >= 85) {
      strengths.push(`Robust nationwide industry demand with high hiring velocity and strong compensation growth (${scores.marketFit}%).`);
    }

    if (scores.financialFit >= 80) {
      strengths.push(`Degree and education pathway is fully aligned with your family financial planning (${scores.financialFit}%).`);
    } else if (scores.financialFit < 65) {
      concerns.push(`Estimated educational investment may benefit from merit scholarships or early financing support.`);
    }

    if (scores.familyAlignment < 70) {
      concerns.push(`Family risk preferences lean towards higher immediate stability; joint alignment review recommended.`);
    }

    const whyRecommended = `Your calibrated profile demonstrates an overall ${overallScore}% fit for ${career.name}. ` +
      `Your cognitive strengths in ${snap ? `logical (${snap.logical}%) and analytical systems (${snap.analytical}%)` : 'systemic problem solving'} ` +
      `combined with your ${student.careerDna?.primaryTrait || 'Technical'} archetype position you to thrive in this high-demand field.`;

    const summary = `${career.name} delivers strong deterministic alignment across your aptitude telemetry, archetype inclinations, and labor market trajectory.`;

    return {
      whyRecommended,
      strengths: strengths.length > 0 ? strengths : [`Solid cognitive foundations for ${career.name}`],
      concerns: concerns.length > 0 ? concerns : ['Continuous upskilling in evolving industry toolchains is required.'],
      summary
    };
  }

  /**
   * Deterministic roadmap builder fallback
   */
  private static buildFallbackRoadmap(
    career: ICareer,
    skillGaps: ISingleSkillGap[]
  ): RoadmapGenerationResult {
    const priorityNames = skillGaps
      .filter((g) => g.gap > 0)
      .slice(0, 3)
      .map((g) => g.skillName);

    const primarySkill = priorityNames[0] || (career.requiredSkills?.[0]?.skillName ?? 'Core Fundamentals');
    const secondarySkill = priorityNames[1] || (career.requiredSkills?.[1]?.skillName ?? 'Advanced Tools');
    const tertiarySkill = priorityNames[2] || (career.requiredSkills?.[2]?.skillName ?? 'System Architecture');

    const milestones: IRoadmapMilestone[] = [
      {
        phase: 1,
        sequence: 1,
        title: `Phase 1: Foundations of ${career.name}`,
        description: `Master fundamental concepts, theoretical principles, and prerequisites in ${primarySkill}.`,
        category: 'course',
        skillsCovered: [primarySkill],
        recommendedResources: [
          { title: `${primarySkill} Masterclass & Documentation`, type: 'course', url: 'https://coursera.org' },
          { title: 'Foundational Textbooks & Reference Papers', type: 'book' }
        ],
        estimatedDuration: '4-6 weeks',
        status: 'pending'
      },
      {
        phase: 2,
        sequence: 2,
        title: `Phase 2: Applied Competency in ${secondarySkill}`,
        description: `Hands-on tooling, frameworks, and practical exercises bridging theoretical understanding with implementation.`,
        category: 'skill',
        skillsCovered: [secondarySkill],
        recommendedResources: [
          { title: `${secondarySkill} Hands-On Lab`, type: 'project', url: 'https://github.com' }
        ],
        estimatedDuration: '6-8 weeks',
        status: 'pending'
      },
      {
        phase: 3,
        sequence: 3,
        title: `Phase 3: Production-Grade Capstone Project`,
        description: `Design and deploy an end-to-end portfolio project demonstrating ${primarySkill} and ${tertiarySkill} in a real-world scenario.`,
        category: 'project',
        skillsCovered: [primarySkill, secondarySkill, tertiarySkill],
        recommendedResources: [
          { title: `${career.name} Industry Benchmark Capstone`, type: 'project' }
        ],
        estimatedDuration: '6 weeks',
        status: 'pending'
      },
      {
        phase: 4,
        sequence: 4,
        title: `Phase 4: Industry Readiness & Professional Placement`,
        description: `Technical interview preparation, domain networking, portfolio showcase, and internship application sprints.`,
        category: 'certification',
        skillsCovered: ['Technical Communication', 'Problem Solving', 'System Design'],
        recommendedResources: [
          { title: `${career.name} Technical Interview Prep & Mock Assessments`, type: 'documentation' }
        ],
        estimatedDuration: '4 weeks',
        status: 'pending'
      }
    ];

    return {
      roadmapTitle: `Personalized Strategic Roadmap: ${career.name}`,
      targetRole: career.name,
      description: `Structured milestone roadmap designed to close critical skill gaps and achieve industry readiness for ${career.name}.`,
      milestones
    };
  }
}
