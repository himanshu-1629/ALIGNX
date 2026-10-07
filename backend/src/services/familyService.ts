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
  const budgetLakhs = Math.max(1, Math.round(totalBudget / 100000));

  // 1. Dynamic Financial Friction Benchmark (evaluated against benchmark elite tech college tuition ~₹18-24L/yr)
  let financialFit = 70;
  let financialConflict = 0;

  if (budgetLakhs <= 6) {
    financialFit = 45;
    financialConflict = Math.round(45 + (6 - budgetLakhs) * 3);
    conflictReasons.push(`Annual budget ceiling of ₹${budgetLakhs}L/yr requires reliance on subsidized government seats or debt financing for Tier-1 private institutes`);
    compromiseSuggestions.push('Explore merit scholarships, state government fee waivers, and low-interest student loans');
  } else if (budgetLakhs <= 12) {
    financialFit = 68;
    financialConflict = Math.round(25 + (12 - budgetLakhs) * 2.5);
    conflictReasons.push(`Budget ceiling of ₹${budgetLakhs}L/yr limits non-subsidized elite tech universities without partial scholarship`);
    compromiseSuggestions.push('Balance Tier-1 private campus preferences with high-ROI public institutions');
  } else if (budgetLakhs <= 22) {
    financialFit = 88;
    financialConflict = Math.round(10 + (22 - budgetLakhs) * 1.2);
    conflictReasons.push(`Annual capacity of ₹${budgetLakhs}L/yr comfortably covers domestic tech programs with minor divergence on international degrees`);
    compromiseSuggestions.push('Prioritize accredited domestic tech hubs with strong campus placement records');
  } else if (budgetLakhs <= 35) {
    financialFit = 95;
    financialConflict = Math.max(5, Math.round(10 - (budgetLakhs - 22) * 0.35));
    conflictReasons.push(`Robust financial ceiling (₹${budgetLakhs}L/yr) provides strong backing across premier domestic and select global programs`);
    compromiseSuggestions.push('Evaluate highest ROI specializations without upfront financial friction');
  } else {
    financialFit = 98;
    financialConflict = 5;
    conflictReasons.push(`Comprehensive financial capacity (₹${budgetLakhs}L/yr) provides unrestricted access to elite global and domestic programs`);
    compromiseSuggestions.push('Optimize purely for student talent and long-term career upside');
  }

  conflictPoints += financialConflict;

  // 2. Risk Appetite Discrepancy
  const avgRisk = family.combinedFinancialContext?.averageRiskAppetite || 'medium';
  const studentWantsStartup = student.goals.some((g) =>
    /startup|entrepreneur|high growth|founder/i.test(g)
  );

  if (avgRisk === 'low' && studentWantsStartup) {
    conflictPoints += 20;
    conflictReasons.push('Student aspires toward high-risk startups while family prioritizes career stability');
    compromiseSuggestions.push(
      'Consider establishing solid industry experience at a reputable enterprise before transitioning into startups'
    );
  } else if (avgRisk === 'low') {
    conflictPoints += 8;
    conflictReasons.push('Family prioritizes low-risk accredited career paths with guaranteed placement certainty');
    compromiseSuggestions.push('Highlight corporate and established enterprise roles within modern technology sectors');
  } else if (avgRisk === 'medium') {
    conflictPoints += 3;
  }

  // 3. Parental Priority Factor Discrepancy
  const priorityFactors = completedParents.flatMap((p) => p.expectations?.priorityFactors || []);
  if (priorityFactors.includes('Stability') && budgetLakhs < 20) {
    conflictPoints += 5;
  } else if (priorityFactors.includes('Immediate ROI') && budgetLakhs < 15) {
    conflictPoints += 4;
  } else if (priorityFactors.includes('Work-Life Balance')) {
    conflictPoints += 2;
  }

  // 4. Domain Preference Alignment
  const allParentPreferredDomains = completedParents.flatMap(
    (p) => p.expectations?.preferredDomains || []
  );

  if (allParentPreferredDomains.length > 0 && student.interests.length > 0) {
    const studentInterestNames = student.interests.map((i) => i.name.toLowerCase());
    const hasOverlap = allParentPreferredDomains.some((d) =>
      studentInterestNames.some((si) => si.includes(d.toLowerCase()) || d.toLowerCase().includes(si))
    );

    if (!hasOverlap) {
      conflictPoints += 15;
      conflictReasons.push(
        `Family expects careers in [${allParentPreferredDomains.join(', ')}], which differs from student interests`
      );
      compromiseSuggestions.push(
        'Explore interdisciplinary pathways combining parental domain expectations with student passion'
      );
    }
  }

  // Clamp conflict index between 5 and 95
  const conflictIndex = Math.min(95, Math.max(5, Math.round(conflictPoints)));
  const familyAlignment = Math.max(5, 100 - conflictIndex);

  return {
    financialFit,
    conflictIndex,
    familyAlignment,
    conflictReasons,
    compromiseSuggestions
  };
};
