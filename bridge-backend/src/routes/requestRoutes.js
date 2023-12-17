// requestRoutes.js
const express = require('express');
const {
    createRequest,
    updateRequestStatus,
    getUserRequests
} = require('../controllers/requestController');

const authMiddleware = require('../middlewares/auth');
const checkProjectManagerRole = require('../middlewares/checkProjectManagerRole');

const router = express.Router();

// Route to create a new join request
router.post('/', authMiddleware, createRequest);

// Route to update the status of a join request
router.patch('/:requestId/status', authMiddleware, updateRequestStatus);

// Route to get all join requests for a specific user (project manager)
router.get('/user/:userId', authMiddleware, getUserRequests);

module.exports = router;
