// notification routes
const express = require('express');
const router = express.Router();
const {
    getUserNotifications,
    markAsRead,
    deleteNotification,
    getUnreadCount
} = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/auth');

// Get notifications for a specific user
router.get('/user/:userId', authMiddleware, getUserNotifications);

// Mark a notification as read
router.patch('/markAsRead/:notificationId/read', authMiddleware, markAsRead);

// Delete a notification
router.delete('/delete/:notificationId', authMiddleware, deleteNotification);

// Get count of unread notifications for a user
router.get('/unreadCount/:userId', authMiddleware, getUnreadCount);

module.exports = router;
