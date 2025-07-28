const axios = require('axios');

const BASE_URL = 'http://localhost:8080';
let authToken = '';

// Test data
const testUser = {
    username: 'testuser2',
    email: 'test2@example.com',
    password: 'testpassword123',
    fullName: 'Test User 2'
};

const testProject = {
    name: 'Test Project ' + Date.now(),
    description: 'A test project',
    status: 'NOT_STARTED',
    ownerUserId: 1,
    workspaceId: 1
};

const testTask = {
    title: 'Test Task',
    description: 'A test task',
    priority: 'HIGH',
    status: 'TODO',
    userId: 1,
    projectId: 1
};

async function testEndpoint(method, endpoint, data = null, description = '', requireAuth = true) {
    try {
        const config = {
            method,
            url: `${BASE_URL}${endpoint}`,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (requireAuth && authToken) {
            config.headers['Authorization'] = `Bearer ${authToken}`;
        }

        if (data) {
            config.data = data;
        }

        const response = await axios(config);
        console.log(`✅ ${description || `${method} ${endpoint}`} - ${response.status}`);
        return response.data;
    } catch (error) {
        console.log(`❌ ${description || `${method} ${endpoint}`} - ${error.response?.status || error.message}`);
        if (error.response?.data) {
            console.log(`   Error details: ${JSON.stringify(error.response.data)}`);
        }
        return null;
    }
}

async function runTests() {
    console.log('🚀 Starting API Tests...\n');

    // 1. Test Authentication
    console.log('📋 Testing Authentication...');
    
    // Sign up first
    const signupResult = await testEndpoint('POST', '/api/auth/signup', testUser, 'Sign Up', false);
    
    // Sign in and capture token
    const signinResult = await testEndpoint('POST', '/api/auth/signin', {
        username: testUser.username,
        password: testUser.password
    }, 'Sign In', false);
    
    // Extract JWT token from signin response
    if (signinResult && signinResult.token) {
        authToken = signinResult.token;
        console.log('🔑 Authentication token captured successfully');
    } else {
        console.log('⚠️  Could not capture authentication token, some tests may fail');
        console.log('   Signin response:', JSON.stringify(signinResult, null, 2));
    }

    // 2. Test Projects
    console.log('\n📋 Testing Projects...');
    await testEndpoint('GET', '/api/projects', null, 'Get All Projects');
    const projectResult = await testEndpoint('POST', '/api/projects', testProject, 'Create Project');
    if (projectResult && projectResult.id) {
        await testEndpoint('GET', `/api/projects/${projectResult.id}`, null, 'Get Project by ID');
    }
    await testEndpoint('GET', '/api/projects/workspace/1', null, 'Get Projects by Workspace');
    await testEndpoint('GET', '/api/projects/owner/1', null, 'Get Projects by Owner');

    // 3. Test Tasks
    console.log('\n📋 Testing Tasks...');
    await testEndpoint('GET', '/api/tasks', null, 'Get All Tasks');
    const taskResult = await testEndpoint('POST', '/api/tasks', testTask, 'Create Task');
    if (taskResult && taskResult.id) {
        await testEndpoint('GET', `/api/tasks/${taskResult.id}`, null, 'Get Task by ID');
    }
    await testEndpoint('GET', '/api/tasks/user/1', null, 'Get Tasks by User');

    // 4. Test Users
    console.log('\n📋 Testing Users...');
    await testEndpoint('GET', '/api/users', null, 'Get All Users');
    await testEndpoint('GET', '/api/users/1', null, 'Get User by ID');
    await testEndpoint('PUT', '/api/users/1', {
        firstName: 'Updated',
        lastName: 'User',
        email: 'updated@example.com'
    }, 'Update User Profile');

    // 5. Test Teams
    console.log('\n📋 Testing Teams...');
    await testEndpoint('GET', '/api/teams', null, 'Get All Teams');
    await testEndpoint('POST', '/api/teams', {
        name: 'Test Team ' + Date.now(),
        description: 'A test team',
        ownerUserId: 1
    }, 'Create Team');

    // 6. Test Goals
    console.log('\n📋 Testing Goals...');
    await testEndpoint('GET', '/api/goals', null, 'Get All Goals');
    await testEndpoint('POST', '/api/goals', {
        name: 'Test Goal ' + Date.now(),
        description: 'A test goal',
        ownerUserId: 1,
        workspaceId: 1,
        targetDate: '2024-12-31'
    }, 'Create Goal');

    // 7. Test Portfolios
    console.log('\n📋 Testing Portfolios...');
    await testEndpoint('GET', '/api/portfolios', null, 'Get All Portfolios');
    await testEndpoint('POST', '/api/portfolios', {
        name: 'Test Portfolio',
        description: 'A test portfolio',
        userId: 1
    }, 'Create Portfolio');

    // 8. Test Chat
    console.log('\n📋 Testing Chat...');
    await testEndpoint('GET', '/api/chat/history', null, 'Get Chat History');
    await testEndpoint('POST', '/api/chat/send', {
        content: 'Hello, this is a test message',
        senderId: 1,
        recipientId: 2
    }, 'Send Message');

    // 9. Test Notifications
    console.log('\n📋 Testing Notifications...');
    await testEndpoint('GET', '/api/notifications', null, 'Get All Notifications');
    await testEndpoint('POST', '/api/notifications', {
        title: 'Test Notification',
        message: 'This is a test notification',
        userId: 1,
        type: 'INFO'
    }, 'Create Notification');

    console.log('\n🎉 API Testing Complete!');
}

// Run the tests
runTests().catch(console.error); 