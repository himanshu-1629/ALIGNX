import { IStudent } from '../models/Student';
import { IFamily } from '../models/Family';
import { ICareer } from '../models/Career';
import {
  IScoreComponents,
  IRankedCareerResult,
  AffordabilityCategory
} from '../models/Recommendation';

export interface ScoringWeights {
  studentFit: number;
  financialFit: number;
  familyAlignment: number;
  marketFit: number;
  locationFit: number;
}

export const DEFAULT_WEIGHTS: ScoringWeights = {
  studentFit: 0.35,
  financialFit: 0.2,
  familyAlignment: 0.15,
  marketFit: 0.2,
  locationFit: 0.1
};

/**
 * 1. Calculate Student Fit (0 - 100)
 */
export const calculateStudentFit = (student: IStudent, career: ICareer): number => {
  // A. Skill Match (40% weight)
  let skillMatch = 60; // Baseline
  if (career.requiredSkills && career.requiredSkills.length > 0) {
    let totalWeight = 0;
    let earnedWeight = 0;

    career.requiredSkills.forEach((req) => {
      const weight = req.importance || 70;
      totalWeight += weight;

      const matchedSkill = student.skills.find(
        (s) => s.name.toLowerCase() === req.skillName.toLowerCase()
      );

      if (matchedSkill) {
        const ratio = Math.min(1.2, matchedSkill.proficiency / (req.requiredLevel || 70));
        earnedWeight += Math.min(100, ratio * 100) * (weight / 100);
      } else {
        earnedWeight += 30 * (weight / 100); // Partial credit for transferable foundation
      }
    });

    if (totalWeight > 0) {
      skillMatch = Math.min(100, Math.round((earnedWeight / totalWeight) * 100));
    }
  }

  // B. Aptitude Match (30% weight)
  let aptitudeMatch = 75;
  if (student.aptitudeSnapshot && career.aptitudeProfile) {
    const snap = student.aptitudeSnapshot;
    const prof = career.aptitudeProfile;

    const diffs = [
      Math.abs(snap.logical - prof.logical),
      Math.abs(snap.numerical - prof.numerical),
      Math.abs(snap.analytical - prof.analytical),
      Math.abs(snap.spatial - prof.spatial),
      Math.abs(snap.verbal - prof.verbal)
    ];

    const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    aptitudeMatch = Math.min(100, Math.max(40, Math.round(100 - avgDiff * 0.75)));
  }

  // C. Interest Match (30% weight)
  let interestMatch = 65;
  if (student.interests && student.interests.length > 0 && career.interestProfile) {
    const studentInterestNames = student.interests.map((i) => i.name.toLowerCase());
    let matches = 0;

    career.interestProfile.forEach((cp) => {
      if (
        studentInterestNames.some(
          (si) => si.includes(cp.interest.toLowerCase()) || cp.interest.toLowerCase().includes(si)
        )
      ) {
        matches++;
      }
    });

    if (career.interestProfile.length > 0) {
      const ratio = matches / career.interestProfile.length;
      interestMatch = Math.min(100, Math.round(50 + ratio * 50));
    }
  }

  const studentFit = Math.round(skillMatch * 0.4 + aptitudeMatch * 0.3 + interestMatch * 0.3);
  return Math.min(100, Math.max(30, studentFit));
};

/**
 * 2. Calculate Financial Fit (0 - 100) and Categorize Affordability
 */
export const calculateFinancialFit = (
  family: IFamily | null,
  career: ICareer,
  customBudget?: number
): { financialFit: number; affordabilityStatus: AffordabilityCategory } => {
  const familyBudget =
    customBudget !== undefined
      ? customBudget
      : family?.combinedFinancialContext?.totalEducationBudget || 500000;

  const careerCost = career.educationCost?.averageCost || 600000;
  const ratio = familyBudget / careerCost;

  let financialFit: number;
  let affordabilityStatus: AffordabilityCategory;

  if (ratio >= 1.0) {
    financialFit = Math.min(100, Math.round(90 + Math.min(10, (ratio - 1) * 10)));
    affordabilityStatus = 'Financially Feasible';
  } else if (ratio >= 0.7) {
    financialFit = Math.round(75 + (ratio - 0.7) * 50);
    affordabilityStatus = 'Feasible With Scholarship';
  } else if (ratio >= 0.4) {
    financialFit = Math.round(50 + (ratio - 0.4) * 80);
    affordabilityStatus = 'Stretch Option';
  } else {
    financialFit = Math.max(20, Math.round(ratio * 100));
    affordabilityStatus = 'Currently Unsuitable';
  }

  return { financialFit, affordabilityStatus };
};

/**
 * 3. Calculate Family Alignment (0 - 100)
 */
export const calculateFamilyAlignment = (
  family: IFamily | null,
  career: ICareer
): number => {
  if (!family || !family.alignmentAnalysis) {
    return 75; // Default neutral baseline
  }

  let alignment = family.alignmentAnalysis.familyAlignment || 75;

  // Penalty if career risk is high and family risk appetite is low
  const familyRisk = family.combinedFinancialContext?.averageRiskAppetite || 'medium';
  if (familyRisk === 'low' && career.riskLevel === 'high') {
    alignment -= 20;
  } else if (familyRisk === 'high' && career.riskLevel === 'high') {
    alignment += 10;
  }

  return Math.min(100, Math.max(20, alignment));
};

/**
 * 4. Calculate Market Fit (0 - 100)
 */
export const calculateMarketFit = (career: ICareer): number => {
  if (!career.marketData) return 75;

  const { demandScore = 80, growthScore = 80, hiringVelocity = 75, stabilityScore = 80 } =
    career.marketData;

  const marketFit = Math.round(
    demandScore * 0.4 + growthScore * 0.3 + hiringVelocity * 0.2 + stabilityScore * 0.1
  );

  return Math.min(100, Math.max(30, marketFit));
};

/**
 * 5. Calculate Location Fit (0 - 100)
 */
export const calculateLocationFit = (
  location: string,
  career: ICareer
): number => {
  if (!career.locationDemand || career.locationDemand.length === 0) {
    return 75;
  }

  const normalizedLoc = (location || '').toLowerCase().trim();
  const matched = career.locationDemand.find(
    (ld) =>
      ld.location.toLowerCase().includes(normalizedLoc) ||
      normalizedLoc.includes(ld.location.toLowerCase())
  );

  if (matched) {
    return matched.opportunityScore || matched.demandScore || 85;
  }

  return 65; // Non-cluster baseline
};

/**
 * Execute Full Scoring and Ranking for Careers
 */
export const rankAllCareers = (
  student: IStudent,
  family: IFamily | null,
  careers: ICareer[],
  options: {
    weights?: ScoringWeights;
    customBudget?: number;
    customLocation?: string;
  } = {}
): IRankedCareerResult[] => {
  const weights = options.weights || DEFAULT_WEIGHTS;
  const targetLocation = options.customLocation || student.location;

  const results: IRankedCareerResult[] = careers.map((career) => {
    const studentFit = calculateStudentFit(student, career);
    const { financialFit, affordabilityStatus } = calculateFinancialFit(
      family,
      career,
      options.customBudget
    );
    const familyAlignment = calculateFamilyAlignment(family, career);
    const marketFit = calculateMarketFit(career);
    const locationFit = calculateLocationFit(targetLocation, career);

    const overallScore = Math.min(
      100,
      Math.max(
        0,
        Math.round(
          studentFit * weights.studentFit +
            financialFit * weights.financialFit +
            familyAlignment * weights.familyAlignment +
            marketFit * weights.marketFit +
            locationFit * weights.locationFit
        )
      )
    );

    const components: IScoreComponents = {
      studentFit,
      financialFit,
      familyAlignment,
      marketFit,
      locationFit
    };

    // Why it matches explanation builder
    const whyItMatches: string[] = [];
    if (studentFit >= 80) whyItMatches.push('High alignment with your skills and cognitive strengths');
    if (financialFit >= 80) whyItMatches.push('Education pathway is fully within your family budget');
    if (marketFit >= 85) whyItMatches.push('Strong national and global hiring velocity');
    if (locationFit >= 80) whyItMatches.push(`High density of relevant industry opportunities in ${targetLocation}`);

    const potentialChallenges: string[] = [];
    if (financialFit < 70) potentialChallenges.push('Degree investment may require scholarship or student financing');
    if (studentFit < 75) potentialChallenges.push('Some required technical competencies require upskilling');
    if (familyAlignment < 70) potentialChallenges.push('Family leans toward traditional or lower-risk sectors');

    return {
      careerId: career._id,
      careerSlug: career.slug,
      careerName: career.name,
      rank: 0, // Will be set after sort
      overallScore,
      components,
      affordabilityStatus,
      explanationData: {
        whyItMatches,
        potentialChallenges,
        suggestedAlternatives: career.alternativeCareers || [],
        summary: `Matches ${overallScore}% of your profile across student capabilities, family budget, and market opportunity.`
      }
    };
  });

  // Sort descending by overallScore
  results.sort((a, b) => b.overallScore - a.overallScore);

  // Assign ranks
  results.forEach((item, index) => {
    item.rank = index + 1;
  });

  return results;
};
