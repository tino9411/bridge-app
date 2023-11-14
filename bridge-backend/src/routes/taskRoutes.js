//taskRoutes.js
const express = require('express');
const {
  addTask,
  getTasks,
  updateTask,
  deleteTask,
  assignTask
} = require('../controllers/taskController');
const authMiddleware = require('../middlewares/auth');
const checkProjectManagerRole = require('../middlewares/checkProjectManagerRole'); // Ensure this file exists and exports the middleware function

const router = express.Router();

router.post('/:projectId/tasks', authMiddleware, checkProjectManagerRole, addTask);
router.post('/:projectId/tasks/:taskId/assign', authMiddleware, checkProjectManagerRole, assignTask); // Added checkProjectManagerRole here as well
router.get('/:projectId/tasks', authMiddleware, getTasks);
router.put('/:projectId/tasks/:taskId', authMiddleware, checkProjectManagerRole, updateTask); // Added checkProjectManagerRole here as well
router.delete('/:projectId/tasks/:taskId', authMiddleware, checkProjectManagerRole, deleteTask); // Added checkProjectManagerRole here as well

module.exports = router;

