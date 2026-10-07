import { IFamily, IParent } from '../models/Family';
import { IStudent } from '../models/Student';

export interface CalculatedFamilyAlignment {
  financialFit: number;
  conflictIndex: number;
  familyAlignment: number;
  conflictReasons: string[];
  compromiseSuggestions: string[];
}

/**
 * Calculates aggregate family education budget and risk appetite
 */
export const calculateAggregateFinancials = (family: IFamily) => {
  const completedParents = family.parents.filter((p) => p.status === 'completed');

  if (completedParents.length === 0) {
    return {
      totalEducationBudget: 0,
      averageRiskAppetite: 'medium' as const
    };
  }

  const totalEducationBudget = completedParents.reduce((sum, p) => {
    return sum + (p.financialProfile?.educationBudget || 0);
  }, 0);

  // Determine dominant risk appetite
  const riskCounts = { low: 0, medium: 0, high: 0 };
  completedParents.forEach((p) => {
    const risk = p.financialProfile?.riskAppetite || 'medium';
    riskCounts[risk]++;
  });

  let averageRiskAppetite: 'low' | 'medium' | 'high' = 'medium';
  if (riskCounts.high > riskCounts.low && riskCounts.high > riskCounts.medium) {
    averageRiskAppetite = 'high';
  } else if (riskCounts.low > riskCounts.medium && riskCounts.low > riskCounts.high) {
    averageRiskAppetite = 'low';
  }

  return {
    totalEducationBudget,
    averageRiskAppetite
  };
};

/**
 * Calculates the Parent-Student Conflict Index (0 - 100)
 * Evaluates discrepancies between student aspirations and parental risk/stability preferences.
 */
export const calculateConflictIndexAndAlignment = (
  student: IStudent,
  family: IFamily
): CalculatedFamilyAlignment => {
  const completedParents = family.parents.filter((p) => p.status === 'completed');

  if (completedParents.length === 0) {
    return {
      financialFit: 50,
      conflictIndex: 0,
      familyAlignment: 75,
      conflictReasons: ['Parent preferences not yet submitted'],
      compromiseSuggestions: ['Invite parents to complete the financial and preference overview']
    };
  }

  const conflictReasons: string[] = [];
  const compromiseSuggestions: string[] = [];
  let conflictPoints = 0;

  const totalBudget = family.combinedFinancialContext?.totalEducationBudget || 0;

  // 1. Financial Baseline Check
  let financialFit = 70;
  if (totalBudget >= 1000000) {
    financialFit = 95;
  } else if (totalBudget >= 500000) {
    financialFit = 85;
  } else if (totalBudget >= 200000) {
    financialFit = 70;
  } else {
    financialFit = 50;
    conflictPoints += 15;
    conflictReasons.push('Education budget may constrain premium or private university options');
    compromiseSuggestions.push('Explore merit scholarships, government-subsidized programs, or financial aid');
  }

  // 2. Risk Appetite Discrepancy
  const avgRisk = family.combinedFinancialContext?.averageRiskAppetite || 'medium';
  const studentWantsStartup = student.goals.some((g) =>
    /startup|entrepreneur|high growth|founder/i.test(g)
  );

  if (avgRisk === 'low' && studentWantsStartup) {
    conflictPoints += 30;
    conflictReasons.push('Student aspires toward high-risk startups while family prioritizes career stability');
    compromiseSuggestions.push(
      'Consider establishing solid industry experience at a reputable tech company before transitioning into startups'
    );
  } else if (avgRisk === 'low') {
    const parentPrefersStability = completedParents.some(
      (p) => p.financialProfile?.stabilityPreference === 'high'
    );
    if (parentPrefersStability) {
      conflictPoints += 15;
      conflictReasons.push('Family leans toward traditional high-stability fields');
      compromiseSuggestions.push(
        'Highlight corporate and established enterprise roles within modern technology sectors'
      );
    }
  }

  // 3. Domain Preference Alignment
  const allParentPreferredDomains = completedParents.flatMap(
    (p) => p.expectations?.preferredDomains || []
  );

  if (allParentPreferredDomains.length > 0 && student.interests.length > 0) {
    const studentInterestNames = student.interests.map((i) => i.name.toLowerCase());
    const hasOverlap = allParentPreferredDomains.some((d) =>
      studentInterestNames.some((si) => si.includes(d.toLowerCase()) || d.toLowerCase().includes(si))
    );

    if (!hasOverlap) {
      conflictPoints += 25;
      conflictReasons.push(
        `Family expects careers in [${allParentPreferredDomains.join(', ')}], which differs from student interests`
      );
      compromiseSuggestions.push(
        'Explore interdisciplinary pathways combining parental domain expectations with student passion'
      );
    }
  }

  // Clamp conflict index between 5 and 95
  const conflictIndex = Math.min(95, Math.max(5, conflictPoints));
  const familyAlignment = Math.max(10, 100 - conflictIndex);

  return {
    financialFit,
    conflictIndex,
    familyAlignment,
    conflictReasons,
    compromiseSuggestions
  };
};
