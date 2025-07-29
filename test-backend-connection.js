const axios = require('axios');

const API_BASE_URL = 'http://192.168.244.88:8080/api';

async function testBackendConnection() {
  try {
    console.log('Testing backend connection...');
    
    // Test basic connectivity
    console.log('1. Testing basic connectivity...');
    const response = await axios.get(`${API_BASE_URL}/goals`, {
      timeout: 5000
    });
    console.log('✅ Backend is running and responding');
    console.log('Response status:', response.status);
    
    // Test specific goal progress endpoint
    console.log('\n2. Testing goal progress endpoint...');
    const goalId = 1;
    const progressResponse = await axios.get(`${API_BASE_URL}/goals/${goalId}/progress-data`, {
      timeout: 5000
    });
    console.log('✅ Goal progress endpoint working');
    console.log('Response status:', progressResponse.status);
    console.log('Response data:', progressResponse.data);
    
  } catch (error) {
    console.error('❌ Backend connection failed');
    console.error('Error type:', error.code || 'HTTP Error');
    console.error('Error message:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received - backend might not be running');
      console.error('Request details:', error.request);
    }
  }
}

testBackendConnection(); 