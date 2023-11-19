const express = require('express');
const router = express.Router();
const { 
    createComment, 
    getComments, 
    updateComment, 
    deleteComment } = require('../controllers/commentController');

// Create a new comment
router.post('/:projectId/comments', createComment);

// Get all comments for a project
router.get('/:projectId/comments', getComments);

// Update a comment
router.put('/:projectId/comments/:commentId', updateComment);

// Delete a comment
router.delete('/:projectId/comments/:commentId', deleteComment);

router.post('/:projectId/task/:taskId', createTaskComment);

module.exports = router;
