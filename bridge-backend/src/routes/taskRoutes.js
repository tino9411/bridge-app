//taskRoutes.js
const express = require('express');
const {
  searchTasks,
  requestToJoinTask,
  respondToJoinRequest,
  leaveFeedback,
  addTask,
  getTasks,
  updateTask,
  deleteTask,
  assignTask,
  completeTask,
  updateChecklistItems,
  addPollToTask,
  addHistoryLog,

} = require('../controllers/taskController');
const authMiddleware = require('../middlewares/auth');
const checkProjectManagerRole = require('../middlewares/checkProjectManagerRole'); // Ensure this file exists and exports the middleware function
const {
    uploadFile
} = require('../controllers/fileController');
const router = express.Router();

router.get('/tasks/search', authMiddleware, searchTasks);
router.post('/tasks/:taskId/request-to-join', authMiddleware, requestToJoinTask);
router.post('/tasks/:taskId/respond-to-join-request', authMiddleware, checkProjectManagerRole, respondToJoinRequest); // Added checkProjectManagerRole here as well
router.post('/tasks/:taskId/leave-feedback', authMiddleware, leaveFeedback);
router.patch('/tasks/:taskId/update-checklist', authMiddleware, updateChecklistItems);
router.post('/tasks/:taskId/history', addHistoryLog);
router.post('/tasks/:taskId/add-poll', authMiddleware, addPollToTask);
router.post('/:projectId/tasks', authMiddleware, checkProjectManagerRole, addTask);
router.post('/:projectId/tasks/:taskId/assign', authMiddleware, checkProjectManagerRole, assignTask); // Added checkProjectManagerRole here as well
router.get('/:projectId/tasks', authMiddleware, getTasks);
router.put('/:projectId/tasks/:taskId', authMiddleware, checkProjectManagerRole, updateTask); // Added checkProjectManagerRole here as well
router.delete('/:projectId/tasks/:taskId', authMiddleware, checkProjectManagerRole, deleteTask); // Added checkProjectManagerRole here as well
router.post('/:projectId/tasks/:taskId/upload',authMiddleware, checkProjectManagerRole, uploadFile);
router.patch('/:projectId/tasks/:taskId/complete', authMiddleware, checkProjectManagerRole, completeTask);


module.exports = router;

