const axios = require('axios');

async function testEndpoint() {
  try {
    console.log('Testing conversations endpoint...');
    
    // First, let's test if the backend is responding
    const response = await axios.get('http://192.168.244.88:8080/api/chat/history', {
      headers: { 'Authorization': 'Bearer test' }
    });
    console.log('Backend is responding');
    
    // Now test the conversations endpoint
    const convResponse = await axios.get('http://192.168.244.88:8080/api/chat/conversations', {
      headers: { 'Authorization': 'Bearer test' }
    });
    console.log('Conversations endpoint is working!');
    
  } catch (error) {
    console.log('Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
}

testEndpoint(); 