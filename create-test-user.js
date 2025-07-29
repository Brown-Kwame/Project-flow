const axios = require('axios');

const API_BASE_URL = 'http://192.168.244.88:8080/api';

async function createTestUserAndTest() {
  try {
    console.log('👤 Creating test user and testing goal progress...\n');
    
    // Step 1: Create a test user
    console.log('1️⃣ Creating test user...');
    const signupResponse = await axios.post(`${API_BASE_URL}/auth/signup`, {
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpass123',
      firstName: 'Test',
      lastName: 'User'
    });
    console.log('✅ User created successfully');
    console.log('   Response:', signupResponse.data);
    
    // Step 2: Login with the test user
    console.log('\n2️⃣ Logging in with test user...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/signin`, {
      username: 'testuser',
      password: 'testpass123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    console.log(`   Token: ${token.substring(0, 20)}...`);
    console.log(`   User ID: ${loginResponse.data.id}`);
    
    // Step 3: Create a test goal
    console.log('\n3️⃣ Creating a test goal...');
    const goalResponse = await axios.post(`${API_BASE_URL}/goals`, {
      name: 'Test Goal',
      description: 'A test goal for debugging',
      status: 'NOT_STARTED',
      ownerUserId: loginResponse.data.id,
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
    
    console.log('✅ Goal created successfully');
    console.log(`   Goal ID: ${goalResponse.data.id}`);
    console.log(`   Goal Name: ${goalResponse.data.name}`);
    
    // Step 4: Test the goal progress endpoint
    console.log('\n4️⃣ Testing goal progress endpoint...');
    const progressResponse = await axios.get(`${API_BASE_URL}/goals/${goalResponse.data.id}/progress-data`, {
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
    
    console.log('\n🎉 All tests passed! The goal progress endpoint is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed');
    console.error(`   Error type: ${error.code || 'HTTP Error'}`);
    console.error(`   Error message: ${error.message}`);
    
    if (error.response) {
      console.error(`   HTTP Status: ${error.response.status}`);
      console.error(`   Response data: ${JSON.stringify(error.response.data, null, 2)}`);
      
      if (error.response.status === 409) {
        console.error('\n🔧 User already exists. Trying to login instead...');
        // Try to login with existing user
        try {
          const loginResponse = await axios.post(`${API_BASE_URL}/auth/signin`, {
            username: 'testuser',
            password: 'testpass123'
          });
          
          const token = loginResponse.data.token;
          console.log('✅ Login successful with existing user');
          
          // Test goals endpoint
          const goalsResponse = await axios.get(`${API_BASE_URL}/goals`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          console.log(`✅ Found ${goalsResponse.data.length} goals`);
          
          if (goalsResponse.data.length > 0) {
            const firstGoal = goalsResponse.data[0];
            console.log(`   Testing with goal ID: ${firstGoal.id}`);
            
            const progressResponse = await axios.get(`${API_BASE_URL}/goals/${firstGoal.id}/progress-data`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            console.log('✅ Goal progress endpoint working');
            console.log(`   Status: ${progressResponse.status}`);
            console.log(`   Data points: ${progressResponse.data ? progressResponse.data.length : 0}`);
          }
        } catch (loginError) {
          console.error('❌ Login also failed:', loginError.response?.data);
        }
      }
    } else if (error.request) {
      console.error('   No response received - backend might not be running');
    } else {
      console.error('   Network or configuration error');
    }
  }
}

createTestUserAndTest(); 