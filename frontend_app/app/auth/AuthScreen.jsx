import React, { useState } from 'react';
import CreateAccount from '../auth/CreateAccount';
import Login from '../auth/Login';

const AuthScreen = () => {
  const [mode, setMode] = useState('signup'); // 'signup' or 'login'
  // You can use context or props to pass data to the rest of the app
  const handleSignup = (data) => {
    // Save user data to context or AsyncStorage here
    setMode('login');
  };
  const handleLogin = (data) => {
    // Validate and route to main app here
    // For now, just a placeholder
  };
  return mode === 'signup' ? (
    <CreateAccount onLogin={() => setMode('login')} onSignup={handleSignup} />
  ) : (
    <Login onSignup={() => setMode('signup')} onLogin={handleLogin} />
  );
};

export default AuthScreen;