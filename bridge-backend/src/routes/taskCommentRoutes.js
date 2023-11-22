// Corrected routes:

const express = require('express');
const router = express.Router();
const {
    createTaskComment,
    getTaskComments,
    updateTaskComment,
    deleteTaskComment,
    getTaskCommentCount,
    createTaskCommentReply,
    getTaskComment

} = require('../controllers/taskCommentController');
const authMiddleware = require('../middlewares/auth'); // Assume you have this middleware
const checkTeamMember  = require('../middlewares/checkTeamMember'); // Assume you have this middleware
const checkTaskCommentCreator = require('../middlewares/checkTaskCommentCreator'); // Assume you have this middleware
// Create a new comment
router.post('/:taskId/comments', authMiddleware, checkTeamMember, createTaskComment);

//Get comment
router.get('/:taskId/comments/:commentId', authMiddleware, checkTeamMember, getTaskComment);

// Create comment reply
router.post('/:taskId/comments/:commentId/replies', authMiddleware, checkTeamMember, createTaskCommentReply);
// Get all comments for a task
router.get('/:taskId/comments', authMiddleware, checkTeamMember, getTaskComments);

// Get task comment count
router.get('/:taskId/comment-count', authMiddleware, checkTeamMember, getTaskCommentCount);
// Update a comment
router.put('/:taskId/comments/:commentId', authMiddleware, checkTeamMember, checkTaskCommentCreator, updateTaskComment);

// Delete a comment
router.delete('/:taskId/comments/:commentId', authMiddleware, checkTeamMember, checkTaskCommentCreator, deleteTaskComment);


module.exports = router;