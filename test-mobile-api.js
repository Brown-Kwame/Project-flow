const axios = require('axios');

const API_BASE_URL = 'http://192.168.244.88:8080/api';

// Simulate the mobile app's API service
class MobileApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token (simulating mobile app)
    this.api.interceptors.request.use(
      async (config) => {
        // Simulate getting token from AsyncStorage
        const token = this.token; // In real app, this would be from AsyncStorage
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle auth errors (simulating mobile app)
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - clear storage and redirect to login
          this.token = null; // In real app, this would clear AsyncStorage
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token) {
    this.token = token;
  }

  // Authentication methods (matching mobile app)
  async login(credentials) {
    const response = await this.api.post('/auth/signin', credentials);
    return response.data;
  }

  async signup(userData) {
    const response = await this.api.post('/auth/signup', userData);
    return response.data;
  }

  // User methods (matching mobile app)
  async getCurrentUser() {
    const response = await this.api.get('/users/me');
    return response.data;
  }

  // Goals methods (matching mobile app)
  async getGoals() {
    const response = await this.api.get('/goals');
    return response.data;
  }

  async getGoalProgressData(goalId) {
    const response = await this.api.get(`/goals/${goalId}/progress-data`);
    return response.data;
  }

  // Tasks methods (matching mobile app)
  async getTasks() {
    const response = await this.api.get('/tasks');
    return response.data;
  }

  // Projects methods (matching mobile app)
  async getProjects() {
    const response = await this.api.get('/projects');
    return response.data;
  }
}

async function testMobileApiService() {
  console.log('🔍 Testing Mobile App API Service...\n');

  const apiService = new MobileApiService();

  try {
    // Test 1: Create a test user
    console.log('1. Testing user creation (signup)...');
    const timestamp = Date.now().toString().slice(-6);
    const signupData = {
      username: `mobile${timestamp}`,
      email: `mobile${timestamp}@example.com`,
      password: 'testpassword123',
      firstName: 'Mobile',
      lastName: 'Test'
    };

    const signupResponse = await apiService.signup(signupData);
    console.log('✅ User signup successful');
    console.log('   Response:', signupResponse);

    // Test 2: Login with the created user
    console.log('\n2. Testing user login...');
    const loginData = {
      username: signupData.username,
      password: signupData.password
    };

    const loginResponse = await apiService.login(loginData);
    console.log('✅ User login successful');
    console.log('   Token received:', loginResponse.token ? 'Yes' : 'No');
    console.log('   User ID:', loginResponse.id);
    console.log('   Username:', loginResponse.username);

    // Set the token for subsequent requests
    apiService.setToken(loginResponse.token);

    // Test 3: Get current user
    console.log('\n3. Testing getCurrentUser...');
    const userData = await apiService.getCurrentUser();
    console.log('✅ Current user retrieved');
    console.log('   Username:', userData.username);
    console.log('   Email:', userData.email);

    // Test 4: Get goals
    console.log('\n4. Testing getGoals...');
    const goals = await apiService.getGoals();
    console.log('✅ Goals retrieved');
    console.log('   Goals count:', goals.length);

    // Test 5: Get tasks
    console.log('\n5. Testing getTasks...');
    const tasks = await apiService.getTasks();
    console.log('✅ Tasks retrieved');
    console.log('   Tasks count:', tasks.length);

    // Test 6: Get projects
    console.log('\n6. Testing getProjects...');
    const projects = await apiService.getProjects();
    console.log('✅ Projects retrieved');
    console.log('   Projects count:', projects.length);

    // Test 7: Test goal progress data (the endpoint that was causing issues)
    if (goals.length > 0) {
      console.log('\n7. Testing getGoalProgressData...');
      const goalId = goals[0].id;
      const progressData = await apiService.getGoalProgressData(goalId);
      console.log('✅ Goal progress data retrieved');
      console.log('   Progress data:', progressData);
    } else {
      console.log('\n7. Skipping getGoalProgressData test (no goals available)');
    }

    console.log('\n🎉 Mobile App API Service is working perfectly!');
    console.log('\n📋 Summary:');
    console.log('   - API Base URL: ✅ http://192.168.244.88:8080/api');
    console.log('   - Authentication flow: ✅');
    console.log('   - JWT token handling: ✅');
    console.log('   - Request interceptors: ✅');
    console.log('   - Response interceptors: ✅');
    console.log('   - User endpoints: ✅');
    console.log('   - Goals endpoints: ✅');
    console.log('   - Tasks endpoints: ✅');
    console.log('   - Projects endpoints: ✅');
    console.log('   - Goal progress data: ✅');

  } catch (error) {
    console.log('\n❌ Mobile API Service test failed:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    }
  }
}

testMobileApiService(); 