import { connectDB, disconnectDB } from '../src/config/db';
import { createApp } from '../src/app';
import { Student } from '../src/models/Student';
import { Family } from '../src/models/Family';
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

async function runStudentTests() {
  console.log('🧪 Starting Student Profile & Onboarding Integration Test...');
  await connectDB();

  const app = createApp();
  const PORT = 5056;
  const server = app.listen(PORT);

  const testEmail = `student.profile.${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  let jwtToken = '';
  let studentId = '';

  try {
    // 1. Register student
    console.log('\n[1] Registering student...');
    const regRes = await httpRequest(PORT, '/api/v1/auth/register', 'POST', {
      name: 'Priya Sharma',
      email: testEmail,
      password: testPassword,
      educationLevel: 'B.Tech',
      location: 'Delhi'
    });

    if (regRes.status !== 201) throw new Error('Registration failed');
    jwtToken = regRes.body.data.accessToken;
    studentId = regRes.body.data.studentId;

    // 2. Fetch initial profile
    console.log('\n[2] Testing GET /api/v1/students/profile...');
    const profileRes = await httpRequest(PORT, '/api/v1/students/profile', 'GET', undefined, jwtToken);
    console.log('Profile Status:', profileRes.status);
    console.log('Profile Data:', JSON.stringify(profileRes.body.data, null, 2));

    if (profileRes.status !== 200 || !profileRes.body.data.family) {
      throw new Error('Failed to retrieve profile with linked family');
    }

    // 3. Update demographic profile
    console.log('\n[3] Testing PATCH /api/v1/students/profile...');
    const patchRes = await httpRequest(
      PORT,
      '/api/v1/students/profile',
      'PATCH',
      {
        age: 20,
        branch: 'Computer Science',
        location: 'Bangalore',
        goals: ['Lead an AI startup', 'Publish research in Machine Learning']
      },
      jwtToken
    );
    console.log('Patch Status:', patchRes.status);
    console.log('Patch Response:', JSON.stringify(patchRes.body.data, null, 2));
    if (patchRes.status !== 200 || patchRes.body.data.branch !== 'Computer Science') {
      throw new Error('Profile patch update failed');
    }

    // 4. Update student skills
    console.log('\n[4] Testing PUT /api/v1/students/skills...');
    const skillsRes = await httpRequest(
      PORT,
      '/api/v1/students/skills',
      'PUT',
      {
        skills: [
          { name: 'Python', proficiency: 90, category: 'technical' },
          { name: 'TensorFlow', proficiency: 75, category: 'technical' },
          { name: 'SQL', proficiency: 80, category: 'technical' },
          { name: 'Leadership', proficiency: 85, category: 'soft' }
        ]
      },
      jwtToken
    );
    console.log('Skills Status:', skillsRes.status);
    console.log('Skills Count:', skillsRes.body.data.skillsCount);
    if (skillsRes.status !== 200 || skillsRes.body.data.skillsCount !== 4) {
      throw new Error('Skills update failed');
    }

    // 5. Update student interests
    console.log('\n[5] Testing PUT /api/v1/students/interests...');
    const interestsRes = await httpRequest(
      PORT,
      '/api/v1/students/interests',
      'PUT',
      {
        interests: [
          { name: 'Artificial Intelligence', score: 95, category: 'tech' },
          { name: 'Autonomous Robotics', score: 85, category: 'engineering' },
          { name: 'Computational Biology', score: 70, category: 'interdisciplinary' }
        ]
      },
      jwtToken
    );
    console.log('Interests Status:', interestsRes.status);
    console.log('Interests Count:', interestsRes.body.data.interestsCount);
    if (interestsRes.status !== 200 || interestsRes.body.data.interestsCount !== 3) {
      throw new Error('Interests update failed');
    }

    // 6. Test GET /api/v1/students/:id
    console.log(`\n[6] Testing GET /api/v1/students/${studentId}...`);
    const idRes = await httpRequest(PORT, `/api/v1/students/${studentId}`, 'GET', undefined, jwtToken);
    console.log('GetById Status:', idRes.status);
    console.log('Skills retrieved:', idRes.body.data.skills.map((s: any) => s.name));
    if (idRes.status !== 200 || idRes.body.data.skills.length !== 4) {
      throw new Error('GetById failed to reflect updated skills');
    }

    console.log('\n🎉 ALL STUDENT PROFILE TESTS PASSED SUCCESSFULLY!');
  } finally {
    console.log('\n🧹 Cleaning up test student from Atlas...');
    const student = await Student.findOne({ email: testEmail });
    if (student) {
      await Family.deleteMany({ studentId: student._id });
      await Student.deleteOne({ _id: student._id });
      console.log('Cleaned up test record.');
    }

    server.close();
    await disconnectDB();
  }
}

runStudentTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
