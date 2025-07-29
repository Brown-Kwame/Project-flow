const axios = require('axios');

const API_BASE_URL = 'http://192.168.244.88:8080/api';

async function testExistingUser() {
  try {
    console.log('🔐 Testing with existing testuser...\n');
    
    // Login with existing testuser
    console.log('1️⃣ Logging in with testuser...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/signin`, {
      username: 'testuser',
      password: 'testpass123'
    });
    
    const token = loginResponse.data.token;
    const userId = loginResponse.data.id;
    console.log('✅ Login successful!');
    console.log(`   User ID: ${userId}`);
    console.log(`   Token: ${token.substring(0, 20)}...`);
    
    // Test goals endpoint
    console.log('\n2️⃣ Testing goals endpoint...');
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
      console.log('\n3️⃣ Testing goal progress endpoint...');
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
      console.log('\n🔍 Analysis of your mobile app 500 error:');
      console.log('1. The backend endpoint is working correctly');
      console.log('2. The issue is likely in the mobile app authentication or request handling');
      console.log('3. Check if the mobile app is sending the correct auth token');
      console.log('4. Verify the goal ID being used in the mobile app');
      
    } else {
      console.log('⚠️  No goals found. Creating a test goal...');
      
      const goalResponse = await axios.post(`${API_BASE_URL}/goals`, {
        name: 'Test Goal for Debugging',
        description: 'A test goal to debug the 500 error',
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
      console.log(`   Goal ID: ${goalResponse.data.id}`);
      
      // Test the progress endpoint with the new goal
      const progressResponse = await axios.get(`${API_BASE_URL}/goals/${goalResponse.data.id}/progress-data`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Goal progress endpoint working!');
      console.log(`   Status: ${progressResponse.status}`);
      console.log(`   Data points: ${progressResponse.data ? progressResponse.data.length : 0}`);
      
      console.log('\n🎉 SUCCESS! The goal progress endpoint is working correctly.');
    }
    
  } catch (error) {
    console.error('❌ Test failed');
    console.error(`   Error: ${error.message}`);
    
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
      
      if (error.response.status === 500) {
        console.error('\n🔧 500 error detected. This suggests:');
        console.error('1. Database connection issues');
        console.error('2. Missing database tables');
        console.error('3. Authentication service problems');
        console.error('4. Backend application errors');
      }
    }
  }
}

testExistingUser(); 