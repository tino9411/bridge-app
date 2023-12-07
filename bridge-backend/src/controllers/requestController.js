const Request = require('../models/request');
const Task = require('../models/task');
const NotificationController = require('./notificationController'); 
const TaskController = require('./taskController'); // Import TaskController

  // Create a new join request
  exports.createRequest = async (req, res) => {
    try {
      const newRequest = new Request(req.body);
      await newRequest.populate('task').execPopulate(); // Populate task details
      await newRequest.save();
  
      // Notification data
      const notificationData = {
        user: newRequest.user, // Sender of the request
        recipient: newRequest.task.project.projectManager, // Project manager
        message: `New join request for task: ${newRequest.task.title}`,
        relatedTo: newRequest.task._id,
        type: 'request'
      };
  
      // Send notification
      NotificationController.createNotification(notificationData, req.io);
  
      res.status(201).json(newRequest);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  // Update request status (approve/reject)
  exports.updateRequestStatus = async (req, res) => {
    const { requestId, status } = req.body; // 'approved' or 'rejected'
    try {
      const request = await Request.findById(requestId).populate('task').populate('user');
      if (!request) {
        return res.status(404).json({ error: 'Request not found' });
      }
  
      if (status === 'approved') {
        // Create a mock request object to simulate the request structure expected by assignTask
        const mockReq = {
          params: { taskId: request.task._id },
          body: { userId: request.user._id },
          session: {}, // Include other necessary properties from the original req object
        };
  
        // Call assignTask from TaskController
        await TaskController.assignTask(mockReq, res);
      }
  
      request.status = status;
      await request.save();
  
      // Notification data
      const notificationData = {
        user: request.task.project.projectManager, // Project manager
        recipient: request.user._id, // User who made the request
        message: `Your request to join '${request.task.title}' has been ${status}`,
        relatedTo: request.task._id,
        type: 'request-update'
      };
  
      // Send notification
      NotificationController.createNotification(notificationData, req.io);
  
      res.status(200).json(request);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  // Fetch all requests for a specific user
  exports.getUserRequests = async (req, res) => {
    const userId = req.params.userId;
    try {
      const requests = await Request.find({ user: userId }).populate('task');
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

