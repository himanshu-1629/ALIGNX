import { connectDB, disconnectDB } from '../src/config/db';
import { createApp } from '../src/app';
import { Student } from '../src/models/Student';
import { Family } from '../src/models/Family';
import { ParentInvitation } from '../src/models/ParentInvitation';
import http from 'http';

function httpRequest(
  port: number,
  path: string,
  method: string,
  body?: any,
  token?: string
): Promise<{ status: number; body: any }> {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : '';
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload).toString()
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(
      {
        hostname: 'localhost',
        port,
        path,
        method,
        headers
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve({ status: res.statusCode || 500, body: parsed });
          } catch {
            resolve({ status: res.statusCode || 500, body: data });
          }
        });
      }
    );

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runParentTests() {
  console.log('🧪 Starting Parent Invitation & Family Intelligence Integration Test...');
  await connectDB();

  const app = createApp();
  const PORT = 5057;
  const server = app.listen(PORT);

  const testEmail = `student.parents.${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  let jwtToken = '';
  let studentId = '';
  let fatherToken = '';
  let motherToken = '';

  try {
    // 1. Register student
    console.log('\n[1] Registering student with startup goal...');
    const regRes = await httpRequest(PORT, '/api/v1/auth/register', 'POST', {
      name: 'Rohan Gupta',
      email: testEmail,
      password: testPassword,
      educationLevel: 'B.Tech',
      location: 'Pune'
    });

    if (regRes.status !== 201) throw new Error('Student registration failed');
    jwtToken = regRes.body.data.accessToken;
    studentId = regRes.body.data.studentId;

    // Update student goal to test conflict index calculation
    await httpRequest(
      PORT,
      '/api/v1/students/profile',
      'PATCH',
      {
        goals: ['Build high growth AI startup', 'Become a tech founder']
      },
      jwtToken
    );

    // 2. Student invites Father
    console.log('\n[2] Inviting Father (POST /api/v1/parents/invite)...');
    const fatherInviteRes = await httpRequest(
      PORT,
      '/api/v1/parents/invite',
      'POST',
      {
        name: 'Suresh Gupta',
        relationship: 'Father',
        email: 'suresh@example.com'
      },
      jwtToken
    );
    console.log('Father Invite Status:', fatherInviteRes.status);
    console.log('Father Invitation Url:', fatherInviteRes.body.data.invitationUrl);
    if (fatherInviteRes.status !== 201 || !fatherInviteRes.body.data.invitationToken) {
      throw new Error('Father invitation failed');
    }
    fatherToken = fatherInviteRes.body.data.invitationToken;

    // 3. Student invites Mother
    console.log('\n[3] Inviting Mother (POST /api/v1/parents/invite)...');
    const motherInviteRes = await httpRequest(
      PORT,
      '/api/v1/parents/invite',
      'POST',
      {
        name: 'Meena Gupta',
        relationship: 'Mother',
        email: 'meena@example.com'
      },
      jwtToken
    );
    console.log('Mother Invite Status:', motherInviteRes.status);
    if (motherInviteRes.status !== 201) throw new Error('Mother invitation failed');
    motherToken = motherInviteRes.body.data.invitationToken;

    // 4. Verify initial pending statuses on student dashboard
    console.log('\n[4] Checking Student Dashboard Status (GET /api/v1/parents/status)...');
    const statusRes1 = await httpRequest(PORT, '/api/v1/parents/status', 'GET', undefined, jwtToken);
    console.log('Status Res 1:', JSON.stringify(statusRes1.body.data, null, 2));
    if (statusRes1.body.data.totalParents !== 2) throw new Error('Expected 2 parents');

    // 5. Father opens invitation link (Public)
    console.log(`\n[5] Father opens link (GET /api/v1/parents/invite/${fatherToken})...`);
    const openRes = await httpRequest(PORT, `/api/v1/parents/invite/${fatherToken}`, 'GET');
    console.log('Father Open Status:', openRes.status);
    console.log('Father Open Data:', JSON.stringify(openRes.body.data, null, 2));
    if (openRes.status !== 200 || openRes.body.data.status !== 'filling') {
      throw new Error('Father invitation verification failed or status did not transition to filling');
    }

    // 6. Father submits financial form (₹6,00,000, low risk)
    console.log('\n[6] Father submits form (POST /api/v1/parents/invite/:token/submit)...');
    const submitFatherRes = await httpRequest(
      PORT,
      `/api/v1/parents/invite/${fatherToken}/submit`,
      'POST',
      {
        incomeRange: '10-15L',
        educationBudget: 600000,
        riskAppetite: 'low',
        stabilityPreference: 'high',
        preferredDomains: ['Traditional Engineering', 'Public Sector'],
        priorityFactors: ['stability', 'employment_speed']
      }
    );
    console.log('Father Submit Status:', submitFatherRes.status);
    console.log('Father Submit Data:', JSON.stringify(submitFatherRes.body.data, null, 2));
    if (submitFatherRes.status !== 200 || submitFatherRes.body.data.status !== 'completed') {
      throw new Error('Father form submission failed');
    }

    // 7. Mother submits financial form (₹4,00,000, medium risk)
    console.log('\n[7] Mother submits form (POST /api/v1/parents/invite/:token/submit)...');
    const submitMotherRes = await httpRequest(
      PORT,
      `/api/v1/parents/invite/${motherToken}/submit`,
      'POST',
      {
        incomeRange: '5-10L',
        educationBudget: 400000,
        riskAppetite: 'medium',
        stabilityPreference: 'medium',
        preferredDomains: ['Technology'],
        priorityFactors: ['salary', 'growth']
      }
    );
    console.log('Mother Submit Status:', submitMotherRes.status);
    if (submitMotherRes.status !== 200) throw new Error('Mother form submission failed');

    // 8. Student checks live dashboard after both parents submit
    console.log('\n[8] Student checks updated family status & conflict analysis...');
    const statusRes2 = await httpRequest(PORT, '/api/v1/parents/status', 'GET', undefined, jwtToken);
    console.log('Final Family Status:', JSON.stringify(statusRes2.body.data, null, 2));

    const totalBudget = statusRes2.body.data.combinedFinancialContext.totalEducationBudget;
    const conflictIndex = statusRes2.body.data.alignmentAnalysis.conflictIndex;
    const familyAlignment = statusRes2.body.data.alignmentAnalysis.familyAlignment;

    console.log(`\n📊 Combined Family Budget: ₹${totalBudget.toLocaleString('en-IN')}`);
    console.log(`⚖️ Conflict Index: ${conflictIndex}/100`);
    console.log(`🤝 Family Alignment: ${familyAlignment}/100`);

    if (totalBudget !== 1000000) {
      throw new Error(`Expected total budget of 1000000, got ${totalBudget}`);
    }

    // 9. Father attempts to submit again (should be blocked)
    console.log('\n[9] Testing prevention of invitation re-use...');
    const reuseRes = await httpRequest(
      PORT,
      `/api/v1/parents/invite/${fatherToken}/submit`,
      'POST',
      { educationBudget: 100000 }
    );
    console.log('Reuse Status:', reuseRes.status);
    if (reuseRes.status !== 400) {
      throw new Error(`Expected 400 for already used invitation, got ${reuseRes.status}`);
    }

    console.log('\n🎉 ALL PARENT INVITATION & FAMILY INTELLIGENCE TESTS PASSED!');
  } finally {
    console.log('\n🧹 Cleaning up test student, family, and invitations from Atlas...');
    const student = await Student.findOne({ email: testEmail });
    if (student) {
      await ParentInvitation.deleteMany({ studentId: student._id });
      await Family.deleteMany({ studentId: student._id });
      await Student.deleteOne({ _id: student._id });
      console.log('Cleaned up test records.');
    }

    server.close();
    await disconnectDB();
  }
}

runParentTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
