// messageRoutes.js
const express = require('express');
const {
    sendMessage,
    getMessages,
    markMessageRead,
    deleteMessage
} = require('../controllers/messageController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Route to send a new message
router.post('/', authMiddleware, sendMessage);

// Route to fetch messages between two users
router.get('/:senderId/:receiverId', authMiddleware, getMessages);

// Route to mark a message as read
router.patch('/:messageId/read', authMiddleware, markMessageRead);

router.delete('/:messageId/delete', authMiddleware, deleteMessage);

module.exports = router;
