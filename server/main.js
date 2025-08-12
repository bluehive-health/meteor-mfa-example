import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { ServiceConfiguration } from 'meteor/service-configuration';

Meteor.startup(async () => {
  // Configure Google OAuth if settings are provided
  if (Meteor.settings.google) {
    try {
      await ServiceConfiguration.configurations.upsertAsync(
        { service: 'google' },
        {
          $set: {
            clientId: Meteor.settings.google.clientId,
            secret: Meteor.settings.google.secret,
            loginStyle: 'popup'
          }
        }
      );
      console.log('Google OAuth configured successfully');
    } catch (error) {
      console.error('Error configuring Google OAuth:', error);
    }
  }

  // Optional: Configure accounts settings
  Accounts.config({
    sendVerificationEmail: false,
    forbidClientAccountCreation: false,
    loginExpirationInDays: 30,
  });

  // Optional: Create a test user if none exists
  try {
    const userCount = await Meteor.users.find().countAsync();
    if (userCount === 0) {
      console.log('Creating test user...');
      await Accounts.createUserAsync({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
      console.log('Test user created: testuser / password123');
    }
  } catch (error) {
    console.error('Error checking user count:', error);
  }

  console.log('Meteor 2FA app server started successfully!');
});