const axios = require('axios');

const API_BASE_URL = 'http://192.168.244.88:8080/api';

async function checkBackend() {
  console.log('🔍 Checking backend status...\n');
  
  try {
    // Test 1: Basic connectivity
    console.log('1️⃣ Testing basic connectivity...');
    const response = await axios.get(`${API_BASE_URL}/goals`, {
      timeout: 3000
    });
    console.log('✅ Backend is running and responding');
    console.log(`   Status: ${response.status}`);
    console.log(`   Response time: ${response.headers['x-response-time'] || 'N/A'}\n`);
    
    // Test 2: Check if there are any goals
    console.log('2️⃣ Checking if goals exist...');
    if (response.data && Array.isArray(response.data)) {
      console.log(`✅ Found ${response.data.length} goals`);
      if (response.data.length > 0) {
        console.log(`   First goal: ${response.data[0].name} (ID: ${response.data[0].id})`);
      }
    } else {
      console.log('⚠️  No goals found or unexpected response format');
    }
    
    // Test 3: Test the specific endpoint that's failing
    console.log('\n3️⃣ Testing goal progress endpoint...');
    const goalId = response.data && response.data.length > 0 ? response.data[0].id : 1;
    console.log(`   Testing with goal ID: ${goalId}`);
    
    const progressResponse = await axios.get(`${API_BASE_URL}/goals/${goalId}/progress-data`, {
      timeout: 5000
    });
    console.log('✅ Goal progress endpoint is working');
    console.log(`   Status: ${progressResponse.status}`);
    console.log(`   Data points: ${progressResponse.data ? progressResponse.data.length : 0}`);
    
    console.log('\n🎉 All tests passed! Backend is working correctly.');
    
  } catch (error) {
    console.error('❌ Backend check failed');
    console.error(`   Error type: ${error.code || 'HTTP Error'}`);
    console.error(`   Error message: ${error.message}`);
    
    if (error.response) {
      console.error(`   HTTP Status: ${error.response.status}`);
      console.error(`   Response data: ${JSON.stringify(error.response.data, null, 2)}`);
    } else if (error.request) {
      console.error('   No response received - backend might not be running');
      console.error('   Possible solutions:');
      console.error('   1. Start the backend: cd asana-backend-unified && ./mvnw spring-boot:run');
      console.error('   2. Check if PostgreSQL is running');
      console.error('   3. Verify the IP address is correct');
    } else {
      console.error('   Network or configuration error');
    }
    
    console.log('\n🔧 Troubleshooting steps:');
    console.log('   1. Check if backend is running on port 8080');
    console.log('   2. Verify database connection');
    console.log('   3. Check application logs for errors');
    console.log('   4. Ensure PostgreSQL is running');
  }
}

checkBackend(); 