// user.test.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const supertest = require('supertest');
const chai = require('chai');
const mongoose = require('mongoose');
const app = require('../../src/app'); // Adjust the path to where your `app.js` file is located

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
                password: 'password123'
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
});
