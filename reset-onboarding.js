const AsyncStorage = require('@react-native-async-storage/async-storage');

async function resetOnboarding() {
  try {
    await AsyncStorage.removeItem('hasSeenOnboarding');
    console.log('✅ Onboarding state reset successfully!');
    console.log('Now when you run the app, you should see the onboarding screens.');
  } catch (error) {
    console.error('❌ Error resetting onboarding state:', error);
  }
}

resetOnboarding(); 