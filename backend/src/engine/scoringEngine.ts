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
  studentFit: 0.40,
  financialFit: 0.20,
  familyAlignment: 0.15,
  marketFit: 0.15,
  locationFit: 0.10
};

const DOMAIN_SYNONYMS: Record<string, string[]> = {
  'artificial intelligence': ['ai', 'machine learning', 'deep learning', 'neural', 'data science', 'llm', 'computer vision'],
  'ai': ['artificial intelligence', 'machine learning', 'deep learning', 'neural', 'data science'],
  'autonomous robotics': ['robotics', 'autonomous', 'drones', 'mechatronics', 'kinetics', 'control systems'],
  'robotics': ['autonomous', 'robotics', 'mechatronics', 'kinetics'],
  'hardware & silicon systems': ['vlsi', 'semiconductor', 'silicon', 'embedded', 'hardware', 'chip', 'microelectronic'],
  'semiconductors': ['vlsi', 'semiconductor', 'silicon', 'hardware', 'chip', 'electronic'],
  'quantitative algorithms': ['quantitative', 'fintech', 'algorithmic', 'computational', 'financial', 'quantum'],
  'cleantech & energy systems': ['cleantech', 'clean energy', 'renewable', 'smart grid', 'battery', 'climate', 'carbon', 'sustainable'],
  'clean energy': ['renewable', 'energy', 'smart grid', 'cleantech', 'solar', 'battery', 'hydrogen'],
  'battery chemistry': ['battery', 'energy storage', 'electric vehicle', 'materials', 'chemical', 'cleantech'],
  'renewable energy': ['renewable', 'energy', 'smart grid', 'cleantech', 'solar', 'wind', 'battery'],
  'cybersecurity & defense': ['cybersecurity', 'cryptographic', 'security', 'defense', 'network', 'zero-trust'],
  'biocomputing': ['bioinformatics', 'genomic', 'biotech', 'life sciences', 'molecular', 'computational biology'],
  'cloud distributed systems': ['cloud', 'devops', 'distributed', 'infrastructure', 'systems architect']
};

/**
 * 1. Calculate Student Fit (0 - 100)
 * Evaluates Skill Readiness (35%), Cognitive Aptitude Alignment (35%), and Interest/RIASEC Synergy (30%).
 */
export const calculateStudentFit = (student: IStudent, career: ICareer): number => {
  const careerText = `${career.name} ${career.category} ${career.description} ${(career.interdisciplinaryTags || []).join(' ')}`.toLowerCase();

  // A. Skill Match (35% weight)
  let skillMatch = 40; // Baseline
  if (career.requiredSkills && career.requiredSkills.length > 0) {
    let totalWeight = 0;
    let earnedWeight = 0;

    career.requiredSkills.forEach((req) => {
      const weight = req.importance || 70;
      totalWeight += weight;

      // Token-aware and substring matching
      const reqName = req.skillName.toLowerCase();
      const matchedSkill = (student.skills || []).find((s) => {
        const sName = s.name.toLowerCase();
        return sName === reqName || sName.includes(reqName) || reqName.includes(sName);
      });

      if (matchedSkill) {
        const benchmark = req.requiredLevel || 75;
        const ratio = Math.min(1.25, matchedSkill.proficiency / benchmark);
        earnedWeight += Math.min(100, ratio * 100) * (weight / 100);
      } else {
        // Transferable readiness check from domain interests
        const hasDomainOverlap = (student.interests || []).some((i) => {
          const iName = i.name.toLowerCase();
          const syns = DOMAIN_SYNONYMS[iName] || [iName];
          return i.category === 'domain' && syns.some((syn) => reqName.includes(syn) || syn.includes(reqName) || careerText.includes(syn));
        });

        if (hasDomainOverlap) {
          earnedWeight += 88 * (weight / 100); // High domain interest transfer
        } else if (student.aptitudeSnapshot && (student.aptitudeSnapshot.logical >= 85 || student.aptitudeSnapshot.analytical >= 85)) {
          earnedWeight += 45 * (weight / 100); // Moderate cognitive capability baseline
        } else {
          earnedWeight += 20 * (weight / 100); // Minimal baseline
        }
      }
    });

    if (totalWeight > 0) {
      skillMatch = Math.min(100, Math.round((earnedWeight / totalWeight) * 100));
    }
  }

  // B. Aptitude Match (35% weight)
  let aptitudeMatch = 70;
  if (student.aptitudeSnapshot && career.aptitudeProfile) {
    const snap = student.aptitudeSnapshot;
    const prof = career.aptitudeProfile;

    const dimensions: Array<keyof typeof prof> = ['logical', 'numerical', 'analytical', 'spatial', 'verbal'];
    let dimScoreSum = 0;
    let weightSum = 0;

    dimensions.forEach((dim) => {
      const studentVal = snap[dim] || 70;
      const reqVal = prof[dim] || 70;
      const dimWeight = reqVal >= 85 ? 1.5 : 1.0;
      weightSum += dimWeight;

      if (studentVal >= reqVal) {
        dimScoreSum += Math.min(100, 95 + (studentVal - reqVal) * 0.4) * dimWeight;
      } else {
        const deficit = reqVal - studentVal;
        dimScoreSum += Math.max(25, 95 - deficit * 2.2) * dimWeight;
      }
    });

    aptitudeMatch = Math.min(100, Math.max(25, Math.round(dimScoreSum / (weightSum || 1))));
  }

  // C. Interest & RIASEC Holland Profile Match (30% weight)
  let interestMatch = 50;
  let riasecMatch = 55;
  let domainMatch = 30;

  // C1. RIASEC Holland Correlation (55% of interest component)
  if (career.interestProfile && career.interestProfile.length > 0) {
    const riasecInterests = (student.interests || []).filter((i) => i.category === 'riasec');
    const traitScores = student.careerDna?.traitScores;

    let weightedDiffSum = 0;
    let totalWeight = 0;

    const sortedCareerTraits = [...career.interestProfile].sort((a, b) => (b.importance || 70) - (a.importance || 70));

    sortedCareerTraits.forEach((cp, idx) => {
      const dimName = cp.interest.toLowerCase();
      const targetImportance = cp.importance || 70;

      const traitWeight = idx === 0 ? 3.0 : idx === 1 ? 2.0 : 1.0;
      totalWeight += traitWeight;

      let studentScore: number | undefined;
      const directRiasec = riasecInterests.find((ri) => ri.name.toLowerCase() === dimName);
      if (directRiasec) {
        studentScore = directRiasec.score;
      } else if (traitScores) {
        if (dimName === 'investigative') studentScore = Math.max(traitScores.research, traitScores.analytical);
        else if (dimName === 'realistic') studentScore = traitScores.builder;
        else if (dimName === 'enterprising') studentScore = Math.max(traitScores.leadership, traitScores.risk);
        else if (dimName === 'conventional') studentScore = traitScores.analytical;
        else if (dimName === 'artistic') studentScore = traitScores.creative;
        else if (dimName === 'social') studentScore = traitScores.social;
      }

      const effectiveStudent = studentScore !== undefined ? studentScore : 60;
      const diff = Math.abs(effectiveStudent - targetImportance);
      weightedDiffSum += diff * traitWeight;
    });

    if (totalWeight > 0) {
      const avgWeightedDiff = weightedDiffSum / totalWeight;
      riasecMatch = Math.min(100, Math.max(20, Math.round(100 - avgWeightedDiff * 1.45)));
    }
  }

  // C2. Domain & Category Synergy (45% of interest component)
  const studentDomainInterests = (student.interests || [])
    .filter((i) => i.category !== 'riasec')
    .map((i) => i.name.toLowerCase());

  if (studentDomainInterests.length > 0) {
    let matchedDomains = 0;
    studentDomainInterests.forEach((interest) => {
      const syns = DOMAIN_SYNONYMS[interest] || [interest];
      if (syns.some((s) => careerText.includes(s))) {
        matchedDomains += 1.0;
      } else {
        const tokens = interest.split(/\s+/).filter((t) => t.length > 3);
        if (tokens.some((t) => careerText.includes(t))) {
          matchedDomains += 0.5;
        }
      }
    });

    if (matchedDomains >= 1.5) {
      domainMatch = 98;
    } else if (matchedDomains >= 1) {
      domainMatch = 92;
    } else if (matchedDomains > 0) {
      domainMatch = 75;
    } else {
      domainMatch = 25; // Distinct penalty when student's stated passions have zero overlap
    }
  } else {
    domainMatch = 65; // Baseline when student entered no explicit domain interests
  }

  interestMatch = Math.round(riasecMatch * 0.55 + domainMatch * 0.45);

  const studentFit = Math.round(skillMatch * 0.35 + aptitudeMatch * 0.35 + interestMatch * 0.30);
  return Math.min(100, Math.max(20, studentFit));
};

/**
 * 2. Calculate Financial Fit (0 - 100) and Categorize Affordability
 * Compares authentic Student or Family budget with degree investment tiers.
 */
export const calculateFinancialFit = (
  studentOrFamily: IStudent | IFamily | null,
  familyOrCareer: IFamily | ICareer | null,
  careerOrCustomBudget?: ICareer | number,
  maybeBudget?: number
): { financialFit: number; affordabilityStatus: AffordabilityCategory } => {
  let student: IStudent | null = null;
  let family: IFamily | null = null;
  let career: ICareer;
  let customBudget: number | undefined;

  // Disambiguate polymorphic arguments
  if (studentOrFamily && 'skills' in studentOrFamily) {
    student = studentOrFamily as IStudent;
    family = (familyOrCareer && 'parents' in familyOrCareer) ? (familyOrCareer as IFamily) : null;
    career = careerOrCustomBudget as ICareer;
    customBudget = maybeBudget;
  } else {
    family = studentOrFamily as IFamily | null;
    career = familyOrCareer as ICareer;
    customBudget = typeof careerOrCustomBudget === 'number' ? careerOrCustomBudget : undefined;
  }

  let resolvedBudget: number;
  if (customBudget !== undefined && !isNaN(customBudget)) {
    resolvedBudget = customBudget;
  } else if (family?.combinedFinancialContext?.totalEducationBudget && family.combinedFinancialContext.totalEducationBudget > 0) {
    resolvedBudget = family.combinedFinancialContext.totalEducationBudget;
  } else if (student?.budgetAnnualLakhs && student.budgetAnnualLakhs > 0) {
    resolvedBudget = student.budgetAnnualLakhs * 100000;
  } else {
    resolvedBudget = 1000000; // Sensible 10 Lakh INR default
  }

  const avgCost = career?.educationCost?.averageCost || 800000;
  const minCost = career?.educationCost?.minCost || Math.round(avgCost * 0.55);
  const maxCost = career?.educationCost?.maxCost || Math.round(avgCost * 1.55);

  let financialFit: number;
  let affordabilityStatus: AffordabilityCategory;

  if (resolvedBudget >= maxCost) {
    financialFit = Math.min(100, Math.round(93 + Math.min(7, ((resolvedBudget - maxCost) / maxCost) * 10)));
    affordabilityStatus = 'Financially Feasible';
  } else if (resolvedBudget >= avgCost) {
    const range = maxCost - avgCost || 1;
    const progress = (resolvedBudget - avgCost) / range;
    financialFit = Math.round(85 + progress * 8);
    affordabilityStatus = 'Financially Feasible';
  } else if (resolvedBudget >= minCost) {
    const range = avgCost - minCost || 1;
    const progress = (resolvedBudget - minCost) / range;
    financialFit = Math.round(70 + progress * 14);
    affordabilityStatus = 'Feasible With Scholarship';
  } else if (resolvedBudget >= minCost * 0.45) {
    const range = minCost - minCost * 0.45 || 1;
    const progress = (resolvedBudget - minCost * 0.45) / range;
    financialFit = Math.round(48 + progress * 21);
    affordabilityStatus = 'Stretch Option';
  } else {
    const progress = Math.max(0, resolvedBudget / (minCost * 0.45 || 1));
    financialFit = Math.max(20, Math.round(progress * 47));
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
  let alignment = 75; // Default neutral baseline

  if (family?.alignmentAnalysis?.familyAlignment) {
    alignment = family.alignmentAnalysis.familyAlignment;
  }

  const familyRisk = family?.combinedFinancialContext?.averageRiskAppetite || 'medium';
  if (familyRisk === 'low' && career.riskLevel === 'high') {
    alignment -= 22;
  } else if (familyRisk === 'low' && career.riskLevel === 'medium') {
    alignment -= 8;
  } else if (familyRisk === 'high' && career.riskLevel === 'high') {
    alignment += 12;
  } else if (familyRisk === 'high' && career.riskLevel === 'low') {
    alignment -= 5;
  }

  // Cross-reference parent preferred domains
  if (family?.parents && family.parents.length > 0) {
    const parentDomains = family.parents.flatMap((p) => p.expectations?.preferredDomains || []);
    if (parentDomains.length > 0) {
      const careerCat = (career.category || '').toLowerCase();
      const careerName = (career.name || '').toLowerCase();
      const matches = parentDomains.some(
        (d) => careerCat.includes(d.toLowerCase()) || careerName.includes(d.toLowerCase())
      );
      if (matches) alignment += 10;
      else alignment -= 6;
    }
  }

  return Math.min(100, Math.max(20, alignment));
};

/**
 * 4. Calculate Market Fit (0 - 100)
 */
export const calculateMarketFit = (career: ICareer): number => {
  if (!career.marketData) return 75;

  const {
    demandScore = 80,
    growthScore = 80,
    hiringVelocity = 75,
    stabilityScore = 80
  } = career.marketData;

  const marketFit = Math.round(
    demandScore * 0.35 +
    growthScore * 0.35 +
    hiringVelocity * 0.20 +
    stabilityScore * 0.10
  );

  return Math.min(100, Math.max(30, marketFit));
};

/**
 * 5. Calculate Location Fit (0 - 100)
 */
export const calculateLocationFit = (
  targetLocation: string,
  career: ICareer,
  preferredLocations?: string[]
): number => {
  if (!career.locationDemand || career.locationDemand.length === 0) {
    return 75;
  }

  const locationsToCheck = [
    targetLocation,
    ...(preferredLocations || [])
  ]
    .filter(Boolean)
    .map((l) => l.toLowerCase().trim());

  let bestScore = 60; // Non-cluster baseline

  for (const loc of locationsToCheck) {
    const matched = career.locationDemand.find(
      (ld) =>
        ld.location.toLowerCase().includes(loc) ||
        loc.includes(ld.location.toLowerCase())
    );
    if (matched) {
      const score = matched.opportunityScore || matched.demandScore || 85;
      if (score > bestScore) {
        bestScore = score;
      }
    }
  }

  return Math.min(100, bestScore);
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
      student,
      family,
      career,
      options.customBudget
    );
    const familyAlignment = calculateFamilyAlignment(family, career);
    const marketFit = calculateMarketFit(career);
    const locationFit = calculateLocationFit(
      targetLocation,
      career,
      student.preferredLocations
    );

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
    if (studentFit >= 82) whyItMatches.push('Exceptional alignment with your cognitive aptitude and interest profile');
    else if (studentFit >= 72) whyItMatches.push('Solid alignment with your capabilities and academic interests');

    if (financialFit >= 85) whyItMatches.push('Fully feasible within your family education budget');
    else if (financialFit >= 70) whyItMatches.push('Achievable through subsidized government seats or merit scholarships');

    if (marketFit >= 85) whyItMatches.push('High industry hiring velocity and resilient long-term compensation');
    if (locationFit >= 80) whyItMatches.push(`Strategic density of top employers in your target hubs (${targetLocation})`);

    const potentialChallenges: string[] = [];
    if (financialFit < 68) potentialChallenges.push('Degree investment may require education loans or targeted financial aid');
    if (studentFit < 70) potentialChallenges.push('Key technical skill benchmarks require deliberate preparatory upskilling');
    if (familyAlignment < 70) potentialChallenges.push('Sector risk profile diverges from family risk preferences');

    return {
      careerId: career._id,
      careerSlug: career.slug,
      careerName: career.name,
      rank: 0, // Assigned after sort
      overallScore,
      components,
      affordabilityStatus,
      explanationData: {
        whyItMatches,
        potentialChallenges,
        suggestedAlternatives: career.alternativeCareers || [],
        summary: `Matches ${overallScore}% of your profile across student capabilities, financial feasibility, and market opportunity.`
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
