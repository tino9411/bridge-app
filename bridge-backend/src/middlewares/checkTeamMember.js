// Middleware to check if the user is a team member of the project related to the task.
const Project = require('../models/project');

module.exports = async (req, res, next) => {
  try {
    // Get the task ID from the request parameters
    const taskId = req.params.taskId;

    // Find the project related to the task
    const project = await Project.findOne({ tasks: taskId }).populate('team');

    // Check if the user is in the project team
    const isTeamMember = project.team.some(member => member.equals(req.user._id));

    if (!isTeamMember) {
      return res.status(403).json({ error: 'Access denied. Not a team member.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
