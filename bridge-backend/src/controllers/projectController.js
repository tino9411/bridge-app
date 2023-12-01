//projectController.js
const mongoose = require('mongoose');
const Project = require('../models/project');
const Task = require('../models/task'); // Assuming you have a Task model
const Phase = require('../models/phase'); // Assuming you have a Phase model


// Create a new project
exports.createProject = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const projectData = {
      ...req.body,
      projectManager: req.user._id // Set the project manager to the current user
    };

    const project = new Project(projectData);
    await project.save({ session });
    
    await session.commitTransaction();
    console.log(`Project created. ID: ${project._id}, Name: ${project.name}`);
    res.status(201).json(project);
  } catch (error) {
    await session.abortTransaction();
    if (!res.headersSent) {
      res.status(400).json({ error: error.message });
    }
  } finally {
    session.endSession();
  }
};
// Get all projects for the logged-in user with task count
// Get all projects for the logged-in user with task count and team member count
exports.getAllProjects = async (req, res) => {
  try {
      const projectsWithTaskCount = await Project.aggregate([
          { $match: { projectManager: req.user._id } }, // Match projects by manager
          {
              $lookup: {
                  from: 'tasks',
                  localField: '_id',
                  foreignField: 'project',
                  as: 'tasks'
              }
          },
          {
              $lookup: {
                  from: 'users', // Assumes your User collection is named 'users'
                  localField: 'team', // Field in Project that contains team member IDs
                  foreignField: '_id', // Field in User that matches team member IDs
                  as: 'teamMembers'
              }
          },
          {
              $addFields: {
                  taskCount: { $size: '$tasks' },
                  teamMemberCount: { $size: '$teamMembers' }
              }
          },
          {
              $project: {
                  tasks: 0, // Exclude the tasks array from the output
                  teamMembers: 0 // Exclude the teamMembers array from the output
              }
          }
      ]);
      res.status(200).json(projectsWithTaskCount);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

// Get a specific project by ID
// ... [Other imports and code]

// Get a specific project by ID with task assignee details
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, projectManager: req.user._id })
      .populate({
        path: 'tasks',
        populate: {
          path: 'assignee',
          select: 'name' // Only include the name of the assignee for privacy
        }
      });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Aggregate unique team member count
    const teamMembers = new Set();
    project.tasks.forEach(task => {
      if (task.assignee) {
        teamMembers.add(task.assignee._id.toString());
      }
    });

    const projectData = {
      ...project.toObject(),
      teamMemberCount: teamMembers.size
    };

    res.status(200).json(projectData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update a specific project along with all its details
exports.updateProject = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const updateData = req.body;

    // Find the project and update it
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, projectManager: req.user._id },
      updateData,
      { new: true, runValidators: true, session } // Pass the session to the query options
    );

    if (!project) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: 'Project not found' });
    }

    await session.commitTransaction();
    session.endSession();
    res.status(200).json(project);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ error: error.message });
  }
};


exports.deleteProject = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const project = await Project.findOneAndDelete(
      { _id: req.params.id, projectManager: req.user._id },
      { session }
    );
    if (!project) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: 'Project not found' });
    }
    // Delete associated phases
    await Phase.deleteMany({ project: req.params.id }, { session });
    // Delete associated tasks
    const tasksToDelete = await Task.find({ project: req.params.id });
    await Task.deleteMany({ project: req.params.id }, { session });

    // Unassign tasks from users
    for (let task of tasksToDelete) {
      await User.updateMany(
        { _id: { $in: task.assignees } },
        { $pull: { assignedTasks: task._id } },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();
    res.status(200).json({ message: `Project and all related phases and tasks deleted successfully. ID: ${project._id}` });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: `Failed to delete project: ${error.message}` });
  }
};

// Get all tasks with assignee details for a project
exports.getProjectTasksWithAssignees = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
      const project = await Project.findById(req.params.projectId)
                                   .populate({
                                       path: 'tasks',
                                       populate: {
                                           path: 'assignee',
                                           select: 'name email' // Only include the name and email of the assignee for privacy
                                       }
                                   })
                                   .session(session);

      if (!project) {
          await session.abortTransaction();
          session.endSession();
          return res.status(404).json({ error: 'Project not found' });
      }

      await session.commitTransaction();
      session.endSession();
      res.status(200).json(project.tasks);
  } catch (error) {
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({ error: error.message });
  }
};


exports.getProjectsWithTaskCount = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
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
      ]).session(session);
      
      await session.commitTransaction();
      session.endSession();
      res.json(projectsWithTaskCount);
  } catch (error) {
      await session.abortTransaction();
      session.endSession();
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
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { projectId } = req.params;
    const { userId } = req.body;

    const project = await Project.findById(projectId).session(session);
    if (!project) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.team.includes(userId)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: 'User is already a team member' });
    }

    project.team.push(userId);
    await project.save({ session });

    await session.commitTransaction();
    session.endSession();
    res.status(200).json(project.team);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
};

exports.removeTeamMember = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { projectId, userId } = req.params;

    const project = await Project.findById(projectId).session(session);
    if (!project) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: 'Project not found' });
    }

    if (!project.team.includes(userId)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: 'User is not a team member' });
    }

    project.team.pull(userId);
    await project.save({ session });

    await session.commitTransaction();
    session.endSession();
    res.status(200).json(project.team);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
};

  