// This script helps reset the onboarding flag in your React Native app
// Run this in your React Native development console (Metro bundler console)

console.log('🔄 Resetting onboarding flag...');

// Method 1: Reset just the onboarding flag
const resetOnboarding = async () => {
  try {
    await AsyncStorage.removeItem('hasSeenOnboarding');
    console.log('✅ Onboarding flag reset successfully');
    console.log('📱 Now restart your app and try logging in again');
  } catch (error) {
    console.error('❌ Error resetting onboarding flag:', error);
  }
};

// Method 2: Clear all AsyncStorage (nuclear option)
const clearAllStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('✅ All AsyncStorage cleared');
    console.log('📱 Now restart your app and try logging in again');
  } catch (error) {
    console.error('❌ Error clearing AsyncStorage:', error);
  }
};

// Method 3: Check current onboarding status
const checkOnboardingStatus = async () => {
  try {
    const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
    console.log('📊 Current onboarding status:', hasSeenOnboarding);
    console.log('📊 Is first launch:', hasSeenOnboarding !== 'true');
  } catch (error) {
    console.error('❌ Error checking onboarding status:', error);
  }
};

// Export functions for use in console
window.resetOnboarding = resetOnboarding;
window.clearAllStorage = clearAllStorage;
window.checkOnboardingStatus = checkOnboardingStatus;

console.log('📋 Available commands:');
console.log('  - resetOnboarding() - Reset just the onboarding flag');
console.log('  - clearAllStorage() - Clear all AsyncStorage (nuclear option)');
console.log('  - checkOnboardingStatus() - Check current onboarding status');

// Auto-run status check
checkOnboardingStatus(); 