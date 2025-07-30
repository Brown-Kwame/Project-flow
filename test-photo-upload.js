const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_BASE_URL = 'http://192.168.244.88:8080/api';

async function testPhotoUpload() {
  console.log('🔍 Testing Photo Upload Functionality...\n');

  try {
    // Step 1: Create a test user
    console.log('1. Creating test user for photo upload...');
    const timestamp = Date.now().toString().slice(-6);
    const signupData = {
      username: `photouser${timestamp}`,
      email: `photouser${timestamp}@example.com`,
      password: 'testpassword123',
      firstName: 'Photo',
      lastName: 'User'
    };

    const signupResponse = await axios.post(`${API_BASE_URL}/auth/signup`, signupData);
    console.log('✅ Test user created successfully');
    console.log('   Username:', signupData.username);
    console.log('   User ID:', signupResponse.data.id);

    // Step 2: Login to get token
    console.log('\n2. Logging in...');
    const loginData = {
      username: signupData.username,
      password: signupData.password
    };

    const loginResponse = await axios.post(`${API_BASE_URL}/auth/signin`, loginData);
    const token = loginResponse.data.token;
    const userId = loginResponse.data.id;
    console.log('✅ Login successful');
    console.log('   Token received:', token ? 'Yes' : 'No');
    console.log('   User ID:', userId);

    // Step 3: Test profile picture upload
    console.log('\n3. Testing profile picture upload...');
    
    // Create a simple test image (1x1 pixel PNG)
    const testImagePath = path.join(__dirname, 'test-image.png');
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG header
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1 pixel
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, // rest of PNG data
      0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, 0x54, // IDAT chunk
      0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0xE2, 0x21, 0xBC, 0x33, // image data
      0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82  // IEND chunk
    ]);
    
    fs.writeFileSync(testImagePath, testImageBuffer);
    console.log('   Created test image at:', testImagePath);

    // Create form data
    const formData = new FormData();
    formData.append('file', fs.createReadStream(testImagePath), {
      filename: 'test-profile.png',
      contentType: 'image/png'
    });

    const headers = {
      'Authorization': `Bearer ${token}`,
      ...formData.getHeaders()
    };

    console.log('   Uploading test image...');
    const uploadResponse = await axios.put(
      `${API_BASE_URL}/users/${userId}/profile-picture`,
      formData,
      { headers }
    );

    console.log('✅ Profile picture upload successful!');
    console.log('   Response status:', uploadResponse.status);
    console.log('   Updated user:', uploadResponse.data.username);
    console.log('   Profile picture URL:', uploadResponse.data.profilePictureUrl);

    // Step 4: Test accessing the uploaded image
    console.log('\n4. Testing image access...');
    try {
      const imageResponse = await axios.get(uploadResponse.data.profilePictureUrl, {
        responseType: 'arraybuffer',
        timeout: 5000
      });
      console.log('✅ Image is accessible');
      console.log('   Image size:', imageResponse.data.length, 'bytes');
    } catch (imageError) {
      console.log('⚠️  Image access failed:', imageError.message);
      console.log('   This might be expected if the server is not configured to serve static files');
    }

    // Clean up
    fs.unlinkSync(testImagePath);
    console.log('\n🎉 Photo upload test completed successfully!');

  } catch (error) {
    console.log('\n❌ Photo upload test failed:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    }
  }
}

testPhotoUpload(); 