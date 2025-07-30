const axios = require('axios');

const API_BASE_URL = 'http://192.168.244.88:8080/api';

async function simplePhotoTest() {
  console.log('🔍 Simple Photo Upload Test...\n');

  try {
    // Step 1: Create a test user
    console.log('1. Creating test user...');
    const timestamp = Date.now().toString().slice(-6);
    const signupData = {
      username: `phototest${timestamp}`,
      email: `phototest${timestamp}@example.com`,
      password: 'testpassword123',
      firstName: 'Photo',
      lastName: 'Test'
    };

    const signupResponse = await axios.post(`${API_BASE_URL}/auth/signup`, signupData);
    console.log('✅ Test user created');
    console.log('   Username:', signupData.username);
    console.log('   User ID:', signupResponse.data.id);

    // Step 2: Login
    console.log('\n2. Logging in...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/signin`, {
      username: signupData.username,
      password: signupData.password
    });
    
    const token = loginResponse.data.token;
    const userId = loginResponse.data.id;
    console.log('✅ Login successful');
    console.log('   Token received:', token ? 'Yes' : 'No');

    // Step 3: Test the endpoint exists
    console.log('\n3. Testing endpoint accessibility...');
    try {
      const testResponse = await axios.get(`${API_BASE_URL}/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('✅ User endpoint accessible');
      console.log('   Current user:', testResponse.data.username);
    } catch (error) {
      console.log('❌ User endpoint failed:', error.message);
    }

    console.log('\n📋 Next steps:');
    console.log('1. Try uploading a photo in your mobile app');
    console.log('2. Check the console logs for any errors');
    console.log('3. If it fails, the issue might be:');
    console.log('   - File permissions on the server');
    console.log('   - Network connectivity');
    console.log('   - Image format issues');

  } catch (error) {
    console.log('\n❌ Test failed:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    }
  }
}

simplePhotoTest(); 