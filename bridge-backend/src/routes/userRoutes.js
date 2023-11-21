//userRoutes.js
const express = require('express');
const { 
    register, 
    login, 
    getProfile,
    logout,
    requestPasswordReset,
    resetPassword,
    updatePassword,
    updateProfile,
    checkUsername,
    getAssignedTasks
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');
const cors = require('cors');
const multer = require('multer');
// Optionally define CORS options

const corsOptions = require('../config/corsOptions');

const router = express.Router();

// Configure Multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads/'); // The folder where files will be saved
    },
    filename: function(req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Constructing the file name
    }
  });
  
  const upload = multer({ storage: storage });
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
router.post('/updatePassword', authMiddleware,updatePassword);

//Update profile route
router.patch('/updateProfile', authMiddleware, upload.single('profileImage'), updateProfile);

//Check the username for uniqueness
router.get('/checkUsername/username', checkUsername);

//Get assigned tasks
router.get('/assignedTasks/:username', authMiddleware, getAssignedTasks);

module.exports = router;
