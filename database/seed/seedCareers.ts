import fs from 'fs';
import path from 'path';
import { connectDB, disconnectDB } from '../../backend/src/config/db';
import { Career } from '../../backend/src/models/Career';

// Single Source of Truth: database/seeds/careers.json
const careersJsonPath = path.resolve(__dirname, '../seeds/careers.json');

export function loadAndTransformCareers() {
  if (!fs.existsSync(careersJsonPath)) {
    throw new Error(`Careers seed file not found at: ${careersJsonPath}`);
  }

  const rawData = JSON.parse(fs.readFileSync(careersJsonPath, 'utf-8'));

  return rawData.map((c: any) => {
    // Map skills
    const requiredSkills = (c.skills || []).map((s: any) => ({
      skillName: s.name || s.skillId,
      category: s.category || 'technical',
      importance: typeof s.importance === 'number' && s.importance <= 1.0 ? Math.round(s.importance * 100) : (s.importance || 80),
      requiredLevel: s.requiredLevel || 75
    }));

    // Map interest profile (from RIASEC map or array)
    const interestProfile = c.interestProfile && !Array.isArray(c.interestProfile)
      ? Object.entries(c.interestProfile).map(([interest, importance]) => ({
          interest: interest.charAt(0).toUpperCase() + interest.slice(1),
          importance: typeof importance === 'number' ? importance : 80
        }))
      : (c.interestProfile || []);

    // Map education pathway
    const educationPathway = {
      minimumDegree: c.educationPathway?.minDegree || c.educationPathway?.minimumDegree || 'B.Tech / B.E.',
      preferredDegrees: c.educationPathway?.degrees || c.educationPathway?.preferredDegrees || ['B.Tech / B.E.'],
      typicalDurationYears: c.educationPathway?.durationYears || c.educationPathway?.typicalDurationYears || 4,
      topColleges: c.educationPathway?.topColleges || ['Premier Tier-1 Indian Institutions']
    };

    // Map education cost
    const govtMin = c.educationCost?.govtTier?.minINR || c.educationCost?.minCost || 600000;
    const pvtMax = c.educationCost?.pvtTier1?.maxINR || c.educationCost?.maxCost || 2400000;
    const educationCost = {
      minCost: govtMin,
      maxCost: pvtMax,
      averageCost: Math.round((govtMin + pvtMax) / 2),
      currency: c.educationCost?.currency || 'INR'
    };

    // Map salary range
    const entryMin = c.salaryRange?.entryLPA?.min ? c.salaryRange.entryLPA.min * 100000 : (c.salaryRange?.entryLevel || 900000);
    const midMin = c.salaryRange?.midLPA?.min ? c.salaryRange.midLPA.min * 100000 : (c.salaryRange?.midLevel || 2200000);
    const seniorMin = c.salaryRange?.seniorLPA?.min ? c.salaryRange.seniorLPA.min * 100000 : (c.salaryRange?.seniorLevel || 4500000);
    const salaryRange = {
      entryLevel: entryMin,
      midLevel: midMin,
      seniorLevel: seniorMin,
      currency: 'INR'
    };

    // Map market data
    const hiringVel = c.marketData?.hiringVelocity ?? 85;
    const growth = c.marketData?.growthScore ?? 90;
    const disruption = c.marketData?.disruptionIndex ?? 80;
    const marketData = {
      demandScore: hiringVel,
      growthScore: growth,
      hiringVelocity: hiringVel,
      stabilityScore: disruption,
      futureOutlook: c.marketData?.futureOutlook || 'Robust compound industry growth with high hiring demand.'
    };

    // Map location demand
    const locationDemand = (c.locationDemand || []).map((loc: any) => ({
      location: loc.location || 'Metro Hub',
      demandScore: loc.demandScore || 80,
      opportunityScore: loc.opportunityScore || loc.demandScore || 80,
      costIndex: loc.costIndex || 70
    }));

    // Map exams & scholarships
    const exams = (c.entranceExams || c.exams || []).map((e: any) => ({
      name: e.name || e.examId || 'National Entrance Exam',
      type: e.type || 'National',
      difficulty: e.difficulty || 'High'
    }));

    const scholarships = (c.scholarships || []).map((s: any) => ({
      name: s.name || s.scholarshipId || 'Merit Scholarship',
      provider: s.provider || 'Govt / Institutional',
      maxAmount: s.maxAmount || s.maxINR || 200000,
      eligibility: s.eligibility || 'Merit and Income Eligible'
    }));

    return {
      slug: c.id || c.slug,
      name: c.name,
      category: c.domain || c.category || 'Technology',
      description: c.description,
      riskLevel: c.riskLevel || 'medium',
      requiredSkills,
      aptitudeProfile: c.aptitudeProfile || { logical: 75, numerical: 75, analytical: 75, spatial: 70, verbal: 70 },
      interestProfile,
      educationPathway,
      educationCost,
      salaryRange,
      marketData,
      locationDemand,
      exams,
      scholarships,
      alternativeCareers: c.alternativeCareers || [],
      interdisciplinaryTags: c.interdisciplinaryTags || []
    };
  });
}

export async function seedCareers() {
  console.log('[Seed] Connecting to MongoDB...');
  await connectDB();

  const careersToSeed = loadAndTransformCareers();
  console.log(`[Seed] Ingesting ${careersToSeed.length} authentic STEAM careers from database/seeds/careers.json...`);

  for (const careerData of careersToSeed) {
    await Career.findOneAndUpdate({ slug: careerData.slug }, careerData, {
      upsert: true,
      new: true
    });
    console.log(`  ✓ Seeded career: ${careerData.name} (${careerData.slug})`);
  }

  console.log(`[Seed] Successfully seeded all ${careersToSeed.length} careers into MongoDB!`);
  await disconnectDB();
}

if (require.main === module) {
  seedCareers().catch((err) => {
    console.error('[Seed] Error seeding careers:', err);
    process.exit(1);
  });
}
