const axios = require('axios');

const API_BASE_URL = 'http://192.168.244.88:8080/api';

async function testLoginFlow() {
  console.log('🔍 Testing Login Flow...\n');

  try {
    // Test 1: Create a test user for login
    console.log('1. Creating test user for login...');
    const timestamp = Date.now().toString().slice(-6);
    const signupData = {
      username: `testuser${timestamp}`,
      email: `testuser${timestamp}@example.com`,
      password: 'testpassword123',
      firstName: 'Test',
      lastName: 'User'
    };

    const signupResponse = await axios.post(`${API_BASE_URL}/auth/signup`, signupData);
    console.log('✅ Test user created successfully');
    console.log('   Username:', signupData.username);
    console.log('   Password:', signupData.password);

    // Test 2: Login with the created user
    console.log('\n2. Testing login...');
    const loginData = {
      username: signupData.username,
      password: signupData.password
    };

    const loginResponse = await axios.post(`${API_BASE_URL}/auth/signin`, loginData);
    console.log('✅ Login successful');
    console.log('   Token received:', loginResponse.data.token ? 'Yes' : 'No');
    console.log('   User ID:', loginResponse.data.id);
    console.log('   Username:', loginResponse.data.username);

    // Test 3: Test authenticated endpoint
    console.log('\n3. Testing authenticated endpoint...');
    const headers = {
      'Authorization': `Bearer ${loginResponse.data.token}`,
      'Content-Type': 'application/json'
    };

    const userResponse = await axios.get(`${API_BASE_URL}/users/me`, { headers });
    console.log('✅ Authenticated request successful');
    console.log('   Current user:', userResponse.data.username);

    console.log('\n🎉 Login flow is working perfectly!');
    console.log('\n📋 Instructions for mobile app:');
    console.log('1. Use these credentials in your mobile app:');
    console.log(`   Username: ${signupData.username}`);
    console.log('   Password: testpassword123');
    console.log('2. The login should work and take you to the home page');
    console.log('3. If it doesn\'t work, check the console logs for debugging info');

  } catch (error) {
    console.log('\n❌ Login flow test failed:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    }
  }
}

testLoginFlow(); 