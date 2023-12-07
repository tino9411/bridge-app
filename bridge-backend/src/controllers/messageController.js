const Message = require('../models/message');
const NotificationController = require('./notificationController');

exports.sendMessage = async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    await newMessage.save();

    // Create notification data for the receiver of the message
    const notificationData = {
      recipient: newMessage.receiver, // Receiver of the message
      sender: newMessage.sender, // Sender of the message
      message: `You have a new message from ${newMessage.senderName}`, // Assuming senderName is available
      relatedTo: newMessage._id,
      type: 'message'
    };

    // Send notification using NotificationController
    NotificationController.createNotification(notificationData, req.io);

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

  // Fetch messages between two users
  exports.getMessages = async (req, res) => {
    const { senderId, receiverId } = req.params;
    try {
      const messages = await Message.find({
        $or: [
          { sender: senderId, receiver: receiverId },
          { sender: receiverId, receiver: senderId }
        ]
      });
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Mark message as read
  exports.markMessageRead = async (req, res) => {

    const messageId = req.params.messageId;
    try {
      const updatedMessage = await Message.findByIdAndUpdate(
        messageId,
        { read: true },
        { new: true }
      );
      if (!updatedMessage) {
        return res.status(404).json({ error: 'Message not found' });
      }
      res.status(200).json(updatedMessage);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

// Delete message from database


  exports.deleteMessage = async (req, res) => {

    const messageId = req.params.messageId;
    try {
      const deletedMessage = await Message.findByIdAndDelete(messageId);
      if (!deletedMessage) {
        return res.status(404).json({ error: 'Message not found' });
      }
      res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };




