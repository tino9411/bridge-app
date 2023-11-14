const Project = require('../models/project'); // Ensure the path is correct

// Middleware to check if the user is the project manager of the specific project
module.exports = async (req, res, next) => {
  try {
    const projectId = req.params.id || req.params.projectId; // Adjust based on your route parameter name
    console.log(`Checking project manager role for project ID: ${projectId}`);
    const project = await Project.findById(projectId);

    if (!project) {
      console.log(`Project with ID ${projectId} not found`);
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if the current user is the project manager
    if (!project.projectManager.equals(req.user._id)) {
      console.log(`User ${req.user._id} is not the project manager for project ${projectId}`);
      return res.status(403).json({ error: 'You are not authorized to perform this action on this project' });
    }

    // If the user is the project manager, proceed with the next middleware/route handler
    console.log(`User ${req.user._id} is the project manager for project ${projectId}`);
    next();
  } catch (error) {
    console.error(`Error in checkProjectManagerRole middleware: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
