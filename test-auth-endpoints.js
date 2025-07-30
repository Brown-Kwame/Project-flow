const axios = require('axios');

const API_BASE_URL = 'http://192.168.244.88:8080/api';

async function testAuthEndpoints() {
  console.log('🔍 Testing Authentication Endpoints...\n');

  // Test 1: Try to create a user with shorter username
  try {
    console.log('1. Testing user signup...');
    const timestamp = Date.now().toString().slice(-6); // Use only last 6 digits
    const signupData = {
      username: `test${timestamp}`,
      email: `test${timestamp}@example.com`,
      password: 'testpassword123',
      firstName: 'Test',
      lastName: 'User'
    };

    console.log('   Sending signup data:', { ...signupData, password: '[HIDDEN]' });
    const signupResponse = await axios.post(`${API_BASE_URL}/auth/signup`, signupData);
    console.log('✅ User signup successful');
    console.log('   Response:', signupResponse.data);

    // Test 2: Try to login with the created user
    console.log('\n2. Testing user login...');
    const loginData = {
      username: signupData.username,
      password: signupData.password
    };

    console.log('   Sending login data:', { ...loginData, password: '[HIDDEN]' });
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/signin`, loginData);
    console.log('✅ User login successful');
    console.log('   Token received:', loginResponse.data.token ? 'Yes' : 'No');
    console.log('   Response structure:', Object.keys(loginResponse.data));

    if (loginResponse.data.token) {
      console.log('\n🎉 Authentication flow is working!');
      console.log('   - Signup endpoint: ✅');
      console.log('   - Login endpoint: ✅');
      console.log('   - JWT token generation: ✅');
      
      // Test 3: Test a protected endpoint with the token
      console.log('\n3. Testing protected endpoint with token...');
      const headers = {
        'Authorization': `Bearer ${loginResponse.data.token}`,
        'Content-Type': 'application/json'
      };

      try {
        const userResponse = await axios.get(`${API_BASE_URL}/users/me`, { headers });
        console.log('✅ Protected endpoint accessible with token');
        console.log('   User data:', userResponse.data);
        
        // Test 4: Test goals endpoint
        console.log('\n4. Testing goals endpoint...');
        const goalsResponse = await axios.get(`${API_BASE_URL}/goals`, { headers });
        console.log('✅ Goals endpoint working');
        console.log('   Goals count:', goalsResponse.data.length);
        
        // Test 5: Test tasks endpoint
        console.log('\n5. Testing tasks endpoint...');
        const tasksResponse = await axios.get(`${API_BASE_URL}/tasks`, { headers });
        console.log('✅ Tasks endpoint working');
        console.log('   Tasks count:', tasksResponse.data.length);
        
        console.log('\n🎉 Frontend-Backend communication is fully working!');
        console.log('   - Authentication: ✅');
        console.log('   - JWT token handling: ✅');
        console.log('   - Protected endpoints: ✅');
        console.log('   - Goals API: ✅');
        console.log('   - Tasks API: ✅');
        
      } catch (protectedError) {
        console.log('❌ Protected endpoint failed:', protectedError.message);
        if (protectedError.response) {
          console.log('   Status:', protectedError.response.status);
          console.log('   Data:', protectedError.response.data);
        }
      }
    }

  } catch (error) {
    console.log('\n❌ Authentication test failed:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    }
  }
}

testAuthEndpoints(); 