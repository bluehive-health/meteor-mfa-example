# Meteor Two-Factor Authentication Demo App

A modern, secure authentication application built with Meteor and React that demonstrates comprehensive two-factor authentication (2FA) implementation using authenticator apps like Google Authenticator, 1Password, Authy, and others.

## 🔐 Features

- **User Authentication**: Secure login and registration system
- **Two-Factor Authentication**: Complete 2FA implementation with QR code setup
- **Authenticator App Integration**: Works with Google Authenticator, 1Password, Authy, and other TOTP apps
- **Modern UI**: Clean, responsive interface with beautiful gradients and animations
- **Account Dashboard**: Comprehensive security overview and management
- **Real-time Validation**: Instant feedback for 2FA codes and authentication
- **Security Recommendations**: Built-in security best practices guidance

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Meteor](https://www.meteor.com/developers/install) (v3.3 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bluehive-health/meteor-mfa-example
   cd meteor-mfa-example
   ```

2. **Install dependencies**
   ```bash
   meteor npm install
   ```

3. **Start the development server**
   ```bash
   meteor run
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Test Account

The app automatically creates a test user on first startup:
- **Username**: `testuser`
- **Email**: `test@example.com`
- **Password**: `password123`

## 📱 How to Use

### 1. Create an Account or Login
- Register a new account with username, email, and password
- Or login with the test credentials above

### 2. Enable Two-Factor Authentication
- Go to the Dashboard after logging in
- Click "Enable 2FA" in the Security Settings section
- Scan the QR code with your authenticator app:
  - **Google Authenticator** (iOS/Android)
  - **1Password** (iOS/Android/Desktop)
  - **Authy** (iOS/Android/Desktop)
  - **Microsoft Authenticator** (iOS/Android)
  - **Any TOTP-compatible authenticator**

### 3. Verify Setup
- Enter the 6-digit code from your authenticator app
- Click "Enable 2FA" to complete setup

### 4. Login with 2FA
- Logout and login again
- After entering username/password, you'll see the 2FA verification screen
- Enter the current 6-digit code from your authenticator app
- Complete the secure login process

## 🛠 Technical Implementation

### Core 2FA Methods

The app uses the `accounts-2fa` package which provides these key methods:

#### Client-Side Methods

```javascript
// Check if user has 2FA enabled
Accounts.has2faEnabled((error, enabled) => {
  console.log('2FA Status:', enabled);
});

// Generate QR code for setup
Accounts.generate2faActivationQrCode("App Name", (error, result) => {
  const { svg, secret } = result;
  // Display QR code to user
});

// Enable 2FA with verification code
Accounts.enableUser2fa(verificationCode, (error) => {
  if (!error) {
    console.log('2FA enabled successfully');
  }
});

// Disable 2FA
Accounts.disableUser2fa((error) => {
  if (!error) {
    console.log('2FA disabled successfully');
  }
});

// Login with 2FA code
Meteor.loginWithPasswordAnd2faCode(username, password, code, (error) => {
  if (!error) {
    console.log('Successfully logged in with 2FA');
  }
});
```

### Project Structure

```
meteor-mfa-example/
├── client/
│   ├── main.jsx          # Client entry point
│   ├── main.html         # HTML template
│   └── main.css          # Global styles
├── imports/
│   └── ui/
│       ├── App.jsx           # Main app component
│       ├── LoginForm.jsx     # Login interface
│       ├── SignupForm.jsx    # Registration interface
│       ├── TwoFactorSetup.jsx # 2FA setup flow
│       ├── TwoFactorLogin.jsx # 2FA verification
│       └── Dashboard.jsx     # User dashboard
├── server/
│   └── main.js           # Server setup and config
└── .meteor/
    └── packages          # Meteor packages
```

### Key Dependencies

- **meteor-base**: Core Meteor functionality
- **accounts-base**: User account management
- **accounts-password**: Password authentication
- **accounts-2fa**: Two-factor authentication
- **react-meteor-data**: React integration
- **mongo**: Database integration


## 🔒 Security Features

### Two-Factor Authentication
- **TOTP (Time-based One-Time Password)**: Industry standard 2FA
- **QR Code Setup**: Easy authenticator app integration
- **Backup Codes**: Recovery options (can be extended)
- **Session Management**: Secure token handling

### Best Practices Implemented
- Input validation and sanitization
- Secure password handling
- Rate limiting protection
- Session timeout management
- Error handling without information disclosure

## 🚀 Deployment

### Development
```bash
meteor run --port 3000
```

## 📦 Package Configuration

### Meteor Packages Used
```
meteor-base@1.5.2           # Core Meteor
accounts-base                # User accounts
accounts-password            # Password auth
accounts-2fa                 # Two-factor auth
react-meteor-data           # React integration
mongo@2.1.2                 # Database
ecmascript@0.16.11          # Modern JavaScript
typescript@5.6.4            # TypeScript support
```

## 📄 Resources

- [Meteor Documentation](https://docs.meteor.com/packages/accounts-2fa)
- [accounts-2fa Package](https://github.com/meteor/meteor/tree/devel/packages/accounts-2fa)
- [React Documentation](https://reactjs.org/)
- [TOTP Standard (RFC 6238)](https://tools.ietf.org/html/rfc6238)
- [Google Authenticator](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2)
