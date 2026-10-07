import { connectDB, disconnectDB } from '../src/config/db';
import { createApp } from '../src/app';
import { Student } from '../src/models/Student';
import { Family } from '../src/models/Family';
import http from 'http';

// Helper to make local HTTP requests
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

async function runAuthTests() {
  console.log('🧪 Starting Auth Controller & Routes Integration Test...');
  await connectDB();

  const app = createApp();
  const PORT = 5055;
  const server = app.listen(PORT);

  const testEmail = `test.student.${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  let jwtToken = '';

  try {
    // 1. Test Registration
    console.log('\n[1] Testing Student Registration (POST /api/v1/auth/register)...');
    const regRes = await httpRequest(PORT, '/api/v1/auth/register', 'POST', {
      name: 'Test Student',
      email: testEmail,
      password: testPassword,
      educationLevel: 'B.Tech',
      location: 'Bangalore'
    });

    console.log('Register Status:', regRes.status);
    console.log('Register Response:', JSON.stringify(regRes.body, null, 2));

    if (regRes.status !== 201 || !regRes.body.success || !regRes.body.data.accessToken) {
      throw new Error('Registration test failed');
    }
    jwtToken = regRes.body.data.accessToken;

    // 2. Test Duplicate Registration Prevention
    console.log('\n[2] Testing Duplicate Registration Prevention...');
    const dupRes = await httpRequest(PORT, '/api/v1/auth/register', 'POST', {
      name: 'Duplicate Student',
      email: testEmail,
      password: testPassword
    });
    console.log('Duplicate Status:', dupRes.status);
    if (dupRes.status !== 409) {
      throw new Error(`Expected 409 for duplicate registration, got ${dupRes.status}`);
    }

    // 3. Test Login
    console.log('\n[3] Testing Student Login (POST /api/v1/auth/login)...');
    const loginRes = await httpRequest(PORT, '/api/v1/auth/login', 'POST', {
      email: testEmail,
      password: testPassword
    });
    console.log('Login Status:', loginRes.status);
    console.log('Login Response:', JSON.stringify(loginRes.body, null, 2));
    if (loginRes.status !== 200 || !loginRes.body.data.accessToken) {
      throw new Error('Login test failed');
    }

    // 4. Test Invalid Password
    console.log('\n[4] Testing Login with Invalid Password...');
    const invalidLogin = await httpRequest(PORT, '/api/v1/auth/login', 'POST', {
      email: testEmail,
      password: 'WrongPassword'
    });
    console.log('Invalid Login Status:', invalidLogin.status);
    if (invalidLogin.status !== 401) {
      throw new Error(`Expected 401 for wrong password, got ${invalidLogin.status}`);
    }

    // 5. Test Get Current Student Profile (GET /api/v1/auth/me)
    console.log('\n[5] Testing Authenticated Profile Retrieval (GET /api/v1/auth/me)...');
    const meRes = await httpRequest(PORT, '/api/v1/auth/me', 'GET', undefined, jwtToken);
    console.log('GetMe Status:', meRes.status);
    console.log('GetMe Response:', JSON.stringify(meRes.body, null, 2));
    if (meRes.status !== 200 || meRes.body.data.email !== testEmail) {
      throw new Error('GetMe profile retrieval failed');
    }

    // 6. Test Unauthorized access to /me without token
    console.log('\n[6] Testing Unauthorized Access (GET /api/v1/auth/me without token)...');
    const unauthRes = await httpRequest(PORT, '/api/v1/auth/me', 'GET');
    console.log('Unauth Status:', unauthRes.status);
    if (unauthRes.status !== 401) {
      throw new Error(`Expected 401 for missing token, got ${unauthRes.status}`);
    }

    console.log('\n🎉 ALL AUTH TESTS PASSED SUCCESSFULLY!');
  } finally {
    // Cleanup test student and family from database
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

runAuthTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
