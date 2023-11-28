// phaseRoutes.js

const express = require('express');
const {
  getPhases,
  getPhase,
  addPhase,
  updatePhase,
  deletePhase,
  assignTaskToPhase,
  removeTaskFromPhase,
} = require('../controllers/phaseController');

const authMiddleware = require('../middlewares/auth');
const checkProjectManagerRole = require('../middlewares/checkProjectManagerRole'); // Ensure you have this middleware to check for the project manager role

const router = express.Router();

// Routes for managing phases
router.get('/:projectId/phases', authMiddleware,getPhases);
router.post('/:projectId/phases', authMiddleware, checkProjectManagerRole, addPhase);
router.get('/:projectId/phases/:phaseId', authMiddleware, getPhase);
router.put('/:projectId/phases/:phaseId', authMiddleware, checkProjectManagerRole, updatePhase);
router.delete('/:projectId/phases/:phaseId', authMiddleware, checkProjectManagerRole, deletePhase);

// Route to assign a task to a phase
router.post('/:projectId/phases/:phaseId/tasks/:taskId', authMiddleware, checkProjectManagerRole, assignTaskToPhase);

// Route to remove a task from a phase
router.delete('/:projectId/phases/:phaseId/tasks/:taskId', authMiddleware, checkProjectManagerRole, removeTaskFromPhase);

module.exports = router;