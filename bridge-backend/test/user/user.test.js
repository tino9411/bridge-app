// user.test.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const supertest = require('supertest');
const chai = require('chai');
const mongoose = require('mongoose');
const app = require('../../src/server'); // Adjust the path to where your `app.js` file is located
const User = require('../../src/models/user'); // Import the User model, adjust the path as necessary

const expect = chai.expect;
const request = supertest(app);

describe('User Endpoints', function () {
    this.timeout(15000); // Extend timeout for long operations

    let userToken; // Token for authenticated routes
    let userProfileEmail = 'profileuser@example.com'; // Email to be used for the profile test

    // Connect to a separate test database
    before(async function () {
        const dbUri = process.env.MONGODB_URI;
        if (mongoose.connection.readyState) {
            await mongoose.disconnect();
        }
        await mongoose.connect(dbUri);
    });

    after(async function () {
        if (mongoose.connection.readyState) {
            await mongoose.connection.db.dropDatabase();
            await mongoose.connection.close();
        }
    });

    describe('POST /users/register', function () {
        it('should register a new user', async function () {
            const res = await request.post('/users/register').send({
                name: 'Test User',
                email: userProfileEmail,
                password: 'password123',
                role: 'projectManager'
            });

            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('user');
            expect(res.body.user).to.have.property('email', userProfileEmail);
            userToken = res.body.token; // Save the token for authenticated tests
        });
    });

    describe('POST /users/login', function () {
        it('should login user and return auth token', async function () {
            const res = await request.post('/users/login').send({
                email: userProfileEmail,
                password: 'password123'
            });

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('token');
            userToken = res.body.token; // Save the token for authenticated tests
        });
    });

    describe('GET /users/profile', function () {
        it('should retrieve the user profile using token', async function () {
            // Login is performed here to ensure the user profile test is independent of registration test
            const loginRes = await request.post('/users/login').send({
                email: userProfileEmail,
                password: 'password123'
            });

            // Test assumes login is successful and a token is received
            expect(loginRes.status).to.equal(200); // Verify login success before proceeding
            userToken = loginRes.body.token; // Use the token for the profile retrieval

            const res = await request.get('/users/profile')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('email', userProfileEmail);
        });
    });
    // Test for logout
    describe('POST /users/logout', function () {
      it('should log out a user', async function () {
          const res = await request.post('/users/logout')
              .set('Authorization', `Bearer ${userToken}`);

          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('message', 'Logged out successfully');

          // Test if the token is really invalidated
          const profileRes = await request.get('/users/profile')
              .set('Authorization', `Bearer ${userToken}`);

          expect(profileRes.status).to.equal(401); // Should fail as token should be invalidated
      });
  });

  // Test for password reset request
  describe('POST /users/requestPasswordReset', function () {
      it('should initiate a password reset process', async function () {
          const res = await request.post('/users/requestPasswordReset').send({
              email: userProfileEmail
          });

          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('message', 'Password reset email sent');
      });
  });

  // Test for password reset
  describe('POST /users/resetPassword', function () {
    it('should reset the password and allow login with the new password', async function () {
        // Request password reset (sends token to user's email in production)
        const resetRequestRes = await request.post('/users/requestPasswordReset').send({
            email: userProfileEmail
        });
        expect(resetRequestRes.status).to.equal(200);

        // Directly retrieve the reset token from the database
        const user = await User.findOne({ email: userProfileEmail });
        const resetToken = user.passwordResetToken; // Assuming your model has this field

        // Perform the password reset using the retrieved token
        const newPassword = 'newPassword123';
        const resetRes = await request.post('/users/resetPassword').send({
            token: resetToken,
            newPassword: newPassword
        });
        expect(resetRes.status).to.equal(200);

        // Now, attempt to log in with the new password
        const loginRes = await request.post('/users/login').send({
            email: userProfileEmail,
            password: newPassword
        });
        expect(loginRes.status).to.equal(200);
        expect(loginRes.body).to.have.property('token');
      });
    });
});
