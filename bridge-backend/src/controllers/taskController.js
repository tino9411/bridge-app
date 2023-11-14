// taskController.js
const Project = require('../models/project');
const Task = require('../models/task');
const User = require('../models/user');

// Add a new task to a project
exports.addTask = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { title, description, status, priority, dueDate } = req.body;
        
        // Create a new task with the provided details
        const task = new Task({ title, description, status, priority, dueDate, project: projectId });
        await task.save();

        // Add the task to the project's task list (if needed)
        await Project.findByIdAndUpdate(
            projectId,
            { $push: { tasks: task._id } },
            { new: true, safe: true, upsert: true }
        );

        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all tasks for a project
exports.getTasks = async (req, res) => {
    try {
        const { projectId } = req.params;
        const tasks = await Task.find({ project: projectId });
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
            return res.status(404).json({ error: 'Task not found' });
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

        // Find the task and delete it if it belongs to the project
        const task = await Task.findOneAndDelete({ _id: taskId, project: projectId });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Remove the task from the project's task list
        await Project.findByIdAndUpdate(
            projectId,
            { $pull: { tasks: taskId } },
            { new: true }
        );
        res.status(200).json({ message: 'Task deleted successfully', task: task._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.assignTask = async (req, res) => {
    const { taskId } = req.params; // taskId comes from URL params
    const { userId } = req.body; // userId should be provided in the body
  
    try {
      const task = await Task.findByIdAndUpdate(
        taskId,
        { assignee: userId },
        { new: true, runValidators: true }
      ).populate('assignee'); // Assuming you have an assignee field in your Task model
  
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
  
      // Optionally, you might want to ensure the user exists and can be assigned tasks
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

