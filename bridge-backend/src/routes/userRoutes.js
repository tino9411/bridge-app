//userRoutes.js
const express = require('express');
const { 
    register, 
    login, 
    getProfile,
    logout,
    requestPasswordReset,
    resetPassword,
    updatePassword 
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');
const cors = require('cors');
// Optionally define CORS options

const corsOptions = require('../config/corsOptions');

const router = express.Router();

// Registration route
router.post('/register', cors(corsOptions), register);

// Login route
router.post('/login', cors(corsOptions), login);

// Logout route - requires user to be authenticated
router.post('/logout', authMiddleware, logout);

// Profile retrieval route - requires user to be authenticated
router.get('/profile', authMiddleware, getProfile);

// Password reset request route
router.post('/requestPasswordReset', requestPasswordReset);

// Password reset route
router.post('/resetPassword', resetPassword);

//Password update route
router.post('/updatePassword', authMiddleware, updatePassword);

module.exports = router;
