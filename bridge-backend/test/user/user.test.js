const supertest = require('supertest');
const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const app = require('../../src/app'); // Adjust the path to where your `app.js` file is located

const expect = chai.expect;
const request = supertest(app);

describe('User Endpoints', () => {
  before((done) => {
    // Connect to your test database
    // Make sure to use a different database for testing to avoid wiping out real data
    mongoose.connect(process.env.MONGODB_URI, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true
      });
  });

  after((done) => {
    // Cleanup test database and other resources after tests run
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(done);
    });
  });

  describe('POST /users/register', () => {
    it('should register a new user', (done) => {
      request.post('/users/register')
        .send({ name: 'Test User', email: 'testuser@example.com', password: 'password123' })
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('user');
          expect(res.body.user).to.have.property('email', 'testuser@example.com');
          // You can add more assertions here
          done();
        });
    });
  });

  describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
      request.post('/users/login')
        .send({ email: 'testuser@example.com', password: 'password123' })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('token');
          // Add more assertions as needed
          done();
        });
    });
  });

  // Add more tests for other endpoints as needed
});
