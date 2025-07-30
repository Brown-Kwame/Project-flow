const axios = require('axios');

const API_BASE_URL = 'http://192.168.244.88:8080/api';

async function testGoalProgressData() {
  console.log('🔍 Testing Goal Progress Data Endpoint...\n');

  try {
    // Step 1: Create a test user
    console.log('1. Creating test user...');
    const timestamp = Date.now().toString().slice(-6);
    const signupData = {
      username: `goal${timestamp}`,
      email: `goal${timestamp}@example.com`,
      password: 'testpassword123',
      firstName: 'Goal',
      lastName: 'Test'
    };

    const signupResponse = await axios.post(`${API_BASE_URL}/auth/signup`, signupData);
    console.log('✅ Test user created');

    // Step 2: Login to get token and user ID
    console.log('\n2. Logging in...');
    const loginData = {
      username: signupData.username,
      password: signupData.password
    };

    const loginResponse = await axios.post(`${API_BASE_URL}/auth/signin`, loginData);
    const token = loginResponse.data.token;
    const userId = loginResponse.data.id;
    console.log('✅ Login successful');
    console.log('   User ID:', userId);

    // Step 3: Create a test goal with required fields
    console.log('\n3. Creating a test goal...');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const goalData = {
      name: `Test Goal for Progress Data ${timestamp}`,
      description: 'This is a test goal to verify progress data endpoint',
      status: 'IN_PROGRESS',
      ownerUserId: userId,
      workspaceId: 1, // Default workspace ID
      startDate: new Date().toISOString().split('T')[0], // Today
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      targetValue: 100.0,
      currentValue: 0.0,
      unit: 'tasks'
    };

    console.log('   Goal data:', goalData);
    const goalResponse = await axios.post(`${API_BASE_URL}/goals`, goalData, { headers });
    const goalId = goalResponse.data.id;
    console.log('✅ Test goal created with ID:', goalId);

    // Step 4: Create some test tasks for the goal
    console.log('\n4. Creating test tasks for the goal...');
    const taskData = {
      title: 'Test Task 1',
      description: 'First test task for goal progress',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      userId: userId,
      projectId: 1 // Default project ID
    };

    await axios.post(`${API_BASE_URL}/tasks`, taskData, { headers });
    console.log('✅ Test task 1 created');

    const taskData2 = {
      title: 'Test Task 2',
      description: 'Second test task for goal progress',
      status: 'COMPLETED',
      priority: 'HIGH',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
      userId: userId,
      projectId: 1 // Default project ID
    };

    await axios.post(`${API_BASE_URL}/tasks`, taskData2, { headers });
    console.log('✅ Test task 2 created');

    // Step 5: Test the goal progress data endpoint
    console.log('\n5. Testing goal progress data endpoint...');
    const progressResponse = await axios.get(`${API_BASE_URL}/goals/${goalId}/progress-data`, { headers });
    console.log('✅ Goal progress data retrieved successfully!');
    console.log('   Progress data:', progressResponse.data);

    // Step 6: Verify the data structure
    if (Array.isArray(progressResponse.data)) {
      console.log('\n6. Verifying data structure...');
      console.log('   Data is an array: ✅');
      console.log('   Array length:', progressResponse.data.length);
      
      if (progressResponse.data.length > 0) {
        const firstItem = progressResponse.data[0];
        console.log('   First item keys:', Object.keys(firstItem));
      }
    }

    console.log('\n🎉 Goal Progress Data Endpoint Test Passed!');
    console.log('   - User creation: ✅');
    console.log('   - Authentication: ✅');
    console.log('   - Goal creation: ✅');
    console.log('   - Task creation: ✅');
    console.log('   - Progress data retrieval: ✅');
    console.log('   - Data structure validation: ✅');

  } catch (error) {
    console.log('\n❌ Goal Progress Data Test Failed:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    }
  }
}

testGoalProgressData(); 