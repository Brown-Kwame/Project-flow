const axios = require('axios');

const API_BASE_URL = 'http://192.168.244.88:8080/api';

async function testImageAccess() {
  console.log('🔍 Testing Image Access...\n');

  try {
    // Step 1: Create a test user
    console.log('1. Creating test user...');
    const timestamp = Date.now().toString().slice(-6);
    const signupData = {
      username: `imagetest${timestamp}`,
      email: `imagetest${timestamp}@example.com`,
      password: 'testpassword123',
      firstName: 'Image',
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

    // Step 3: Get current user data
    console.log('\n3. Getting current user data...');
    const userResponse = await axios.get(`${API_BASE_URL}/users/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('✅ User data retrieved');
    console.log('   Current profile picture URL:', userResponse.data.profilePictureUrl);

    // Step 4: Test if the profile picture URL is accessible
    if (userResponse.data.profilePictureUrl) {
      console.log('\n4. Testing profile picture URL accessibility...');
      try {
        const imageResponse = await axios.get(userResponse.data.profilePictureUrl, {
          responseType: 'arraybuffer',
          timeout: 5000
        });
        console.log('✅ Profile picture is accessible');
        console.log('   Image size:', imageResponse.data.length, 'bytes');
        console.log('   Content-Type:', imageResponse.headers['content-type']);
      } catch (imageError) {
        console.log('❌ Profile picture is NOT accessible');
        console.log('   Error:', imageError.message);
        console.log('   Status:', imageError.response?.status);
      }
    } else {
      console.log('ℹ️  No profile picture URL found');
    }

    // Step 5: Test the uploads directory
    console.log('\n5. Testing uploads directory...');
    try {
      const uploadsResponse = await axios.get('http://192.168.244.88:8080/uploads/', {
        timeout: 5000
      });
      console.log('✅ Uploads directory is accessible');
    } catch (uploadsError) {
      console.log('❌ Uploads directory is NOT accessible');
      console.log('   Error:', uploadsError.message);
      console.log('   Status:', uploadsError.response?.status);
    }

    console.log('\n📋 Summary:');
    console.log('1. If profile picture is NOT accessible, the backend might not be serving static files correctly');
    console.log('2. If uploads directory is NOT accessible, the static file configuration might be wrong');
    console.log('3. Check the backend logs for any file serving errors');

  } catch (error) {
    console.log('\n❌ Test failed:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    }
  }
}

testImageAccess(); 