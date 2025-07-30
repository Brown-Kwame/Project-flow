const axios = require('axios');

const API_BASE_URL = 'http://192.168.244.88:8080/api';

async function testBackendConnection() {
  console.log('🔍 Testing Frontend-Backend Communication...\n');

  try {
    // Test 1: Basic connectivity
    console.log('1. Testing basic connectivity...');
    const healthResponse = await axios.get(`${API_BASE_URL}/auth/test`, { timeout: 5000 });
    console.log('✅ Backend is reachable');
  } catch (error) {
    console.log('❌ Backend connectivity test failed:', error.message);
    return;
  }

  try {
    // Test 2: Create a test user
    console.log('\n2. Testing user creation...');
    const signupData = {
      username: 'testuser_' + Date.now(),
      email: `test${Date.now()}@example.com`,
      password: 'testpassword123',
      firstName: 'Test',
      lastName: 'User'
    };

    const signupResponse = await axios.post(`${API_BASE_URL}/auth/signup`, signupData);
    console.log('✅ User creation successful');
    console.log('   User ID:', signupResponse.data.id);

    // Test 3: Login with the created user
    console.log('\n3. Testing login...');
    const loginData = {
      username: signupData.username,
      password: signupData.password
    };

    const loginResponse = await axios.post(`${API_BASE_URL}/auth/signin`, loginData);
    console.log('✅ Login successful');
    console.log('   Token received:', loginResponse.data.token ? 'Yes' : 'No');

    const token = loginResponse.data.token;

    // Test 4: Test authenticated endpoint
    console.log('\n4. Testing authenticated endpoint...');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const userResponse = await axios.get(`${API_BASE_URL}/users/me`, { headers });
    console.log('✅ Authenticated request successful');
    console.log('   Current user:', userResponse.data.username);

    // Test 5: Test goals endpoint
    console.log('\n5. Testing goals endpoint...');
    const goalsResponse = await axios.get(`${API_BASE_URL}/goals`, { headers });
    console.log('✅ Goals endpoint working');
    console.log('   Goals count:', goalsResponse.data.length);

    // Test 6: Test tasks endpoint
    console.log('\n6. Testing tasks endpoint...');
    const tasksResponse = await axios.get(`${API_BASE_URL}/tasks`, { headers });
    console.log('✅ Tasks endpoint working');
    console.log('   Tasks count:', tasksResponse.data.length);

    // Test 7: Test projects endpoint
    console.log('\n7. Testing projects endpoint...');
    const projectsResponse = await axios.get(`${API_BASE_URL}/projects`, { headers });
    console.log('✅ Projects endpoint working');
    console.log('   Projects count:', projectsResponse.data.length);

    console.log('\n🎉 All tests passed! Frontend-Backend communication is working properly.');
    console.log('\n📋 Summary:');
    console.log('   - Backend connectivity: ✅');
    console.log('   - User authentication: ✅');
    console.log('   - JWT token handling: ✅');
    console.log('   - Protected endpoints: ✅');
    console.log('   - Goals API: ✅');
    console.log('   - Tasks API: ✅');
    console.log('   - Projects API: ✅');

  } catch (error) {
    console.log('\n❌ Test failed:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    }
  }
}

// Run the test
testBackendConnection(); 