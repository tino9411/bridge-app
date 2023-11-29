//projectController.js
const Project = require('../models/project');
const Task = require('../models/task'); // Assuming you have a Task model
const Phase = require('../models/phase'); // Assuming you have a Phase model


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
// Get all projects for the logged-in user with task count
exports.getAllProjects = async (req, res) => {
  try {
      const projectsWithTaskCount = await Project.aggregate([
          { $match: { projectManager: req.user._id } }, // Match projects by manager
          {
              $lookup: {
                  from: 'tasks', // Assumes your Task collection is named 'tasks'
                  localField: '_id',
                  foreignField: 'project',
                  as: 'tasks'
              }
          },
          {
              $addFields: {
                  taskCount: { $size: '$tasks' }
              }
          },
          {
              $project: {
                  tasks: 0 // Optionally, you can exclude the tasks array from the output
              }
          }
      ]);
      res.status(200).json(projectsWithTaskCount);
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

// Update a specific project along with all its details
exports.updateProject = async (req, res) => {
  try {
      const updateData = req.body;

      // Find the project and update it
      const project = await Project.findOneAndUpdate(
          { _id: req.params.id, projectManager: req.user._id },
          updateData,
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
    await Task.deleteMany({ project: req.params.id });
    // Optionally, handle deletion of associated Phases here or in a separate function
    await Phase.deleteMany({ project: req.params.id });
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

exports.getProjectsWithTaskCount = async (req, res) => {
  try {
      const projectsWithTaskCount = await Project.aggregate([
          {
              $lookup: {
                  from: Task.collection.name, // Join with the Task collection
                  localField: '_id', // Field from the Project collection
                  foreignField: 'project', // Field from the Task collection
                  as: 'tasks' // Alias for the resulting array of tasks
              }
          },
          {
              $addFields: {
                  taskCount: { $size: '$tasks' } // Count the tasks
              }
          },
          {
              $project: {
                  // Define which fields to include in the result
                  name: 1,
                  description: 1,
                  startDate: 1,
                  endDate: 1,
                  status: 1,
                  budget: 1,
                  taskCount: 1
                  // Add other project fields as needed
              }
          }
      ]);
      res.json(projectsWithTaskCount);
  } catch (error) {
      res.status(500).send(error);
  }
};  
exports.getProjectTeamMembers = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId).populate('team');
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json(project.team); // Use 'team' instead of 'teamMembers'
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addTeamMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.team.includes(userId)) {
      return res.status(400).json({ error: 'User is already a team member' });
    }

    project.team.push(userId);
    await project.save();

    res.status(200).json(project.team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeTeamMember = async (req, res) => {
  try {
    const { projectId, userId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (!project.team.includes(userId)) {
      return res.status(400).json({ error: 'User is not a team member' });
    }

    project.team.pull(userId);
    await project.save();

    res.status(200).json(project.team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

  