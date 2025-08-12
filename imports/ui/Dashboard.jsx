import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate } from 'react-router-dom';
import { MFAUtils } from './MFAUtils.js';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [has2FA, setHas2FA] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const user = useTracker(() => Meteor.user(), []);

  // Use the proper Accounts.has2faEnabled method
  const checkTwoFactorStatus = () => {
    if (!user || !user._id) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError('');
    
    console.log('Checking 2FA status using Accounts.has2faEnabled method...');
    
    // Use the official method for checking 2FA status
    Accounts.has2faEnabled((error, isEnabled) => {
      console.log('Accounts.has2faEnabled result:', { error, isEnabled });
      
      if (error) {
        console.error('Error checking 2FA status:', error);
        // In case of error, assume 2FA is disabled for safety
        setHas2FA(false);
        setError('Failed to check 2FA status');
      } else {
        // Clear and straightforward - isEnabled is a boolean
        console.log('2FA status:', isEnabled ? 'ENABLED' : 'DISABLED');
        setHas2FA(isEnabled);
      }
      
      setLoading(false);
    });
  };

  // Check 2FA status when user data is available
  useEffect(() => {
    if (user && user._id) {
      checkTwoFactorStatus();
    }
  }, [user]);

  const handleRefresh2FAStatus = () => {
    checkTwoFactorStatus();
  };

  const handleEnable2FA = async () => {
    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const success = await MFAUtils.show2FASetup();
      if (success) {
        setSuccess('Two-factor authentication has been enabled');
        setHas2FA(true);
        // Refresh status after enabling
        setTimeout(() => {
          checkTwoFactorStatus();
        }, 500);
      }
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      setError('Failed to enable 2FA. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const success = await MFAUtils.disable2FA();
      if (success) {
        setSuccess('Two-factor authentication has been disabled');
        setHas2FA(false);
        // Refresh status after disabling
        setTimeout(() => {
          checkTwoFactorStatus();
        }, 500);
      }
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      setError('Failed to disable 2FA. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      setLoading(true);
      
      Meteor.logout((error) => {
        setLoading(false);
        if (error) {
          console.error('Logout error:', error);
          setError('Failed to logout. Please try again.');
        } else {
          navigate('/login');
        }
      });
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="loading-state">
            <span className="spinner"></span>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h2>Account Dashboard</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="auth-button secondary small"
              onClick={handleRefresh2FAStatus}
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button 
              className="auth-button secondary small"
              onClick={handleLogout}
              disabled={loading}
            >
              Logout
            </button>
          </div>
        </div>

        {/* User Information */}
        <div className="info-section">
          <h3>Account Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Username:</label>
              <span>{user?.username || 'Not set'}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{user?.emails?.[0]?.address || 'Not set'}</span>
            </div>
            <div className="info-item">
              <label>Account Created:</label>
              <span>{user?.createdAt ? formatDate(user.createdAt) : 'Unknown'}</span>
            </div>
            <div className="info-item">
              <label>Last Login:</label>
              <span>{user?.services?.resume?.loginTokens?.[0]?.when ? 
                formatDate(user.services.resume.loginTokens[0].when) : 'Unknown'}</span>
            </div>
          </div>
        </div>

        {/* 2FA Section */}
        <div className="security-section">
          <h3>Security Settings</h3>
          
          <div className="security-card">
            <div className="security-header">
              <div className="security-title">
                <h4>Two-Factor Authentication</h4>
                <span className={`status-badge ${has2FA ? 'enabled' : 'disabled'}`}>
                  {has2FA ? '✅ Enabled' : '❌ Disabled'}
                </span>
              </div>
            </div>
            
            <div className="security-content">
              <p>
                {has2FA 
                  ? 'Your account is protected with two-factor authentication. You\'ll need to enter a code from your authenticator app when logging in.'
                  : 'Enable two-factor authentication to add an extra layer of security to your account.'
                }
              </p>
              
              <div className="security-actions">
                {has2FA ? (
                  <button 
                    className="auth-button danger"
                    onClick={handleDisable2FA}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <>
                        <span className="spinner"></span>
                        Disabling...
                      </>
                    ) : (
                      'Disable 2FA'
                    )}
                  </button>
                ) : (
                  <button 
                    className="auth-button primary"
                    onClick={handleEnable2FA}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <>
                        <span className="spinner"></span>
                        Setting up...
                      </>
                    ) : (
                      'Enable 2FA'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        {/* Security Recommendations */}
        <div className="recommendations-section">
          <h3>Security Recommendations</h3>
          <div className="recommendation-list">
            <div className={`recommendation-item ${has2FA ? 'completed' : 'pending'}`}>
              <span className="recommendation-icon">
                {has2FA ? '✅' : '⚠️'}
              </span>
              <div className="recommendation-content">
                <h4>Enable Two-Factor Authentication</h4>
                <p>Add an extra layer of security to your account</p>
              </div>
            </div>
            
            <div className="recommendation-item completed">
              <span className="recommendation-icon">✅</span>
              <div className="recommendation-content">
                <h4>Strong Password</h4>
                <p>Your account is protected with a secure password</p>
              </div>
            </div>
            
            <div className="recommendation-item pending">
              <span className="recommendation-icon">💡</span>
              <div className="recommendation-content">
                <h4>Regular Security Review</h4>
                <p>Review your security settings periodically</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};