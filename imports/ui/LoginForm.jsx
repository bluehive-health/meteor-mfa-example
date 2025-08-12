import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate, Link } from 'react-router-dom';
import { MFAUtils } from './MFAUtils.js';

export const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');

    Meteor.loginWithGoogle({
      requestPermissions: ['email', 'profile'],
      loginStyle: 'popup'
    }, (error) => {
      setGoogleLoading(false);
      if (error) {
        // Handle errors
        setError(error.reason || 'Google login failed');
      } else {
        // User is immediately logged in - NO way to stop here for 2FA
        console.log('Google login successful');
        navigate('/dashboard'); // Navigate to dashboard on success
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { username, password } = formData;

    if (!username || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    Meteor.loginWithPassword(username, password, async (error) => {
      if (error) {
        if (error.error === 'no-2fa-code') {
          // User has 2FA enabled, show SweetAlert 2FA dialog
          const success = await MFAUtils.show2FALogin({ username, password });
          setLoading(false);
          
          if (success) {
            navigate('/dashboard');
          }
          // If not successful, user can try again with the same form
        } else {
          // Handle other login errors
          setError(error.reason || 'Login failed. Please try again.');
          setLoading(false);
        }
      } else {
        // Successful login (user doesn't have 2FA)
        setLoading(false);
        navigate('/dashboard');
      }
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login to Your Account</h2>
        <p className="auth-subtitle">Enter your credentials to continue</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username or Email</label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username or email"
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="auth-button primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            margin: '1.5rem 0',
            gap: '1rem'
          }}>
            <hr style={{ 
              flex: 1, 
              border: 'none', 
              borderTop: '1px solid #e2e8f0' 
            }} />
            <span style={{ 
              color: '#718096', 
              fontSize: '0.875rem',
              whiteSpace: 'nowrap'
            }}>
              or continue with
            </span>
            <hr style={{ 
              flex: 1, 
              border: 'none', 
              borderTop: '1px solid #e2e8f0' 
            }} />
          </div>

          <button 
            type="button"
            className="auth-button secondary google-button"
            onClick={handleGoogleLogin}
            disabled={loading || googleLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              width: '100%'
            }}
          >
            {googleLoading ? (
              <>
                <span className="spinner"></span>
                Connecting to Google...
              </>
            ) : (
              <>
                <svg 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24"
                  style={{ flexShrink: 0 }}
                >
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>
        </form>

        <div className="auth-links">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="link-button">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};