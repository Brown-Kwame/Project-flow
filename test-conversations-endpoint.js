const axios = require('axios');

const API_BASE_URL = 'http://192.168.244.88:8080/api';

async function testConversationsEndpoint() {
  console.log('🔍 Testing Conversations Endpoint...\n');

  try {
    // Step 1: Create a test user
    console.log('1. Creating test user...');
    const timestamp = Date.now().toString().slice(-6);
    const signupData = {
      username: `convtest${timestamp}`,
      email: `convtest${timestamp}@example.com`,
      password: 'testpassword123',
      firstName: 'Conversation',
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
    console.log('✅ Login successful');

    // Step 3: Test the conversations endpoint
    console.log('\n3. Testing conversations endpoint...');
    try {
      const conversationsResponse = await axios.get(`${API_BASE_URL}/chat/conversations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('✅ Conversations endpoint is working!');
      console.log('   Response status:', conversationsResponse.status);
      console.log('   Number of conversations:', conversationsResponse.data.length);
      console.log('   Conversations data:', conversationsResponse.data);
    } catch (conversationsError) {
      console.log('❌ Conversations endpoint failed');
      console.log('   Error:', conversationsError.message);
      console.log('   Status:', conversationsError.response?.status);
      console.log('   Data:', conversationsError.response?.data);
    }

    // Step 4: Test the old history endpoint for comparison
    console.log('\n4. Testing old history endpoint for comparison...');
    try {
      const historyResponse = await axios.get(`${API_BASE_URL}/chat/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('✅ History endpoint is working');
      console.log('   Number of all messages:', historyResponse.data.length);
    } catch (historyError) {
      console.log('❌ History endpoint failed');
      console.log('   Error:', historyError.message);
    }

    console.log('\n📋 Summary:');
    console.log('1. If conversations endpoint works, the chat filtering should be fixed');
    console.log('2. If it fails, there might be a compilation or routing issue');

  } catch (error) {
    console.log('\n❌ Test failed:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    }
  }
}

testConversationsEndpoint(); 