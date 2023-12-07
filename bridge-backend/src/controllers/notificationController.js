const Notification = require('../models/notification');

const NotificationController = {
    // Create a new notification
    createNotification: async (notificationData, io) => {
        try {
            const notification = new Notification(notificationData);
            await notification.save();

            // Emit notification to the recipient if they are connected
            io.to(notification.recipient.toString()).emit('notification', notification);
            
            return notification; // Return the created notification
        } catch (error) {
            console.error('Error creating notification:', error);
            throw error; // Throw error to be handled by the caller
        }
    },

    // Get notifications for a specific user
    getUserNotifications: async (req, res) => {
        const userId = req.params.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        try {
            const notifications = await Notification.find({ recipient: userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            res.status(200).json(notifications);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    

    // Mark a notification as read
    markAsRead: async (req, res) => {
        const notificationId = req.params.notificationId;
        try {
            const updatedNotification = await Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });
            if (!updatedNotification) {
                return res.status(404).json({ message: "Notification not found" });
            }
            res.status(200).json(updatedNotification);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Delete a notification
    deleteNotification: async (req, res) => {
        const notificationId = req.params.notificationId;
        try {
            const deletedNotification = await Notification.findByIdAndDelete(notificationId);
            if (!deletedNotification) {
                return res.status(404).json({ message: "Notification not found" });
            }
            res.status(200).json({ message: "Notification deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get count of unread notifications for a user
    getUnreadCount: async (req, res) => {
        const userId = req.params.userId;
        try {
            const count = await Notification.countDocuments({ recipient: userId, read: false });
            res.status(200).json({ unreadCount: count });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = NotificationController;
