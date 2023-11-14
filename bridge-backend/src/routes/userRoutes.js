const express = require('express');
const { 
    register, 
    login, 
    getProfile,
    logout,
    requestPasswordReset,
    resetPassword 
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Registration route
router.post('/register', register);

// Login route
router.post('/login', login);

// Logout route - requires user to be authenticated
router.post('/logout', authMiddleware, logout);

// Profile retrieval route - requires user to be authenticated
router.get('/profile', authMiddleware, getProfile);

// Password reset request route
router.post('/requestPasswordReset', requestPasswordReset);

// Password reset route
router.post('/resetPassword', resetPassword);

module.exports = router;
