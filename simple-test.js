const axios = require('axios');

const API_BASE_URL = 'http://192.168.244.88:8080/api';

async function simpleTest() {
  try {
    console.log('🔐 Simple authentication test...\n');
    
    // Try to login with common test credentials
    const testCredentials = [
      { username: 'admin', password: 'admin' },
      { username: 'user', password: 'password' },
      { username: 'test', password: 'test' },
      { username: 'demo', password: 'demo' }
    ];
    
    let token = null;
    let userId = null;
    
    for (const cred of testCredentials) {
      try {
        console.log(`Trying to login with: ${cred.username}/${cred.password}`);
        const loginResponse = await axios.post(`${API_BASE_URL}/auth/signin`, cred);
        token = loginResponse.data.token;
        userId = loginResponse.data.id;
        console.log('✅ Login successful!');
        console.log(`   User ID: ${userId}`);
        console.log(`   Token: ${token.substring(0, 20)}...`);
        break;
      } catch (error) {
        console.log(`❌ Login failed for ${cred.username}: ${error.response?.status || 'Unknown error'}`);
      }
    }
    
    if (!token) {
      console.log('\n🔧 No existing users found. Creating a new test user...');
      
      // Create a new user
      const signupResponse = await axios.post(`${API_BASE_URL}/auth/signup`, {
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpass123',
        firstName: 'Test',
        lastName: 'User'
      });
      
      console.log('✅ User created:', signupResponse.data);
      
      // Login with the new user
      const loginResponse = await axios.post(`${API_BASE_URL}/auth/signin`, {
        username: 'testuser',
        password: 'testpass123'
      });
      
      token = loginResponse.data.token;
      userId = loginResponse.data.id;
      console.log('✅ Login successful with new user!');
    }
    
    // Test goals endpoint
    console.log('\n📋 Testing goals endpoint...');
    const goalsResponse = await axios.get(`${API_BASE_URL}/goals`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(`✅ Found ${goalsResponse.data.length} goals`);
    
    if (goalsResponse.data.length > 0) {
      const firstGoal = goalsResponse.data[0];
      console.log(`   Testing with goal: ${firstGoal.name} (ID: ${firstGoal.id})`);
      
      // Test the goal progress endpoint
      console.log('\n📊 Testing goal progress endpoint...');
      const progressResponse = await axios.get(`${API_BASE_URL}/goals/${firstGoal.id}/progress-data`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Goal progress endpoint working!');
      console.log(`   Status: ${progressResponse.status}`);
      console.log(`   Data points: ${progressResponse.data ? progressResponse.data.length : 0}`);
      
      if (progressResponse.data && progressResponse.data.length > 0) {
        console.log('   Sample data:', progressResponse.data[0]);
      }
      
      console.log('\n🎉 SUCCESS! The goal progress endpoint is working correctly.');
      console.log('The 500 error in your mobile app might be due to:');
      console.log('1. Authentication token issues');
      console.log('2. Different goal ID being used');
      console.log('3. Network connectivity issues');
      
    } else {
      console.log('⚠️  No goals found. Creating a test goal...');
      
      const goalResponse = await axios.post(`${API_BASE_URL}/goals`, {
        name: 'Test Goal',
        description: 'A test goal for debugging',
        status: 'NOT_STARTED',
        ownerUserId: userId,
        workspaceId: 1,
        startDate: '2024-01-01',
        dueDate: '2024-12-31',
        targetValue: 100,
        currentValue: 0,
        unit: 'points'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Goal created:', goalResponse.data.name);
      
      // Test the progress endpoint with the new goal
      const progressResponse = await axios.get(`${API_BASE_URL}/goals/${goalResponse.data.id}/progress-data`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Goal progress endpoint working!');
      console.log(`   Status: ${progressResponse.status}`);
      console.log(`   Data points: ${progressResponse.data ? progressResponse.data.length : 0}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed');
    console.error(`   Error: ${error.message}`);
    
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }
}

simpleTest(); 