// task.test.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const supertest = require('supertest');
const chai = require('chai');
const mongoose = require('mongoose');
const app = require('../../src/server'); // Adjust the path to where your `app.js` file is locatedconst User = require('../models/user'); // Adjust the path to your User model
const User = require('../../src/models/user'); // Make sure this path is correct
const Project = require('../../src/models/project'); // Import the Project model, adjust path as necessary
const Task = require('../../src/models/task'); // Adjust the path to your Task model

const expect = chai.expect;
const request = supertest(app);

describe('Task Endpoints', function () {
    this.timeout(20000); // Extend timeout for long operations

    let userToken; // Token for authenticated routes
    let projectId; // Project ID for task assignment
    let taskId; // Task ID for retrieval, update, and deletion

    const userProfileEmail = 'profileuser@example.com'; // Email to be used for the profile test

    before(async function () {
        const dbUri = process.env.MONGODB_URI;
        await mongoose.connect(dbUri);

        // Register and login user to get the token
        await request.post('/users/register').send({
            name: 'Test User',
            email: userProfileEmail,
            password: 'password123',
            role: 'projectManager'
        });

        const loginResponse = await request.post('/users/login').send({
            email: userProfileEmail,
            password: 'password123'
        });
        userToken = loginResponse.body.token;

        // Create a project to get the projectId
        const projectResponse = await request.post('/projects')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                name: 'New Project',
                description: 'Project Description'
            });
        projectId = projectResponse.body._id;
    });

    after(async function () {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    // Add a new task to the project
    it('should add a new task to the project', async function () {
        const taskData = {
            title: 'New Task',
            description: 'Task Description',
            status: 'open',
            priority: 'high',
            dueDate: new Date().toISOString()
        };
        const res = await request.post(`/projects/${projectId}/tasks`)
            .set('Authorization', `Bearer ${userToken}`)
            .send(taskData);
    
        console.log('Task creation response:', res.body); // Log the response body
    
        taskId = res.body._id;
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('title', 'New Task');
    });
    

    // Retrieve all tasks for the project
    it('should retrieve all tasks for a project', async function () {
        const res = await request.get(`/projects/${projectId}/tasks`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
    });

    // Update a task within the project
    it('should update a task within a project', async function () {
        const updatedTaskData = {
            title: 'Updated Task',
            description: 'Updated Description'
        };
        const res = await request.put(`/projects/${projectId}/tasks/${taskId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send(updatedTaskData);

        expect(res.status).to.equal(200);
        expect(res.body).to.include(updatedTaskData);
    });

    // Delete a task within the project
    it('should delete a task within a project', async function () {
        const res = await request.delete(`/projects/${projectId}/tasks/${taskId}`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.status).to.equal(200);
    });
});
