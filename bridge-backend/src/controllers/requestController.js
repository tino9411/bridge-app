const Request = require("../models/request");
const Task = require("../models/task");
const Project = require("../models/project");
const NotificationController = require("./notificationController");
const TaskController = require("./taskController"); // Import TaskController

exports.createRequest = async (req, res) => {
  try {
    const newRequest = new Request(req.body);
    await newRequest.save();

    // Populate the task and project details
    const populatedRequest = await Request.findById(newRequest._id)
      .populate("task", "title project status priority") // Only populate title and project fields of the task
      .populate({
        path: "task",
        populate: { path: "project", select: "projectManager" }, // Only populate projectManager field of the project
      });

    // Update the related task by adding this request's ID to its relatedRequests array
    const updatedTask = await Task.findByIdAndUpdate(
      populatedRequest.task._id,
      { $push: { relatedRequests: populatedRequest._id } },
      { new: true }
    );

    // Add history log to the task
    const historyLog = {
      date: new Date(),
      action: "Join Request Received",
      user: populatedRequest.user,
      details: [
        {
          field: "request",
          newValue: `New join request created by user ${populatedRequest.user}`,
        },
      ],
    };
    updatedTask.history.push(historyLog);
    await updatedTask.save();

    // Notification data
    const notificationData = {
      sender: populatedRequest.user, // Sender of the request
      recipient: populatedRequest.task.project.projectManager, // Project manager
      message: `New join request for task: ${populatedRequest.task.title}`,
      relatedTo: populatedRequest.task._id,
      link: `/tasks/${populatedRequest.task._id}`, // Modify as per your app's URL structure
      type: "request",
    };

    // Send notification
    NotificationController.createNotification(notificationData, req.io);

    res.status(201).json(populatedRequest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateRequestStatus = async (req, res) => {
  const { requestId, status } = req.body; // 'approved' or 'rejected'
  try {
    const request = await Request.findById(requestId)
      .populate({
        path: "task",
        select: "title project relatedRequests",
        populate: { path: "project", select: "projectManager" },
      })
      .populate("user", "username");

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (status === "approved") {
      // Call assignTask from TaskController
      await TaskController.assignTask(
        {
          params: { taskId: request.task._id },
          body: { userId: request.user._id },
        },
        res
      );
    }

    // Add history log to the task
    const historyLog = {
      date: new Date(),
      action: "Join Request Status Updated",
      user: request.user,
      details: [
        {
          field: "requestStatus",
          newValue: `Join request ${status} by ${request.user}`,
        },
      ],
    };
    // Remove the request from the task's relatedRequests field
    await Task.findByIdAndUpdate(request.task._id, {
      $pull: { relatedRequests: requestId },
      $push: { history: historyLog },
    });

    // Delete the request
    await Request.findByIdAndDelete(requestId);

    // Notification data
    const notificationData = {
      sender: request.task.project.projectManager,
      recipient: request.user._id,
      message: `Your request to join '${request.task.title}' has been ${status}`,
      relatedTo: request.task._id,
      link: `/tasks/${request.task._id}`,
      type: "requestStatus",
    };

    // Send notification
    NotificationController.createNotification(notificationData, req.io);

    res
      .status(200)
      .json({ message: `Join request updated and deleted successfully.` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserRequests = async (req, res) => {
  const projectManagerId = req.params.userId;
  try {
    // Fetch all projects managed by the user
    const managedProjects = await Project.find({ projectManager: projectManagerId });

    let requests = [];
    for (let project of managedProjects) {
      // Fetch tasks from these projects and populate related requests along with task details
      const tasks = await Task.find({ project: project._id })
        .populate({
          path: "relatedRequests",
          populate: [
            { 
              path: "user", 
              select: "username firstName lastName email skills biography profileImage" // Add more fields as needed
            },
            {
              path: "task",
              select: "title description status priority skillsNeeded" // Populate necessary task details
            }
          ]
        });

      // Extract requests from tasks and include task details
      tasks.forEach(task => {
        task.relatedRequests.forEach(request => {
          requests.push({
            ...request.toJSON(), // Convert Mongoose document to plain object
            task: {
              id: task._id,
              title: task.title,
              description: task.description
            }
          });
        });
      });
    }

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

