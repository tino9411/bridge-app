// project.test.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const supertest = require('supertest');
const chai = require('chai');
const mongoose = require('mongoose');
const app = require('../../src/server'); // Make sure this path is correct
const User = require('../../src/models/user'); // Make sure this path is correct
const Project = require('../../src/models/project'); // Import the Project model, adjust path as necessary

const expect = chai.expect;
const request = supertest(app);

describe('Project Endpoints', function () {
    this.timeout(15000); // Extend timeout for long operations

    let userToken; // Token for authenticated routes
    let projectId; // Store project ID for retrieval, update, and deletion
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

    describe('POST /projects', function () {
        it('should create a new project', async function () {
            const res = await request.post('/projects')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    name: 'New Project',
                    description: 'Project Description'
                });

            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('_id');
            projectId = res.body._id; // Store the project ID for later tests
        });
    });

    describe('GET /projects', function () {
        it('should retrieve all projects', async function () {
            const res = await request.get('/projects')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
        });
    });

    describe('GET /projects/{id}', function () {
        it('should retrieve a specific project by id', async function () {
            const res = await request.get(`/projects/${projectId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('_id', projectId);
        });
    });

    describe('PUT /projects/{id}', function () {
        it('should update a specific project by id', async function () {
            const res = await request.put(`/projects/${projectId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    name: 'Updated Project Name',
                    description: 'Updated Description'
                });

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('name', 'Updated Project Name');
        });
    });

    describe('DELETE /projects/{id}', function () {
        it('should delete a specific project by id', async function () {
            const res = await request.delete(`/projects/${projectId}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).to.equal(200);
        });
    });
});
