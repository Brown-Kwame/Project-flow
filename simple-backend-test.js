const axios = require('axios');

const API_BASE_URL = 'http://192.168.244.88:8080/api';

async function simpleBackendTest() {
  console.log('🔍 Simple Backend Connectivity Test...\n');

  // Test 1: Check if backend is running
  try {
    console.log('1. Testing if backend is reachable...');
    const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/actuator/health`, { timeout: 5000 });
    console.log('✅ Backend is reachable');
    console.log('   Status:', response.status);
  } catch (error) {
    console.log('❌ Backend health check failed:', error.message);
    
    // Try alternative endpoints
    try {
      console.log('\n2. Trying alternative endpoint...');
      const response = await axios.get(`${API_BASE_URL.replace('/api', '')}`, { timeout: 5000 });
      console.log('✅ Backend responds to root endpoint');
    } catch (error2) {
      console.log('❌ Root endpoint also failed:', error2.message);
      return;
    }
  }

  // Test 2: Try to create a user
  try {
    console.log('\n3. Testing user creation...');
    const signupData = {
      username: 'testuser_' + Date.now(),
      email: `test${Date.now()}@example.com`,
      password: 'testpassword123',
      firstName: 'Test',
      lastName: 'User'
    };

    const signupResponse = await axios.post(`${API_BASE_URL}/auth/signup`, signupData);
    console.log('✅ User creation successful');
    console.log('   Response:', signupResponse.data);

    // Test 3: Try to login
    console.log('\n4. Testing login...');
    const loginData = {
      username: signupData.username,
      password: signupData.password
    };

    const loginResponse = await axios.post(`${API_BASE_URL}/auth/signin`, loginData);
    console.log('✅ Login successful');
    console.log('   Token received:', loginResponse.data.token ? 'Yes' : 'No');

    if (loginResponse.data.token) {
      console.log('\n🎉 Frontend-Backend communication is working!');
      console.log('   - Backend is reachable ✅');
      console.log('   - User creation works ✅');
      console.log('   - Login works ✅');
      console.log('   - JWT token generation works ✅');
    }

  } catch (error) {
    console.log('\n❌ Authentication test failed:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    }
  }
}

simpleBackendTest(); 