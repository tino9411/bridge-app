// taskController.js
const mongoose = require("mongoose"); // Import mongoose
const Project = require("../models/project");
const Task = require("../models/task");
const User = require("../models/user");
const Phase = require("../models/phase");
const TaskComment = require("../models/taskComment");
const Request = require("../models/request");
const NotificationController = require('./notificationController'); // Adjust the path as necessary



// Search for tasks based on filters
exports.searchTasks = async (req, res) => {
    try {
      const { keywords, categories, skills, rate, location, timeCommitment } = req.query;
      let query = {};
  
      if (keywords) {
        query.$text = { $search: keywords };
      }
      if (categories) {
        query.categories = { $in: categories.split(',') };
      }
      if (skills) {
        query.skillsNeeded = { $in: skills.split(',') };
      }
      if (rate) {
        let [minRate, maxRate] = rate.split('-').map(Number);
        query.rate = { $gte: minRate, $lte: maxRate };
      }
      if (location) {
        query.location = location;
      }
      if (timeCommitment) {
        query.timeCommitment = timeCommitment;
      }
  
      const tasks = await Task.find(query).populate('project', 'name');
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
 
// Request to join a task
exports.requestToJoinTask = async (req, res) => {
  const { taskId } = req.params;
  const { userId, message } = req.body; // userId here is the sender of the request

  try {
      // Fetch task and project details
      const task = await Task.findById(taskId).populate('project');
      if (!task) {
          return res.status(404).json({ error: "Task not found" });
      }

      // Fetch user details
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      // Add request to join
      task.requestToJoin.push({ userId, message });
      await task.save();

      // Notify project manager
      const projectManagerId = task.project.projectManager;
      const userName = `${user.firstName} ${user.lastName}`; // Construct user's full name
      const taskTitle = task.title; // Assuming the task model has a title field
      const notificationData = {
          user: userId, // Sender of the request
          recipient: projectManagerId, // Recipient of the notification
          message: `${userName} requested to join task '${taskTitle}'`,
          relatedTo: taskId,
          link: `projects/tasks/${taskId}`,
          type: 'task'
      };

      // Use the modified createNotification function
      await NotificationController.createNotification(notificationData, req.io);

      res.status(200).json({ message: "Request to join task sent" });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};

// Function to approve or deny a task join request
exports.respondToJoinRequest = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { taskId, requestId } = req.params;
    const { decision } = req.body; // 'approve' or 'deny'

    const task = await Task.findById(taskId).session(session);
    if (!task) {
      throw new Error("Task not found");
    }

    const joinRequest = await Request.findById(requestId);
    if (!joinRequest) {
      throw new Error("Request not found");
    }

    joinRequest.status = decision;
    await joinRequest.save({ session });

    if (decision === 'approved') {
      // Assign the user to the task if approved
      task.assignee = joinRequest.user;
      await task.save({ session });
    }

    // Create a notification for the user who made the join request
    const notificationData = {
      recipient: joinRequest.user,
      message: `Your request to join the task ${task.title} has been ${decision}`,
      relatedTo: taskId,
      link: `projects/tasks/${taskId}`,
      type: 'task'
    };

    // Use the NotificationController to create the notification
    await NotificationController.createNotification({ body: notificationData }, res);

    await session.commitTransaction();
    res.status(200).json({ message: `Request ${decision}` });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

// View detailed task information
exports.getTaskDetails = async (req, res) => {
    const { taskId } = req.params;
  
    try {
      const task = await Task.findById(taskId)
        .populate('assignee')
        .populate('project', 'name')
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
  
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
// Leave feedback for assignee for a completed task
exports.leaveFeedback = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
      const { taskId } = req.params;
      const { userId, rating, comment } = req.body;
  
      const task = await Task.findById(taskId).session(session);
      if (!task) {
          throw new Error("Task not found");
      }

      // Add feedback to the task
      task.feedbacks.push({ userId, rating, comment });

      await task.save({ session });

      // Send a notification to the task assignee (if different from the feedback giver)
      if (task.assignee && task.assignee.toString() !== userId) {
          const notificationData = {
              recipient: task.assignee,
              message: `New feedback received for task ${taskId}`,
              relatedTo: taskId,
              link: `projects/tasks/${taskId}`, // Assuming this is the link to the task
              type: 'task'
          };

          // Use the NotificationController to create the notification
          await NotificationController.createNotification({ body: notificationData }, res);
      }

      // If all operations are successful, commit the transaction
      await session.commitTransaction();
      res.status(200).json({ message: "Feedback submitted successfully" });
  } catch (error) {
      // If any operation fails, abort the transaction
      await session.abortTransaction();
      res.status(500).json({ error: error.message });
  } finally {
      // End the session
      session.endSession();
  }
};

// Add a new task to a project
exports.addTask = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    console.log("Received task data:", req.body);
    const { projectId } = req.params;
    const { title, description, status, priority, phase, skillsNeeded, assignee, dueDate, rate, files, tags } = req.body;

    // Create a task object with only the provided fields
    const taskData = {
      project: projectId,
      title,
      description,
      status,
      priority,
      phase,
      skillsNeeded,
      assignee: assignee || null,
      dueDate,
      rate,
      files,
      tags,
      history: [{
        date: new Date(),
        action: "Task Created",
        description: `Task '${title}' was created.`,
      }]
    };

    const task = new Task(taskData);
    await task.save({ session });

    // Add the task to the project's task list
    const project = await Project.findByIdAndUpdate(projectId, { $push: { tasks: task._id } }, { session, new: true }).populate('team');

    // Notify each team member about the new task
    if (project && project.team) {
      for (const member of project.team) {
        if (member._id.toString() !== (assignee || '')) { // Do not notify the assignee
          const notificationData = {
            recipient: member._id,
            message: `New task '${title}' added to project ${project.name}`,
            relatedTo: task._id,
            link: `/tasks/${task._id}`, // Assuming this is the link to the task
            type: 'task'
          };

          // Use the NotificationController to create the notification
          await NotificationController.createNotification({ body: notificationData }, res);
        }
      }
    }

    // Commit the transaction
    await session.commitTransaction();
    res.status(201).json(task);
  } catch (error) {
    // Abort the transaction on error
    await session.abortTransaction();
    res.status(400).json({ error: error.message });
  } finally {
    // End the session
    session.endSession();
  }
};

// Get all tasks for a project
exports.getTasks = async (req, res) => {
    try {
      const { projectId } = req.params;
      const tasks = await Task.find({ project: projectId })
        .populate("project", "name")
        .populate("assignee", [
          "username",
          "firstName",
          "lastName",
          "email",
          "phoneNumber",
        ])
        .populate("phase"); // Corrected population of phase
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Update a task within a project
exports.updateTask = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { taskId, projectId } = req.params;
    const taskUpdate = req.body;
    const oldTask = await Task.findById(taskId).session(session);

    if (!oldTask) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Task not found" });
    }

    // Logic to capture changes between oldTask and taskUpdate
    const changes = [];
    Object.keys(taskUpdate).forEach(key => {
      if (JSON.stringify(taskUpdate[key]) !== JSON.stringify(oldTask[key])) {
        changes.push({ field: key, oldValue: oldTask[key], newValue: taskUpdate[key] });
      }
    });

    if (changes.length === 0) {
      await session.abortTransaction();
      return res.status(200).json({ message: "No changes made to the task" });
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, project: projectId },
      taskUpdate,
      { new: true, runValidators: true, session }
    );

    if (!updatedTask) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Task not found" });
    }

    // Add a history log to the task
    const historyLog = {
      date: new Date(),
      action: "Task Updated",
      details: changes
    };

    updatedTask.history.push(historyLog);
    await updatedTask.save({ session });

    // Notify the assignee about the update, if there's an assignee and the assignee is changed
    if (updatedTask.assignee && changes.some(change => change.field === 'assignee' || change.field === 'status' || change.field === 'priority')) {
      const notificationData = {
        recipient: updatedTask.assignee,
        message: `Task '${updatedTask.title}' has been updated`,
        relatedTo: updatedTask._id,
        link: `/tasks/${updatedTask._id}`, // Assuming this is the link to the task
        type: 'task'
      };

      // Use the NotificationController to create the notification
      await NotificationController.createNotification({ body: notificationData }, res);
    }

    // Commit the transaction
    await session.commitTransaction();
    res.status(200).json(updatedTask);
  } catch (error) {
    // Abort the transaction on error
    await session.abortTransaction();
    res.status(400).json({ error: error.message });
  } finally {
    // End the session
    session.endSession();
  }
};

// Complete a task within a project
exports.completeTask = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { taskId } = req.params;

    const task = await Task.findByIdAndUpdate(
      taskId,
      { status: "completed" },
      { new: true, session }
    );

    if (!task) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Task not found" });
    }

    const openTasks = await Task.countDocuments({
      project: task.project,
      assignee: task.assignee,
      status: { $ne: "completed" }
    });

    if (openTasks === 0) {
      await Project.findByIdAndUpdate(
        task.project,
        { $pull: { team: task.assignee } },
        { new: true, session }
      );
    }

    // Notify the project manager and team members
    const notificationData = {
      recipient: task.project.projectManager, // Assuming projectManager ID is available
      message: `Task '${task.title}' has been completed`,
      relatedTo: task._id,
      link: `/tasks/${task._id}`, // Link to the task
      type: 'task'
    };
    await NotificationController.createNotification({ body: notificationData }, res);

    await session.commitTransaction();
    res.status(200).json(task);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

// Delete (archive) a task within a project
exports.deleteTask = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { taskId, projectId } = req.params;

    const task = await Task.findById(taskId).session(session);
    if (!task) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Task not found" });
    }

    if (task.assignee) {
      await session.abortTransaction();
      return res.status(409).json({ message: "Task is currently assigned and cannot be deleted" });
    }

    task.isArchived = true;
    const historyLog = {
      date: new Date(),
      action: "Task Archived",
      description: `Task '${task.title}' was archived.`
    };
    task.history.push(historyLog);
    await task.save({ session });

    if (task.phase) {
      await Project.updateOne(
        { _id: projectId, "phases._id": task.phase },
        { $pull: { "phases.$.assignedTasks": taskId } },
        { session }
      );
    }

    // Fetch the team members from the project
    const project = await Project.findById(projectId).session(session);
    if (project) {
      const notificationData = {
        team: project.team, // Assuming team contains array of user IDs
        message: `Task '${task.title}' has been archived`,
        relatedTo: task._id,
        link: `projects/tasks/${task._id}`, // Link to the task
        type: 'task'
      };
      await NotificationController.createNotification({ body: notificationData }, res);
    }

    await session.commitTransaction();
    res.status(200).json({ message: "Task archived successfully" });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error archiving task:", error);
    res.status(500).json({ message: "An error occurred while archiving the task" });
  } finally {
    session.endSession();
  }
};

// Assign a task to a user
exports.assignTask = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { taskId } = req.params;
    const { userId } = req.body;

    let task = await Task.findById(taskId).session(session);
    if (!task) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Task not found" });
    }

    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ error: "User not found" });
    }

    task.assignee = userId;
    await task.save({ session });

    if (!user.assignedTasks.includes(taskId)) {
      user.assignedTasks.push(taskId);
      await user.save({ session });
    }

    const project = await Project.findById(task.project).session(session);
    if (project) {
      const isUserAlreadyInTeam = project.team.some((teamMember) => teamMember.equals(userId));
      if (!isUserAlreadyInTeam) {
        project.team.push(userId);
        await project.save({ session });
      }
    }

    // Send notification to the assigned user
    const notificationData = {
      recipient: userId, // ID of the user being assigned
      message: `You have been assigned to task '${task.title}'`,
      relatedTo: task._id,
      link: `projects/tasks/${task._id}`, // Adjust the link as per your application's URL structure
      type: 'task'
    };
    await NotificationController.createNotification({ body: notificationData }, res);

    await session.commitTransaction();
    task = await task.populate("assignee");
    res.status(200).json(task);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

// Unassign a task from a user
exports.unassignTask = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { taskId } = req.params;
    
    let task = await Task.findById(taskId).session(session);
    if (!task) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Task not found" });
    }

    if (!task.assignee) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Task is not assigned to any user" });
    }

    const userId = task.assignee;
    task.assignee = null;
    await task.save({ session });

    const user = await User.findById(userId).session(session);
    if (user) {
      user.assignedTasks = user.assignedTasks.filter(id => !id.equals(taskId));
      await user.save({ session });
    }

    // Send notification to the user being unassigned
    const notificationData = {
      recipient: userId,
      message: `You have been unassigned from task '${task.title}'`,
      relatedTo: task._id,
      link: `projects/tasks/${task._id}`, // Adjust the link as per your application's URL structure
      type: 'task'
    };
    await NotificationController.createNotification({ body: notificationData }, res);

    await session.commitTransaction();
    res.status(200).json({ message: "User unassigned from task successfully" });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ error: error.message });
  } finally {
    session.endSession();
  }
};



   