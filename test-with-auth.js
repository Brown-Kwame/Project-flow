const axios = require('axios');

const API_BASE_URL = 'http://192.168.244.88:8080/api';

async function testWithAuth() {
  try {
    console.log('🔐 Testing with authentication...\n');
    
    // Step 1: Login to get a token
    console.log('1️⃣ Logging in to get authentication token...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/signin`, {
      username: 'testuser', // Replace with actual username
      password: 'testpass'  // Replace with actual password
    });
    
    const token = loginResponse.data.accessToken;
    console.log('✅ Login successful');
    console.log(`   Token: ${token.substring(0, 20)}...`);
    
    // Step 2: Test goals endpoint with auth
    console.log('\n2️⃣ Testing goals endpoint with authentication...');
    const goalsResponse = await axios.get(`${API_BASE_URL}/goals`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Goals endpoint working');
    console.log(`   Found ${goalsResponse.data.length} goals`);
    
    if (goalsResponse.data.length > 0) {
      const firstGoal = goalsResponse.data[0];
      console.log(`   First goal: ${firstGoal.name} (ID: ${firstGoal.id})`);
      
      // Step 3: Test the specific goal progress endpoint
      console.log('\n3️⃣ Testing goal progress endpoint...');
      const progressResponse = await axios.get(`${API_BASE_URL}/goals/${firstGoal.id}/progress-data`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('✅ Goal progress endpoint working');
      console.log(`   Status: ${progressResponse.status}`);
      console.log(`   Data points: ${progressResponse.data ? progressResponse.data.length : 0}`);
      
      if (progressResponse.data && progressResponse.data.length > 0) {
        console.log('   Sample data:', progressResponse.data[0]);
      }
    } else {
      console.log('⚠️  No goals found - cannot test progress endpoint');
    }
    
    console.log('\n🎉 All tests passed! Backend is working correctly with authentication.');
    
  } catch (error) {
    console.error('❌ Test failed');
    console.error(`   Error type: ${error.code || 'HTTP Error'}`);
    console.error(`   Error message: ${error.message}`);
    
    if (error.response) {
      console.error(`   HTTP Status: ${error.response.status}`);
      console.error(`   Response data: ${JSON.stringify(error.response.data, null, 2)}`);
      
      if (error.response.status === 401) {
        console.error('\n🔧 Authentication failed. Possible solutions:');
        console.error('   1. Check if the username/password are correct');
        console.error('   2. Make sure the user exists in the database');
        console.error('   3. Try creating a new user first');
      } else if (error.response.status === 500) {
        console.error('\n🔧 Server error. Possible solutions:');
        console.error('   1. Check database connection');
        console.error('   2. Check application logs');
        console.error('   3. Verify database schema');
      }
    } else if (error.request) {
      console.error('   No response received - backend might not be running');
    } else {
      console.error('   Network or configuration error');
    }
  }
}

testWithAuth(); 