//projectController.js
const Project = require('../models/project');
const Task = require('../models/task'); // Assuming you have a Task model

// Create a new project
exports.createProject = async (req, res) => {
    try {
      const projectData = {
        ...req.body,
        projectManager: req.user._id // Set the project manager to the current user
      };
  
      const project = new Project(projectData);
      await project.save();
  
      res.status(201).json(project);
    } catch (error) {
      // If a response was already sent, this catch block won't try to send another one
      if (!res.headersSent) {
        res.status(400).json({ error: error.message });
      }
    }
  };
  

// Get all projects for the logged-in user
exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find({ projectManager: req.user._id });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a specific project by ID
exports.getProject = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, projectManager: req.user._id });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a specific project
exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findOneAndUpdate(
            { _id: req.params.id, projectManager: req.user._id }, 
            req.body, 
            { new: true, runValidators: true }
        );
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update project dates and budget details
exports.updateProjectDetails = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { startDate, endDate, budgetDetails } = req.body;

        const project = await Project.findByIdAndUpdate(
            projectId,
            { startDate, endDate, budgetDetails },
            { new: true, runValidators: true }
        );

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.status(200).json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Delete a specific project
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({ _id: req.params.id, projectManager: req.user._id });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        // Optionally, delete all tasks associated with the project
        await Task.deleteMany({ project: req.params.id });

        res.status(200).json({ message: 'Project deleted', project: project._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all tasks with assignee details for a project
exports.getProjectTasksWithAssignees = async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await Project.findById(projectId).populate({
            path: 'tasks',
            populate: {
                path: 'assignee',
                select: 'name email' // Only include the name and email of the assignee for privacy
            }
        });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.status(200).json(project.tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Additional function to add a phase to a project
exports.addPhaseToProject = async (req, res) => {
    const { projectId } = req.params;
    const { name, startDate, endDate } = req.body; // Assume these are required for a phase
  
    try {
      const project = await Project.findByIdAndUpdate(
        projectId,
        { $push: { phases: { name, startDate, endDate } } },
        { new: true, runValidators: true }
      );
  
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
  
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  // Function to get a specific phase of a project
  exports.getPhase = async (req, res) => {
    const { projectId, phaseId } = req.params;
  
    try {
      const project = await Project.findById(projectId);
      const phase = project.phases.id(phaseId); // Using Mongoose's id method to find a subdocument
  
      if (!phase) {
        return res.status(404).json({ error: 'Phase not found' });
      }
  
      res.status(200).json(phase);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  // Function to update a specific phase of a project
  exports.updatePhase = async (req, res) => {
    const { projectId, phaseId } = req.params;
    const phaseUpdate = req.body;
  
    try {
      const project = await Project.findOneAndUpdate(
        { "_id": projectId, "phases._id": phaseId },
        { $set: { "phases.$": phaseUpdate } },
        { new: true, runValidators: true }
      );
  
      if (!project) {
        return res.status(404).json({ error: 'Phase not found' });
      }
  
      res.status(200).json(project);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  // Function to delete a specific phase of a project
  exports.deletePhase = async (req, res) => {
    const { projectId, phaseId } = req.params;
  
    try {
      const project = await Project.findByIdAndUpdate(
        projectId,
        { $pull: { phases: { _id: phaseId } } },
        { new: true }
      );
  
      if (!project) {
        return res.status(404).json({ error: 'Phase not found' });
      }
  
      res.status(200).json({ message: 'Phase deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };


// Add a new milestone to a specific phase of a project
exports.addMilestoneToProject = async (req, res) => {
    try {
        const { projectId, phaseId } = req.params; // Assume you now pass phaseId in the request
        const { title, dueDate } = req.body;

        // Find the project and the specific phase to add the milestone to
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Find the specific phase in the project
        const phase = project.phases.id(phaseId);
        if (!phase) {
            return res.status(404).json({ error: 'Phase not found' });
        }

        // Add the new milestone to the phase's milestones array
        phase.milestones.push({ title, dueDate });

        // Save the updated project
        await project.save();

        res.status(201).json(phase.milestones);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Update a milestone within a project
exports.updateMilestone = async (req, res) => {
    try {
        const { projectId, phaseId, milestoneId } = req.params;
        const { title, dueDate, completed } = req.body;

        // Find the project and the specific phase
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Find the specific phase within the project
        const phase = project.phases.id(phaseId);
        if (!phase) {
            return res.status(404).json({ error: 'Phase not found' });
        }

        // Find the specific milestone within the phase
        const milestone = phase.milestones.id(milestoneId);
        if (!milestone) {
            return res.status(404).json({ error: 'Milestone not found' });
        }

        // Update the milestone properties
        milestone.title = title;
        milestone.dueDate = dueDate;
        milestone.completed = completed;

        // Save the changes to the project
        await project.save();

        res.status(200).json(milestone);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Delete a milestone from a project
exports.deleteMilestone = async (req, res) => {
    try {
        const { projectId, phaseId, milestoneId } = req.params;

        // Update the project, pulling the milestone from the phase's milestones array
        const project = await Project.findOneAndUpdate(
            { "_id": projectId, "phases._id": phaseId },
            { $pull: { "phases.$.milestones": { _id: milestoneId } } },
            { new: true }
        );

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.status(200).json({ message: 'Milestone deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};




  
  
  