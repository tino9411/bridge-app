// taskController.js
const mongoose = require("mongoose"); // Import mongoose
const Project = require("../models/project");
const Task = require("../models/task");
const User = require("../models/user");
const Phase = require("../models/phase");


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
      dueDate,
      rate,
      files,
    };

    // Add assignee only if it's provided
    if (assignee) {
      taskData.assignee = assignee;
    }

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

    // Update the task if it exists and belongs to the project
    const task = await Task.findOneAndUpdate(
      { _id: taskId, project: projectId },
      taskUpdate,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(task);
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

// Delete a task within a project
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

    // Remove task from the phase if it's assigned
    if (task.phase) {
      await Project.updateOne(
        { _id: projectId, "phases._id": task.phase },
        { $pull: { "phases.$.assignedTasks": taskId } }
      );
    }

    //Remove task from the project
    await Project.deleteOne({ _id: projectId, tasks: taskId });


    // Delete the task
    await Task.findByIdAndDelete(taskId);

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the task" });
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
