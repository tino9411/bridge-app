const Phase = require("../models/phase");
const Task = require("../models/task");
const Project = require("../models/project");
const mongoose = require("mongoose");

// Validation function
const validateDates = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start <= end;
};

// Get all phases for a project with detailed information
exports.getPhases = async (req, res) => {
    try {
      const { projectId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(400).json({ success: false, error: "Invalid project ID" });
      }
  
      // Aggregation pipeline
      const pipeline = [
        { $match: { project: new mongoose.Types.ObjectId(projectId) } },
        {
          $lookup: {
            from: 'tasks',
            localField: 'assignedTasks',
            foreignField: '_id',
            as: 'assignedTasks'
          }
        },
        {
          $lookup: {
            from: 'milestones',
            localField: 'milestones',
            foreignField: '_id',
            as: 'milestones'
          }
        },
        {
          $addFields: {
            taskCount: { $size: "$assignedTasks" },
            completedTasks: { $size: { $filter: { input: "$assignedTasks", as: "task", cond: { $eq: ["$$task.status", "Completed"] } } } },
            milestoneProgress: { $avg: "$milestones.progress" }
          }
        }
      ];
  
      const phases = await Phase.aggregate(pipeline);
      res.status(200).json({ success: true, phases });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
  

// Get a single phase with detailed information
exports.getPhase = async (req, res) => {
    try {
      const phaseId = req.params.phaseId;
      if (!mongoose.Types.ObjectId.isValid(phaseId)) {
        return res.status(400).json({ success: false, error: "Invalid phase ID" });
      }
  
      // Aggregation pipeline
      const pipeline = [
        { $match: { _id: new mongoose.Types.ObjectId(phaseId) } },
        {
          $lookup: {
            from: 'tasks',
            localField: 'assignedTasks',
            foreignField: '_id',
            as: 'assignedTasks'
          }
        },
        {
          $lookup: {
            from: 'milestones',
            localField: 'milestones',
            foreignField: '_id',
            as: 'milestones'
          }
        },
        {
          $addFields: {
            taskCount: { $size: "$assignedTasks" },
            completedTasks: { $size: { $filter: { input: "$assignedTasks", as: "task", cond: { $eq: ["$$task.status", "Completed"] } } } },
            milestoneProgress: { $avg: "$milestones.progress" }
          }
        }
      ];
  
      const [phase] = await Phase.aggregate(pipeline);
      if (!phase) {
        return res.status(404).json({ success: false, error: "Phase not found" });
      }
  
      res.status(200).json({ success: true, phase });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
  

// Add a new phase with validation
exports.addPhase = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { projectId } = req.params;
    const { name, startDate, endDate, status } = req.body;

    if (!validateDates(startDate, endDate)) {
      return res.status(400).json({ success: false, error: "Invalid date range" });
    }

    if (!["planned", "in progress", "completed"].includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid phase status" });
    }

    const projectExists = await Project.findById(projectId);
    if (!projectExists) {
      return res.status(404).json({ success: false, error: "Project not found" });
    }

    const newPhase = new Phase({
      name,
      project: projectId,
      startDate,
      endDate,
      status,
      assignedTasks: [],
      milestones: [],
    });

    await newPhase.save({ session });
    await Project.findByIdAndUpdate(projectId, { $push: { phases: newPhase._id } }, { session });

    await session.commitTransaction();
    res.status(201).json({ success: true, phase: newPhase });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ success: false, error: error.message });
  } finally {
    session.endSession();
  }
};

// Update a phase with validation and transactions
exports.updatePhase = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { phaseId } = req.params;
    const updates = req.body;

    if (updates.startDate && updates.endDate && !validateDates(updates.startDate, updates.endDate)) {
      throw new Error("Invalid date range");
    }

    const updatedPhase = await Phase.findByIdAndUpdate(phaseId, updates, {
      new: true,
      session
    });

    if (!updatedPhase) {
      throw new Error("Phase not found");
    }

    await session.commitTransaction();
    res.status(200).json({ success: true, phase: updatedPhase });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ success: false, error: error.message || error.toString() });
  } finally {
    session.endSession();
  }
};

// Delete a phase with transaction management
exports.deletePhase = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { phaseId } = req.params;
    const deleteTasks = req.query.deleteTasks === "true";

    const deletedPhase = await Phase.findByIdAndDelete(phaseId, { session });
    if (!deletedPhase) {
      throw new Error("Phase not found");
    }

    await Project.findByIdAndUpdate(
      deletedPhase.project,
      { $pull: { phases: phaseId } },
      { session }
    );

    if (deleteTasks) {
      await Task.updateMany(
        { _id: { $in: deletedPhase.assignedTasks } },
        { $unset: { phase: "" } },
        { session }
      );
      await Task.deleteMany(
        { _id: { $in: deletedPhase.assignedTasks } },
        { session }
      );
    }

    if (deletedPhase.milestones.length > 0) {
      await Milestone.deleteMany(
        { _id: { $in: deletedPhase.milestones } },
        { session }
      );
    }

    await session.commitTransaction();
    res.status(200).json({ success: true, message: "Phase deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ success: false, error: error.message });
  } finally {
    session.endSession();
  }
};

// Assign a task to a phase
exports.assignTaskToPhase = async (req, res) => {
    const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { phaseId, taskId } = req.params;

    // Find the phase by its ID
    const phase = await Phase.findById(phaseId);
    if (!phase) {
      return res.status(404).json({ success: false, error: "Phase not found" });
    }

    // Find the task by its ID
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }

    // Check if the task is already assigned to a phase
    if (task.phase) {
      return res
        .status(409)
        .json({ success: false, error: "Task is already assigned to a phase" });
    }

    // Update the task with the phase ID
    task.phase = phaseId;
    await task.save();

    // Check if the task is already assigned to the phase to avoid duplication
    if (!phase.assignedTasks.includes(taskId)) {
        phase.assignedTasks.push(taskId);
        await phase.save({ session });
        task.phase = phaseId;
        await task.save({ session });
      }
  
      await session.commitTransaction();
      res.status(200).json({ success: true, phase, task });
    } catch (error) {
      await session.abortTransaction();
      res.status(500).json({ success: false, error: error.message });
    } finally {
      session.endSession();
    }
  };

// Remove a task from a phase
exports.removeTaskFromPhase = async (req, res) => {
    const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { phaseId, taskId } = req.params; // Assuming you are getting phaseId and taskId from URL params

    // Find the phase by its ID
    const phase = await Phase.findById(phaseId);
    if (!phase) {
      return res.status(404).json({ success: false, error: "Phase not found" });
    }

    // Check if the task is part of the phase
    if (!phase.assignedTasks.includes(taskId)) {
      return res
        .status(404)
        .json({ success: false, error: "Task not found in the phase" });
    }

    // Remove the task from the phase's assignedTasks array
    phase.assignedTasks = phase.assignedTasks.filter((id) => id.toString() !== taskId);
    await phase.save({ session });
    await Task.findByIdAndUpdate(taskId, { $unset: { phase: "" } }, { session });

    await session.commitTransaction();
    res.status(200).json({ success: true, phase });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ success: false, error: error.message });
  } finally {
    session.endSession();
  }
};
