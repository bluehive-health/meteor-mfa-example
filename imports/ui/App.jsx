import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { LoginForm } from './LoginForm.jsx';
import { SignupForm } from './SignupForm.jsx';
import { TwoFactorSetup } from './TwoFactorSetup.jsx';
import { TwoFactorLogin } from './TwoFactorLogin.jsx';
import { Dashboard } from './Dashboard.jsx';

export const App = () => {
  const [currentView, setCurrentView] = useState('login');
  const [pendingLogin, setPendingLogin] = useState(null);

  const user = useTracker(() => Meteor.user(), []);
  const isLoggedIn = !!user;

  // Handle view transitions
  const handleViewChange = (view, data = null) => {
    setCurrentView(view);
    if (data) {
      setPendingLogin(data);
    }
  };

  // Auto-redirect logic
  useEffect(() => {
    if (isLoggedIn && currentView !== 'dashboard' && currentView !== 'setup-2fa') {
      setCurrentView('dashboard');
      setPendingLogin(null);
    }
  }, [isLoggedIn, currentView]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'signup':
        return (
          <SignupForm 
            onSuccess={() => handleViewChange('dashboard')}
            onSwitchToLogin={() => handleViewChange('login')}
          />
        );
      
      case 'setup-2fa':
        return (
          <TwoFactorSetup 
            onComplete={() => handleViewChange('dashboard')}
            onCancel={() => handleViewChange('dashboard')}
          />
        );
      
      case 'verify-2fa':
        return (
          <TwoFactorLogin 
            loginData={pendingLogin}
            onSuccess={() => {
              handleViewChange('dashboard');
              setPendingLogin(null);
            }}
            onCancel={() => {
              handleViewChange('login');
              setPendingLogin(null);
            }}
          />
        );
      
      case 'dashboard':
        return (
          <Dashboard 
            onSetup2FA={() => handleViewChange('setup-2fa')}
            onLogout={() => {
              // Clear all local state first
              setCurrentView('login');
              setPendingLogin(null);
              
              // Then logout from Meteor
              Meteor.logout((error) => {
                if (error) {
                  console.error('Logout error:', error);
                } else {
                  console.log('Successfully logged out');
                }
              });
            }}
          />
        );
      
      default:
        return (
          <LoginForm 
            onSuccess={() => handleViewChange('dashboard')}
            onNeed2FA={(loginData) => handleViewChange('verify-2fa', loginData)}
            onSwitchToSignup={() => handleViewChange('signup')}
          />
        );
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🔐 Secure Login App</h1>
        {isLoggedIn && (
          <div className="user-info">
            Welcome, {user?.username || user?.emails?.[0]?.address}
          </div>
        )}
      </header>
      
      <main className="app-main">
        {renderCurrentView()}
      </main>
      
      <footer className="app-footer">
        <p>Powered by Meteor + accounts-2fa</p>
      </footer>
    </div>
  );
};