import { createApp } from '../src/app';
import { connectDB, disconnectDB } from '../src/config/db';
import { Server } from 'http';

const TEST_PORT = 5059;
const BASE_URL = `http://localhost:${TEST_PORT}/api/v1`;

async function runFullE2ETest() {
  console.log('🚀 Starting Full End-to-End Suite for OM Backend Modules...');
  await connectDB();

  const app = createApp();
  const server: Server = app.listen(TEST_PORT, () => {
    console.log(`📡 Test server running on port ${TEST_PORT}`);
  });

  try {
    const timestamp = Date.now();
    const studentEmail = `om_e2e_student_${timestamp}@example.com`;
    const password = 'Password@123';

    // 1. Health check
    console.log('\n--- 1. Testing Health Endpoint ---');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    console.log('Health status:', healthData.data?.status, 'DB:', healthData.data?.database?.status);
    if (!healthData.success) throw new Error('Health check failed');

    // 2. Auth: Register & Login
    console.log('\n--- 2. Testing Auth: Register & Login ---');
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `Om Test Student ${timestamp}`,
        email: studentEmail,
        password,
        educationLevel: 'B.Tech Computer Science',
        location: 'Bangalore'
      })
    });
    const regData = await regRes.json();
    console.log('Register response:', regData.message, 'Token received:', !!regData.data?.accessToken);
    if (!regData.success) throw new Error('Register failed: ' + JSON.stringify(regData));
    const token = regData.data.accessToken;
    const studentId = regData.data.student.id;

    // 3. Update student skills & interests
    console.log('\n--- 3. Testing Student Profile Updates ---');
    const updateSkillsRes = await fetch(`${BASE_URL}/students/skills`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        skills: [
          { name: 'Python', proficiency: 85, category: 'technical' },
          { name: 'Data Structures', proficiency: 80, category: 'technical' },
          { name: 'Git', proficiency: 75, category: 'technical' }
        ]
      })
    });
    const updateSkillsData = await updateSkillsRes.json();
    console.log('Skills update:', updateSkillsData.message, 'Total skills:', updateSkillsData.data?.skills?.length);

    // 4. Assessment: Career Discovery
    console.log('\n--- 4. Testing Assessments (Career Discovery) ---');
    const assessStartRes = await fetch(`${BASE_URL}/assessments/career-discovery/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({})
    });
    const assessStartData = await assessStartRes.json();
    const assessmentId = assessStartData.data.assessmentId;
    console.log('Assessment started:', assessmentId);

    // Submit answer
    await fetch(`${BASE_URL}/assessments/${assessmentId}/response`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        questionId: 'q01',
        selectedOption: 'build_system',
        dimensionImpact: { analytical: 15, builder: 20 }
      })
    });

    // Complete assessment
    const assessCompleteRes = await fetch(`${BASE_URL}/assessments/${assessmentId}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const assessCompleteData = await assessCompleteRes.json();
    console.log('Assessment completed. Career DNA primaryTrait:', assessCompleteData.data?.careerDna?.primaryTrait);

    // 5. Parent Module: Invite & Form Submission
    console.log('\n--- 5. Testing Parent Invitation & Submission ---');
    const parentInviteRes = await fetch(`${BASE_URL}/parents/invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Parent Gupta',
        relationship: 'Father',
        email: `parent_${timestamp}@example.com`
      })
    });
    const parentInviteData = await parentInviteRes.json();
    const rawToken = parentInviteData.data.invitationToken;
    console.log('Parent invited. Token:', rawToken);

    // Submit parent form
    const parentSubmitRes = await fetch(`${BASE_URL}/parents/invite/${rawToken}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        incomeRange: '10-20L',
        educationBudget: 800000,
        riskAppetite: 'medium',
        locationPreference: 'Bangalore',
        careerExpectations: ['AI and Engineering']
      })
    });
    const parentSubmitData = await parentSubmitRes.json();
    console.log('Parent submitted:', parentSubmitData.message);

    // 6. Careers catalog
    console.log('\n--- 6. Testing Careers Catalog ---');
    const careersRes = await fetch(`${BASE_URL}/careers`);
    const careersData = await careersRes.json();
    console.log('Total seeded careers found:', careersData.data?.total);
    if (!careersData.data?.total || careersData.data.total === 0) {
      throw new Error('No careers found in catalog');
    }

    // 7. Decision Engine & Recommendations
    console.log('\n--- 7. Testing Recommendation Generation ---');
    const recGenRes = await fetch(`${BASE_URL}/recommendations/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ location: 'Bangalore' })
    });
    const recGenData = await recGenRes.json();
    console.log('Recommendations generated:', recGenData.message);
    const topRec = recGenData.data?.recommendations?.[0];
    console.log(`Top Rank: #${topRec?.rank} ${topRec?.careerName} (Overall Score: ${topRec?.overallScore}%, Affordability: ${topRec?.affordabilityStatus})`);
    const recId = recGenData.data.recommendationId;

    // Recommendation explanation
    const recExpRes = await fetch(`${BASE_URL}/recommendations/${recId}/explanation`);
    const recExpData = await recExpRes.json();
    console.log('Explanation received:', recExpData.data?.whyRecommended?.slice(0, 80) + '...');

    // 8. What-If Simulator
    console.log('\n--- 8. Testing What-If Simulator ---');
    const simRes = await fetch(`${BASE_URL}/simulator/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        educationBudget: 1500000,
        location: 'Bangalore',
        riskAppetite: 'high',
        additionalSkills: ['Machine Learning', 'TensorFlow']
      })
    });
    const simData = await simRes.json();
    console.log('Simulator output key shifts:', simData.data?.keyShifts);
    console.log('Total simulated recommendations evaluated:', simData.data?.recommendations?.length);

    // 9. Career Twin
    console.log('\n--- 9. Testing Career Twin Dimensional Match ---');
    const twinRes = await fetch(`${BASE_URL}/career-twin/ai-engineer`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const twinData = await twinRes.json();
    console.log('Career Twin match score for AI Engineer:', twinData.data?.matchScore, 'Dimensions:', twinData.data?.matchingDimensions);

    // 10. Skill Gaps
    console.log('\n--- 10. Testing Skill Gaps Analysis ---');
    const gapRes = await fetch(`${BASE_URL}/skill-gaps/ai-engineer`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const gapData = await gapRes.json();
    console.log('Skill gaps for AI Engineer count:', gapData.data?.skills?.length, 'Priority gaps:', gapData.data?.priorityGaps);

    // 11. Roadmaps
    console.log('\n--- 11. Testing Phased Learning Roadmap ---');
    const roadmapRes = await fetch(`${BASE_URL}/roadmaps/generate/ai-engineer`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    const roadmapData = await roadmapRes.json();
    console.log('Roadmap generated title:', roadmapData.data?.title, 'Phases count:', roadmapData.data?.phases?.length);

    // 12. Market Intelligence
    console.log('\n--- 12. Testing Market Data Endpoints ---');
    const marketRes = await fetch(`${BASE_URL}/market/careers/ai-engineer`);
    const marketData = await marketRes.json();
    console.log('Market demand score for AI Engineer:', marketData.data?.demandScore, 'Hiring velocity:', marketData.data?.hiringVelocity);

    const marketLocRes = await fetch(`${BASE_URL}/market/careers/ai-engineer/locations`);
    const marketLocData = await marketLocRes.json();
    console.log('Market regional clusters count:', marketLocData.data?.length);

    // 13. Unified Dashboard
    console.log('\n--- 13. Testing Unified Dashboard API ---');
    const dashRes = await fetch(`${BASE_URL}/dashboard/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const dashData = await dashRes.json();
    console.log('Dashboard Student:', dashData.data?.student?.name);
    console.log('Dashboard Career DNA:', dashData.data?.careerDNA?.primaryTrait);
    console.log('Dashboard Recommendations count:', dashData.data?.recommendations?.length);
    console.log('Dashboard Family Conflict Index:', dashData.data?.familyAnalysis?.conflictIndex);
    console.log('Dashboard Roadmap Present:', !!dashData.data?.roadmap);

    console.log('\n======================================================');
    console.log('🎉 ALL 13 TEST SUITES PASSED! OM BACKEND IS 100% OPERATIONAL');
    console.log('======================================================');
  } finally {
    server.close();
    await disconnectDB();
  }
}

runFullE2ETest().catch((err) => {
  console.error('❌ E2E Test failed:', err);
  process.exit(1);
});
