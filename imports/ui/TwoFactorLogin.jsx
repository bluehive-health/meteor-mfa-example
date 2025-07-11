import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';

export const TwoFactorLogin = ({ loginData, onSuccess, onCancel }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);

  // Countdown timer for auto-refresh of codes
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setTimeLeft(30); // Reset timer
    }
  }, [timeLeft]);

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setVerificationCode(value);
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a complete 6-digit code');
      return;
    }

    if (!loginData || !loginData.username || !loginData.password) {
      setError('Login session expired. Please try logging in again.');
      onCancel();
      return;
    }

    setLoading(true);
    setError('');

    const { username, password } = loginData;

    Meteor.loginWithPasswordAnd2faCode(username, password, verificationCode, (error) => {
      setLoading(false);
      
      if (error) {
        if (error.error === 'invalid-2fa-code') {
          setError('Invalid verification code. Please check your authenticator app and try again.');
          setVerificationCode(''); // Clear the code for retry
        } else if (error.error === 'no-2fa-code') {
          setError('Verification code is required.');
        } else {
          setError(error.reason || 'Login failed. Please try again.');
        }
      } else {
        // Successful login with 2FA
        onSuccess();
      }
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Two-Factor Authentication</h2>
        <p className="auth-subtitle">
          Enter the 6-digit code from your authenticator app
        </p>

        <div className="user-context">
          <p>Logging in as: <strong>{loginData?.username}</strong></p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="verificationCode">
              Verification Code
            </label>
            <input
              id="verificationCode"
              type="text"
              value={verificationCode}
              onChange={handleCodeChange}
              onKeyPress={handleKeyPress}
              placeholder="000000"
              maxLength="6"
              className="code-input large"
              disabled={loading}
              autoFocus
              autoComplete="one-time-code"
            />
            <div className="input-hint">
              Enter the 6-digit code from your authenticator app
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="button-group">
            <button 
              type="button"
              className="auth-button secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            
            <button 
              type="submit"
              className="auth-button primary"
              disabled={loading || verificationCode.length !== 6}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Verifying...
                </>
              ) : (
                'Verify & Login'
              )}
            </button>
          </div>
        </form>

        <div className="timer-section">
          <div className="timer-circle">
            <span className="timer-text">{timeLeft}s</span>
          </div>
          <p className="timer-description">
            Your authenticator app generates a new code every 30 seconds
          </p>
        </div>

        <div className="help-section">
          <h4>Trouble with your code?</h4>
          <ul>
            <li>Make sure the time on your device is synchronized</li>
            <li>Try waiting for the next code (codes refresh every 30 seconds)</li>
            <li>Check that you're using the correct authenticator app</li>
            <li>Ensure you're entering the 6-digit code without spaces</li>
          </ul>
        </div>
      </div>
    </div>
  );
};