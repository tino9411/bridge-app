// milestonesRoutes.js

const express = require('express');
const {
  createMilestone,
  getAllMilestones,
  getMilestone,
  updateMilestone,
  deleteMilestone,
  updateMilestoneProgress
} = require('../controllers/milestoneController');

const authMiddleware = require('../middlewares/auth');
const checkProjectManagerRole = require('../middlewares/checkProjectManagerRole'); // Ensure you have this middleware to check for the project manager role
const router = express.Router();

// Routes for managing milestones
router.post('/:projectId/phases/:phaseId/milestones', authMiddleware,checkProjectManagerRole, createMilestone);
router.get('/:projectId/phases/:phaseId/milestones', authMiddleware, getAllMilestones);
router.get('/:projectId/phases/:phaseId/milestones/:milestoneId', authMiddleware, getMilestone);
router.put('/:projectId/phases/:phaseId/milestones/:milestoneId', authMiddleware, checkProjectManagerRole, updateMilestone);
router.patch('/:projectId/phases/:phaseId/milestones/:milestoneId/progress', authMiddleware, checkProjectManagerRole, updateMilestoneProgress);
router.delete('/:projectId/phases/:phaseId/milestones/:milestoneId', authMiddleware, checkProjectManagerRole, deleteMilestone);

module.exports = router;