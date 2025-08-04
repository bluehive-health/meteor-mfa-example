import React, { useState, useEffect } from 'react';
import { Accounts } from 'meteor/accounts-base';
import { Buffer } from 'buffer';
import { validateTwoFactorCode } from '../utils/validation';

export const TwoFactorSetup = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState('generate'); // 'generate' | 'verify'
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const generateQRCode = () => {
    setLoading(true);
    setError('');

    Accounts.generate2faActivationQrCode("Secure Login App", (err, result) => {
      setLoading(false);
      
      if (err) {
        setError(err.reason || 'Failed to generate QR code');
      } else {
        const { svg, secret: qrSecret } = result;
        const base64QR = Buffer.from(svg).toString('base64');
        setQrCode(base64QR);
        setSecret(qrSecret);
        setStep('verify');
        setSuccess('QR code generated successfully! Scan it with your authenticator app.');
      }
    });
  };

  const verifyAndEnable2FA = () => {
    if (!validateTwoFactorCode(verificationCode)) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }

    setLoading(true);
    setError('');

    Accounts.enableUser2fa(verificationCode, (error) => {
      setLoading(false);
      
      if (error) {
        setError(error.reason || 'Invalid verification code');
      } else {
        setSuccess('2FA has been successfully enabled for your account!');
        
        // Force a small delay before completing to ensure user data is updated
        setTimeout(() => {
          console.log('2FA setup completed, redirecting to dashboard');
          onComplete();
        }, 1500);
      }
    });
  };

  // Auto-generate QR code on component mount
  useEffect(() => {
    if (step === 'generate') {
      generateQRCode();
    }
  }, []);

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setVerificationCode(value);
      setError('');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Set Up Two-Factor Authentication</h2>
        <p className="auth-subtitle">
          Enhance your account security with 2FA
        </p>

        {step === 'generate' && (
          <div className="setup-step">
            <div className="step-header">
              <span className="step-number">1</span>
              <h3>Generating QR Code...</h3>
            </div>
            
            {loading && (
              <div className="loading-state">
                <span className="spinner"></span>
                <p>Creating your unique QR code...</p>
              </div>
            )}
          </div>
        )}

        {step === 'verify' && (
          <div className="setup-step">
            <div className="step-header">
              <span className="step-number">1</span>
              <h3>Scan QR Code</h3>
            </div>
            
            <div className="qr-section">
              {qrCode && (
                <div className="qr-container">
                  <img
                    src={`data:image/svg+xml;base64,${qrCode}`}
                    alt="2FA QR Code"
                    className="qr-image"
                  />
                </div>
              )}
              
              <div className="instructions">
                <p><strong>Instructions:</strong></p>
                <ol>
                  <li>Open your authenticator app (Google Authenticator, 1Password, etc.)</li>
                  <li>Tap "Add account" or "Scan QR code"</li>
                  <li>Point your camera at the QR code above</li>
                  <li>Enter the 6-digit code from your app below</li>
                </ol>
              </div>
            </div>

            <div className="step-header">
              <span className="step-number">2</span>
              <h3>Verify Setup</h3>
            </div>

            <div className="verification-section">
              <div className="form-group">
                <label htmlFor="verificationCode">
                  Enter 6-digit code from your authenticator app:
                </label>
                <input
                  id="verificationCode"
                  type="text"
                  value={verificationCode}
                  onChange={handleCodeChange}
                  placeholder="000000"
                  maxLength="6"
                  className="code-input"
                  disabled={loading}
                  autoComplete="one-time-code"
                />
              </div>

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
                  type="button"
                  className="auth-button primary"
                  onClick={verifyAndEnable2FA}
                  disabled={loading || verificationCode.length !== 6}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Verifying...
                    </>
                  ) : (
                    'Enable 2FA'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

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

        <div className="security-note">
          <p><strong>Security Note:</strong> Keep your authenticator app secure and consider backing up your recovery codes. You'll need your authenticator app to log in from now on.</p>
        </div>
      </div>
    </div>
  );
};