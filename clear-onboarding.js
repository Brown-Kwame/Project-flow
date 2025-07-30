// Simple script to clear onboarding state
// Run this in your React Native app's development console

console.log('Clearing onboarding state...');

// Clear the onboarding flag
AsyncStorage.removeItem('hasSeenOnboarding')
  .then(() => {
    console.log('✅ Onboarding state cleared!');
    console.log('Restart the app to see the onboarding screens again.');
  })
  .catch((error) => {
    console.error('❌ Error clearing onboarding state:', error);
  }); 