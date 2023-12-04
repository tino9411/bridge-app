// taskController.js
const mongoose = require("mongoose"); // Import mongoose
const Project = require("../models/project");
const Task = require("../models/task");
const User = require("../models/user");
const Phase = require("../models/phase");
const Notification = require("../models/notification");


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
    const { userId, message } = req.body;
  
    try {
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
  
      // Add request to join
      task.requestToJoin.push({ userId, message });
      await task.save();
  
      // Notify project manager
      const projectManagerId = task.project.projectManager;
      const notification = new Notification({
        recipient: projectManagerId,
        message: `User ${userId} requested to join task ${taskId}`,
        relatedTo: taskId,
      });
      await notification.save();
  
      res.status(200).json({ message: "Request to join task sent" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

// Function to approve or deny a task join request
exports.respondToJoinRequest = async (req, res) => {
    const { taskId, requestId } = req.params;
  const { decision } = req.body; // 'approve' or 'deny'

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const requestIndex = task.requestToJoin.findIndex(request => request._id.toString() === requestId);
    if (requestIndex === -1) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (decision === 'approve') {
      task.requestToJoin[requestIndex].status = 'approved';
      // Additional logic to handle approved request
    } else {
      task.requestToJoin[requestIndex].status = 'denied';
    }

    await task.save();
    res.status(200).json({ message: `Request ${decision}` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// View detailed task information
exports.getTaskDetails = async (req, res) => {
    const { taskId } = req.params;
  
    try {
      const task = await Task.findById(taskId)
        .populate('assignee')
        .populate('project', 'name')
        .populate('comments');
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
  
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
// Leave feedback for a completed task
exports.leaveFeedback = async (req, res) => {
    try {
      const { taskId } = req.params;
      const { userId, rating, comment } = req.body;
  
      const task = await Task.findById(taskId);
      if (!task) return res.status(404).json({ error: "Task not found" });
  
      task.feedbacks.push({ userId, rating, comment });
      await task.save();
  
      res.status(200).json({ message: "Feedback submitted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Add a new task to a project
exports.addTask = async (req, res) => {
  try {
    console.log("Received task data:", req.body);
    const { projectId } = req.params;
    const {
      title,
      description,
      status,
      priority,
      phase,
      skillsNeeded,
      assignee,
      dueDate,
      rate,
      files,
      checklistItems,
      tags,
      polls
    } = req.body;

    // Create a task object with only the provided fields
    const taskData = {
      project: projectId,
      title,
      description,
      status,
      priority,
      phase,
      skillsNeeded,
      assignee: assignee || null, // Assign 'null' if not provided
      dueDate,
      rate,
      files,
      checklistItems,
      tags,
      polls,
      history: [{ // Create an initial history log for task creation
        date: new Date(),
        action: "Task Created",
        description: `Task '${title}' was created.`,
      }]
    };

    const task = new Task(taskData);
    await task.save();

    // Add the task to the project's task list
    await Project.findByIdAndUpdate(projectId, { $push: { tasks: task._id } });

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
  try {
    const { taskId, projectId } = req.params;
    const taskUpdate = req.body;
    const oldTask = await Task.findById(taskId);

    console.log("Updating task with data:", taskUpdate);

    if (!oldTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Logic to capture changes between oldTask and taskUpdate
    const changes = [];
    Object.keys(taskUpdate).forEach(key => {
      if (taskUpdate[key] !== oldTask[key]) {
        changes.push({ field: key, oldValue: oldTask[key], newValue: taskUpdate[key] });
      }
    });

    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, project: projectId },
      taskUpdate,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Add a history log to the task
    const historyLog = {
      date: new Date(),
      action: "Task Updated",
      details: changes
    };

    updatedTask.history.push(historyLog);
    await updatedTask.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Complete a task within a project
exports.completeTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findByIdAndUpdate(
      taskId,
      { status: "completed" },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Check if the user has other open tasks
    const openTasks = await Task.countDocuments({
      project: task.project,
      assignee: task.assignee,
      status: { $ne: "completed" },
    });

    if (openTasks === 0) {
      // Remove the user from the project team
      await Project.findByIdAndUpdate(
        task.project,
        { $pull: { team: task.assignee } },
        { new: true }
      );
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete (archive) a task within a project
exports.deleteTask = async (req, res) => {
  try {
    const { taskId, projectId } = req.params;

    // Find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Check if the task is assigned to a user
    if (task.assignee) {
      return res
        .status(409)
        .json({ message: "Task is currently assigned and cannot be deleted" });
    }

    // Archive the task instead of deleting
    task.isArchived = true;

    // Add a history log entry for the task archiving
    const historyLog = {
      date: new Date(),
      action: "Task Archived",
      description: `Task '${task.title}' was archived.`
    };
    task.history.push(historyLog);

    await task.save();

    // Remove task from the phase if it's assigned
    if (task.phase) {
      await Project.updateOne(
        { _id: projectId, "phases._id": task.phase },
        { $pull: { "phases.$.assignedTasks": taskId } }
      );
    }

    res.status(200).json({ message: "Task archived successfully" });
  } catch (error) {
    console.error("Error archiving task:", error);
    res
      .status(500)
      .json({ message: "An error occurred while archiving the task" });
  }
};


exports.assignTask = async (req, res) => {
  const { taskId } = req.params;
  const { userId } = req.body;

  try {
    let task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Assign the task to the user
    task.assignee = userId;
    await task.save();

    // Add the task to the user's assigned tasks
    if (!user.assignedTasks.includes(taskId)) {
      user.assignedTasks.push(taskId);
      await user.save();
    }

    task = await task.populate("assignee");

    // Update the project team if necessary
    const project = await Project.findById(task.project);
    if (project) {
      const isUserAlreadyInTeam = project.team.some((teamMember) =>
        teamMember.equals(userId)
      );
      if (!isUserAlreadyInTeam) {
        project.team.push(userId);
        await project.save();
      }
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update Checklist Items
exports.updateChecklistItems = async (req, res) => {
    const { taskId } = req.params;
    const { checklistItems } = req.body;
  
    try {
      const updatedTask = await Task.findByIdAndUpdate(taskId, 
        { $set: { checklistItems } },
        { new: true }
      );
      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Add Poll to a Task
  exports.addPollToTask = async (req, res) => {
    const { taskId } = req.params;
    const { poll } = req.body;
  
    try {
      const updatedTask = await Task.findByIdAndUpdate(taskId, 
        { $push: { polls: poll } },
        { new: true }
      );
      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

 // Add a history log to a task
exports.addHistoryLog = async (req, res) => {
    const { taskId } = req.params;
    const { log } = req.body; // log should be an object with date, action, description
  
    try {
      const updatedTask = await Task.findByIdAndUpdate(taskId, 
        { $push: { history: log } },
        { new: true }
      );
      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
   