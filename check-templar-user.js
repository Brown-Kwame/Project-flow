const axios = require('axios');

const API_BASE_URL = 'http://192.168.244.88:8080/api';

async function checkTemplarUser() {
  console.log('🔍 Checking if user "Templar" exists and testing login...\n');

  // Common password combinations to try
  const passwords = [
    'password',
    '123456',
    'templar',
    'Templar',
    'admin',
    'Admin',
    'test',
    'Test',
    '123456789',
    'qwerty',
    'password123',
    'templar123',
    'Templar123'
  ];

  console.log('Testing login for user "Templar" with different passwords...\n');

  for (const password of passwords) {
    try {
      console.log(`Trying password: "${password}"`);
      
      const loginData = {
        username: 'Templar',
        password: password
      };

      const response = await axios.post(`${API_BASE_URL}/auth/signin`, loginData);
      
      if (response.data.token) {
        console.log(`✅ SUCCESS! Password "${password}" works for user "Templar"`);
        console.log('   Token received:', response.data.token ? 'Yes' : 'No');
        console.log('   User ID:', response.data.id);
        console.log('   Username:', response.data.username);
        console.log('   Email:', response.data.email);
        return;
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log(`   ❌ Password "${password}" failed (401 Unauthorized)`);
      } else {
        console.log(`   ❌ Password "${password}" failed:`, error.message);
      }
    }
  }

  console.log('\n❌ None of the common passwords worked for user "Templar"');
  console.log('\nPossible issues:');
  console.log('1. User "Templar" does not exist in the database');
  console.log('2. User "Templar" exists but has a different password');
  console.log('3. The password is not in our test list');
  
  console.log('\nLet\'s try to create a new user "Templar"...');
  
  try {
    const signupData = {
      username: 'Templar',
      email: 'templar@example.com',
      password: 'templar123',
      firstName: 'Templar',
      lastName: 'User'
    };

    const signupResponse = await axios.post(`${API_BASE_URL}/auth/signup`, signupData);
    console.log('✅ Successfully created user "Templar"');
    console.log('   Response:', signupResponse.data);
    
    console.log('\nNow trying to login with the new user...');
    const loginData = {
      username: 'Templar',
      password: 'templar123'
    };

    const loginResponse = await axios.post(`${API_BASE_URL}/auth/signin`, loginData);
    console.log('✅ Login successful with new user "Templar"');
    console.log('   Token received:', loginResponse.data.token ? 'Yes' : 'No');
    console.log('   User ID:', loginResponse.data.id);
    
  } catch (error) {
    console.log('❌ Failed to create user "Templar":', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    }
  }
}

checkTemplarUser(); 