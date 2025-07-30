const axios = require('axios');

const API_BASE_URL = 'http://192.168.244.88:8080/api';

async function testTemplarSignup() {
  console.log('🔍 Testing if user "Templar" exists...\n');

  try {
    // Try to create user "Templar"
    console.log('1. Attempting to create user "Templar"...');
    const signupData = {
      username: 'Templar',
      email: 'templar@example.com',
      password: 'templar123',
      firstName: 'Templar',
      lastName: 'User'
    };

    const signupResponse = await axios.post(`${API_BASE_URL}/auth/signup`, signupData);
    console.log('✅ User "Templar" created successfully');
    console.log('   Response:', signupResponse.data);

    // Now try to login with the created user
    console.log('\n2. Testing login with user "Templar"...');
    const loginData = {
      username: 'Templar',
      password: 'templar123'
    };

    const loginResponse = await axios.post(`${API_BASE_URL}/auth/signin`, loginData);
    console.log('✅ Login successful with user "Templar"');
    console.log('   Token received:', loginResponse.data.token ? 'Yes' : 'No');
    console.log('   User ID:', loginResponse.data.id);
    console.log('   Username:', loginResponse.data.username);

    console.log('\n🎉 User "Templar" is now available for login!');
    console.log('   Username: Templar');
    console.log('   Password: templar123');

  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('❌ User "Templar" already exists');
      console.log('   Error:', error.response.data);
      
      // Try to login with existing user
      console.log('\n2. Trying to login with existing user "Templar"...');
      console.log('   Please try these common passwords:');
      console.log('   - password');
      console.log('   - 123456');
      console.log('   - templar');
      console.log('   - Templar');
      console.log('   - admin');
      console.log('   - test');
      console.log('   - templar123');
      
    } else {
      console.log('❌ Error:', error.message);
      if (error.response) {
        console.log('   Status:', error.response.status);
        console.log('   Data:', error.response.data);
      }
    }
  }
}

testTemplarSignup(); 