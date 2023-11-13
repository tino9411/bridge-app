const express = require('express');
const { addTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.post('/:projectId/tasks', authMiddleware, addTask);
router.get('/:projectId/tasks', authMiddleware, getTasks);
router.put('/:projectId/tasks/:taskId', authMiddleware, updateTask);
router.delete('/:projectId/tasks/:taskId', authMiddleware, deleteTask);

module.exports = router;
