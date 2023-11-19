
const express = require('express');
const router = express.Router();
const taskCommentController = require('../controllers/taskCommentController');

// Create a new comment
router.post('/', taskCommentController.createTaskComment);

// Get all comments for a task
router.get('/task/:taskId', taskCommentController.getTaskComments);

// Update a comment
router.put('/:commentId', taskCommentController.updateTaskComment);

// Delete a comment
router.delete('/:commentId', taskCommentController.deleteTaskComment);

module.exports = router;
