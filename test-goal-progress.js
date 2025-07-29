const axios = require('axios');

const API_BASE_URL = 'http://192.168.244.88:8080/api';

async function testGoalProgress() {
  try {
    console.log('Testing goal progress endpoint with new goal-specific logic...');
    
    // Test with goal ID 1
    const goalId = 1;
    console.log(`Testing with goal ID: ${goalId}`);
    
    const response = await axios.get(`${API_BASE_URL}/goals/${goalId}/progress-data`);
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
  } catch (error) {
    console.error('Error testing goal progress:', error.response?.status, error.response?.data);
    console.error('Full error:', error.message);
    
    if (error.response?.status === 500) {
      console.error('500 error details:', error.response.data);
    }
  }
}

testGoalProgress(); 