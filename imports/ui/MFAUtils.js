import Swal from 'sweetalert2';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Buffer } from 'buffer';

// Custom SweetAlert theme
const mfaTheme = {
  customClass: {
    container: 'mfa-swal-container',
    popup: 'mfa-swal-popup',
    title: 'mfa-swal-title',
    content: 'mfa-swal-content',
    input: 'mfa-swal-input',
    confirmButton: 'auth-button primary',
    cancelButton: 'auth-button secondary',
    denyButton: 'auth-button danger'
  },
  buttonsStyling: false,
  background: '#ffffff',
  color: '#2d3748'
};

export class MFAUtils {
  
  // Show 2FA setup process
  static async show2FASetup() {
    try {
      // Step 1: Generate QR Code
      const result = await this.generateQRCode();
      if (!result) return false;

      const { qrCode, secret } = result;

      // Step 2: Show QR Code and get verification
      const verificationCode = await this.showQRCodeAndGetVerification(qrCode);
      if (!verificationCode) return false;

      // Step 3: Enable 2FA with verification code
      const enabled = await this.enable2FA(verificationCode);
      
      if (enabled) {
        await Swal.fire({
          ...mfaTheme,
          icon: 'success',
          title: '🎉 Success!',
          text: 'Two-factor authentication has been successfully enabled for your account!',
          confirmButtonText: 'Great!'
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('2FA setup error:', error);
      await Swal.fire({
        ...mfaTheme,
        icon: 'error',
        title: 'Setup Failed',
        text: 'Failed to setup 2FA. Please try again.',
        confirmButtonText: 'OK'
      });
      return false;
    }
  }

  // Generate QR code for 2FA setup
  static generateQRCode() {
    return new Promise((resolve) => {
      Accounts.generate2faActivationQrCode("Secure Login App", (err, result) => {
        if (err) {
          console.error('QR generation error:', err);
          resolve(null);
        } else {
          const { svg, secret } = result;
          const base64QR = Buffer.from(svg).toString('base64');
          resolve({ qrCode: base64QR, secret });
        }
      });
    });
  }

  // Show QR code and get verification code from user
  static async showQRCodeAndGetVerification(qrCode) {
    const { value: verificationCode } = await Swal.fire({
      ...mfaTheme,
      title: 'Set Up Two-Factor Authentication',
      html: `
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="background: white; padding: 20px; border-radius: 12px; border: 2px solid #e2e8f0; display: inline-block; margin-bottom: 20px;">
            <img src="data:image/svg+xml;base64,${qrCode}" alt="2FA QR Code" style="max-width: 200px; height: auto;" />
          </div>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 15px; text-align: left;">
            <p style="font-weight: 600; margin-bottom: 5px; color: #4a5568;">Instructions:</p>
            <ol style="margin-left: 20px; color: #718096; font-size: 14px;">
              <li>Open your authenticator app (Google Authenticator, 1Password, etc.)</li>
              <li>Tap "Add account" or "Scan QR code"</li>
              <li>Point your camera at the QR code above</li>
              <li>Enter the 6-digit code from your app below</li>
            </ol>
          </div>
        </div>
      `,
      input: 'text',
      inputLabel: 'Enter 6-digit code from your authenticator app:',
      inputPlaceholder: '000000',
      inputAttributes: {
        maxlength: 6,
        style: 'text-align: center; font-size: 1.5rem; font-weight: 600; letter-spacing: 0.5em; font-family: monospace;'
      },
      showCancelButton: true,
      confirmButtonText: 'Enable 2FA',
      cancelButtonText: 'Cancel',
      allowOutsideClick: false,
      allowEscapeKey: false,
      inputValidator: (value) => {
        if (!value || value.length !== 6 || !/^\d{6}$/.test(value)) {
          return 'Please enter a complete 6-digit code';
        }
      },
      preConfirm: (value) => {
        return value;
      }
    });

    return verificationCode;
  }

  // Enable 2FA with verification code
  static enable2FA(verificationCode) {
    return new Promise((resolve) => {
      Accounts.enableUser2fa(verificationCode, (error) => {
        if (error) {
          Swal.fire({
            ...mfaTheme,
            icon: 'error',
            title: 'Invalid Code',
            text: error.reason || 'Invalid verification code. Please try again.',
            confirmButtonText: 'OK'
          });
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  // Show 2FA login verification
  static async show2FALogin(loginData) {
    if (!loginData || !loginData.username || !loginData.password) {
      await Swal.fire({
        ...mfaTheme,
        icon: 'error',
        title: 'Session Expired',
        text: 'Login session expired. Please try logging in again.',
        confirmButtonText: 'OK'
      });
      return false;
    }

    const { value: verificationCode } = await Swal.fire({
      ...mfaTheme,
      title: 'Two-Factor Authentication',
      html: `
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="color: #4a5568;">Logging in as: <strong>${loginData.username}</strong></p>
          </div>
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 10px;">
            <span style="color: white; font-weight: 600; font-size: 14px;" id="timer">30s</span>
          </div>
          <p style="color: #718096; font-size: 14px; margin-bottom: 20px;">Your authenticator app generates a new code every 30 seconds</p>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; text-align: left;">
            <h4 style="color: #4a5568; margin-bottom: 10px; font-size: 16px;">Trouble with your code?</h4>
            <ul style="margin-left: 20px; color: #718096; font-size: 14px;">
              <li style="margin-bottom: 5px;">Make sure the time on your device is synchronized</li>
              <li style="margin-bottom: 5px;">Try waiting for the next code (codes refresh every 30 seconds)</li>
              <li style="margin-bottom: 5px;">Check that you're using the correct authenticator app</li>
              <li>Ensure you're entering the 6-digit code without spaces</li>
            </ul>
          </div>
        </div>
      `,
      input: 'text',
      inputLabel: 'Enter the 6-digit code from your authenticator app:',
      inputPlaceholder: '000000',
      inputAttributes: {
        maxlength: 6,
        style: 'text-align: center; font-size: 2rem; font-weight: 600; letter-spacing: 0.5em; font-family: monospace; padding: 15px;'
      },
      showCancelButton: true,
      confirmButtonText: 'Verify & Login',
      cancelButtonText: 'Cancel',
      allowOutsideClick: false,
      allowEscapeKey: false,
      inputValidator: (value) => {
        if (!value || value.length !== 6 || !/^\d{6}$/.test(value)) {
          return 'Please enter a complete 6-digit code';
        }
      },
      didOpen: () => {
        // Start countdown timer
        let timeLeft = 30;
        const timer = document.getElementById('timer');
        const interval = setInterval(() => {
          timeLeft--;
          if (timer) {
            timer.textContent = `${timeLeft}s`;
          }
          if (timeLeft <= 0) {
            timeLeft = 30;
          }
        }, 1000);

        // Store interval to clean up later
        window.mfaTimerInterval = interval;
      },
      willClose: () => {
        // Clean up timer
        if (window.mfaTimerInterval) {
          clearInterval(window.mfaTimerInterval);
          window.mfaTimerInterval = null;
        }
      }
    });

    if (!verificationCode) {
      return false;
    }

    // Attempt login with 2FA code
    return new Promise((resolve) => {
      const { username, password } = loginData;
      
      Meteor.loginWithPasswordAnd2faCode(username, password, verificationCode, (error) => {
        if (error) {
          if (error.error === 'invalid-2fa-code') {
            Swal.fire({
              ...mfaTheme,
              icon: 'error',
              title: 'Invalid Code',
              text: 'Invalid verification code. Please check your authenticator app and try again.',
              confirmButtonText: 'OK'
            });
          } else {
            Swal.fire({
              ...mfaTheme,
              icon: 'error',
              title: 'Login Failed',
              text: error.reason || 'Login failed. Please try again.',
              confirmButtonText: 'OK'
            });
          }
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  // Disable 2FA with confirmation
  static async disable2FA() {
    const confirmed = await Swal.fire({
      ...mfaTheme,
      icon: 'warning',
      title: 'Disable Two-Factor Authentication?',
      text: 'Are you sure you want to disable two-factor authentication? This will make your account less secure.',
      showCancelButton: true,
      confirmButtonText: 'Yes, Disable',
      cancelButtonText: 'Cancel',
      customClass: {
        ...mfaTheme.customClass,
        confirmButton: 'auth-button danger',
        cancelButton: 'auth-button secondary'
      }
    });

    if (!confirmed.isConfirmed) {
      return false;
    }

    return new Promise((resolve) => {
      Accounts.disableUser2fa((error) => {
        if (error) {
          Swal.fire({
            ...mfaTheme,
            icon: 'error',
            title: 'Failed to Disable',
            text: error.reason || 'Failed to disable 2FA. Please try again.',
            confirmButtonText: 'OK'
          });
          resolve(false);
        } else {
          Swal.fire({
            ...mfaTheme,
            icon: 'success',
            title: 'Disabled',
            text: 'Two-factor authentication has been disabled.',
            confirmButtonText: 'OK'
          });
          resolve(true);
        }
      });
    });
  }
}