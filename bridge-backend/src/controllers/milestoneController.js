const Milestone = require("../models/milestone");
const Phase = require("../models/phase"); // Import the Phase model

// Create a new milestone
exports.createMilestone = async (req, res) => {
    try {
      const { title, description, phase, dueDate } = req.body;
  
      const newMilestone = new Milestone({
        title,
        description,
        phase,
        dueDate
      });
  
      await newMilestone.save();
  
      // Add milestone to phase
      await Phase.findByIdAndUpdate(phase, { $push: { milestones: newMilestone._id } });
  
      res.status(201).json({ success: true, milestone: newMilestone });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

// Get all milestones
exports.getAllMilestones = async (req, res) => {
  try {
    const milestones = await Milestone.find();
    res.status(200).json({ success: true, milestones });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a specific milestone by ID
exports.getMilestone = async (req, res) => {
  try {
    const milestoneId = req.params.id;
    const milestone = await Milestone.findById(milestoneId);

    if (!milestone) {
      return res.status(404).json({ success: false, error: "Milestone not found" });
    }

    res.status(200).json({ success: true, milestone });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a milestone
exports.updateMilestone = async (req, res) => {
  try {
    const milestoneId = req.params.id;
    const updates = req.body;

    const updatedMilestone = await Milestone.findByIdAndUpdate(milestoneId, updates, { new: true });

    if (!updatedMilestone) {
      return res.status(404).json({ success: false, error: "Milestone not found" });
    }

    res.status(200).json({ success: true, milestone: updatedMilestone });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a milestone
exports.deleteMilestone = async (req, res) => {
  try {
    const milestoneId = req.params.id;

    const milestone = await Milestone.findByIdAndDelete(milestoneId);

    if (!milestone) {
      return res.status(404).json({ success: false, error: "Milestone not found" });
    }

    res.status(200).json({ success: true, message: "Milestone successfully deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update the progress of a milestone
exports.updateMilestoneProgress = async (req, res) => {
  try {
    const { milestoneId, progress } = req.body;

    const milestone = await Milestone.findById(milestoneId);

    if (!milestone) {
      return res.status(404).json({ success: false, error: "Milestone not found" });
    }

    milestone.progress = progress;

    // Optionally set to completed if progress reaches 100%
    if (progress >= 100) {
      milestone.completed = true;
    }

    await milestone.save();

    res.status(200).json({ success: true, milestone });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
