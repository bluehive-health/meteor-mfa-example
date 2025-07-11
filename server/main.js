import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Meteor.startup(async () => {
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
      Accounts.createUser({
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