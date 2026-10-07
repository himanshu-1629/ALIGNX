import { GoogleGenAI } from '@google/genai';
import { IStudent } from '../models/Student';
import { ICareer } from '../models/Career';
import { IScoreComponents } from '../models/Recommendation';
import { ISingleSkillGap } from '../models/SkillGap';
import { IRoadmapMilestone } from '../models/Roadmap';

// Initialize Gemini Client if API key is provided
let genAIClient: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;
const defaultModelName = process.env.GEMINI_MODEL_NAME || 'gemini-3.5-flash-lite';

if (apiKey && apiKey.trim() !== '') {
  try {
    genAIClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('[LLMService] Failed to initialize GoogleGenAI client:', err);
  }
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
  /**
   * Generate narrative explanation for career recommendation
   */
  public static async generateExplanation(
    student: IStudent,
    career: ICareer,
    scores: IScoreComponents,
    overallScore: number
  ): Promise<RecommendationExplanationResult> {
    // Fallback template
    const fallback = this.buildFallbackExplanation(student, career, scores, overallScore);

    if (!genAIClient) {
      return fallback;
    }

    try {
      const prompt = `
You are the AI Career Intelligence Advisor for ALIGNX.
Analyze this student's match for the role "${career.name}".

Student Profile:
- Education: ${student.educationLevel || 'Undergraduate'}
- Current Skills: ${student.skills.map((s) => `${s.name} (${s.proficiency}%)`).join(', ') || 'General fundamentals'}
- Interests: ${student.interests.map((i) => i.name).join(', ') || 'Technology and problem solving'}
- Primary Career DNA: ${student.careerDna?.primaryTrait || 'Analytical Builder'}

Career Requirements:
- Career: ${career.name} (${career.category})
- Required Skills: ${career.requiredSkills?.map((s) => s.skillName).join(', ')}
- Risk Level: ${career.riskLevel}

Match Scores (out of 100):
- Overall Match: ${overallScore}%
- Student Fit (Skills/Aptitude): ${scores.studentFit}%
- Financial Feasibility: ${scores.financialFit}%
- Family Alignment: ${scores.familyAlignment}%
- Market Demand: ${scores.marketFit}%
- Location Cluster Fit: ${scores.locationFit}%

Respond strictly in valid JSON format with this exact structure:
{
  "whyRecommended": "2-3 sentences explaining why this career aligns with the student's unique strengths and market opportunity.",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "concerns": ["Area to be cautious about or prepare for"],
  "summary": "1 sentence executive summary."
}
Only output raw JSON without markdown code fences.
`;

      const response = await genAIClient.models.generateContent({
        model: defaultModelName,
        contents: prompt
      });

      const text = response.text?.trim() || '';
      const cleanJson = text.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
      const parsed = JSON.parse(cleanJson);

      return {
        whyRecommended: parsed.whyRecommended || fallback.whyRecommended,
        strengths: Array.isArray(parsed.strengths) && parsed.strengths.length > 0 ? parsed.strengths : fallback.strengths,
        concerns: Array.isArray(parsed.concerns) && parsed.concerns.length > 0 ? parsed.concerns : fallback.concerns,
        summary: parsed.summary || fallback.summary
      };
    } catch (error) {
      console.warn('[LLMService] Gemini explanation generation failed, using rule-based fallback:', (error as Error).message);
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

    if (!genAIClient) {
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

      const response = await genAIClient.models.generateContent({
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

    if (scores.studentFit >= 80) {
      strengths.push(`Strong alignment with your core technical competencies and cognitive aptitude (${scores.studentFit}%).`);
    } else {
      strengths.push(`Good foundational aptitude providing high transferability to ${career.name}.`);
    }

    if (scores.marketFit >= 85) {
      strengths.push(`Robust nationwide industry demand with high hiring velocity and strong compensation growth (${scores.marketFit}%).`);
    }

    if (scores.financialFit >= 80) {
      strengths.push(`Degree and education pathway is fully aligned with your family financial planning (${scores.financialFit}%).`);
    } else if (scores.financialFit < 65) {
      concerns.push(`Estimated educational investment may benefit from merit scholarships or early financing support.`);
    }

    if (scores.locationFit >= 80) {
      strengths.push(`High concentration of employment hubs in ${student.location || 'prime tech clusters'}.`);
    } else {
      concerns.push(`May require relocation or remote work to access premier career clusters.`);
    }

    if (scores.familyAlignment < 70) {
      concerns.push(`Family risk preferences lean towards higher immediate stability; joint alignment review recommended.`);
    }

    const whyRecommended = `Your profile demonstrates a ${overallScore}% fit for ${career.name}. ` +
      `Your cognitive strengths in ${student.careerDna?.primaryTrait || 'Analytical problem solving'} ` +
      `position you to thrive in this high-demand field.`;

    const summary = `${career.name} offers top-tier synergy between your talent, family budget parameters, and market demand.`;

    return {
      whyRecommended,
      strengths,
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
