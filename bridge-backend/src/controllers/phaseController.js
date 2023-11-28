const Phase = require("../models/phase");
const Task = require("../models/task");
const Project = require("../models/project");

exports.getPhases = async (req, res) => {
  try {
    const { projectId } = req.params;
    const phases = await Phase.find({ project: projectId });
    res.status(200).json({ success: true, phases });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getPhase = async (req, res) => {
  try {
    const phaseId = req.params.phaseId;
    const phase = await Phase.findById(phaseId);

    if (!phase) {
      return res.status(404).json({ success: false, error: "Phase not found" });
    }

    res.status(200).json({ success: true, phase });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.addPhase = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, startDate, endDate, status } = req.body;

    const newPhase = new Phase({
      name,
      project: projectId,
      startDate,
      endDate,
      status,
      assignedTasks: [],
      milestones: [],
    });

    await newPhase.save();
    // Optionally, update the project to include this new phase
    await Project.findByIdAndUpdate(projectId, {
      $push: { phases: newPhase._id },
    });

    res.status(201).json({ success: true, phase: newPhase });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Example of updating a phase
exports.updatePhase = async (req, res) => {
  try {
    const { phaseId } = req.params;
    const updates = req.body;

    const updatedPhase = await Phase.findByIdAndUpdate(phaseId, updates, {
      new: true,
    });

    if (!updatedPhase) {
      return res.status(404).json({ success: false, error: "Phase not found" });
    }

    res.status(200).json({ success: true, phase: updatedPhase });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deletePhase = async (req, res) => {
  try {
    const { phaseId } = req.params;
    const deleteTasks = req.query.deleteTasks === "true"; // Check if the deleteTasks query parameter is set to 'true'

    const deletedPhase = await Phase.findByIdAndDelete(phaseId);
    if (!deletedPhase) {
      return res.status(404).json({ success: false, error: "Phase not found" });
    }

    // Remove the phase from the project
    await Project.findByIdAndUpdate(deletedPhase.project, {
      $pull: { phases: phaseId },
    });

    // Delete all milestones in the phase if there are any
    if (deletedPhase.milestones.length > 0) {
      await Milestone.deleteMany({ _id: { $in: deletedPhase.milestones } });
    }

    if (deleteTasks) {
      // Update tasks to remove phase reference
      await Task.updateMany(
        { _id: { $in: deletedPhase.assignedTasks } },
        { $unset: { phase: "" } }
      );

      // Delete the tasks
      await Task.deleteMany({ _id: { $in: deletedPhase.assignedTasks } });
    }

    res
      .status(200)
      .json({ success: true, message: "Phase deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Assign a task to a phase
exports.assignTaskToPhase = async (req, res) => {
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
      await phase.save();
    }

    res.status(200).json({ success: true, phase, task });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Remove a task from a phase
exports.removeTaskFromPhase = async (req, res) => {
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
    phase.assignedTasks = phase.assignedTasks.filter(
      (id) => id.toString() !== taskId
    );
    await phase.save();

    // Update the task to remove the phase reference
    await Task.findByIdAndUpdate(taskId, { $unset: { phase: "" } });

    res.status(200).json({ success: true, phase });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
