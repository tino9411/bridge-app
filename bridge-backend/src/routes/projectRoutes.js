// projectRoutes.js
const express = require('express');
const {
    createProject,
    getAllProjects,
    getProject,
    updateProject,
    deleteProject,
    updateProjectDetails,
    getProjectTasksWithAssignees,
    getProjectsWithTaskCount,
    getProjectTeamMembers,
  } = require('../controllers/projectController');


const authMiddleware = require('../middlewares/auth');
const checkProjectManagerRole = require('../middlewares/checkProjectManagerRole'); // Ensure you have this middleware to check for the project manager role

const router = express.Router();

// Route to create a project
router.post('/', authMiddleware, createProject);

// Route to get all projects for the logged-in user
router.get('/', authMiddleware, getAllProjects);

// Route to get a specific project by ID
router.get('/:id', authMiddleware, getProject);

// Route to update a specific project
router.put('/:id', authMiddleware, checkProjectManagerRole, updateProject);

// Route to delete a specific project
router.delete('/:id', authMiddleware, checkProjectManagerRole, deleteProject);

// Route to get tasks with assignees for a specific project
router.get('/:projectId/tasks-with-assignees', authMiddleware, getProjectTasksWithAssignees);

// Route to get all projects with task count
router.get('/projects-with-task-count', authMiddleware, getProjectsWithTaskCount);

// Route for updating project details like start date, end date, and budget details
router.patch('/:projectId/details', authMiddleware, checkProjectManagerRole, updateProjectDetails);

//Route to get team members of a project
router.get('/:projectId/team', authMiddleware, checkProjectManagerRole, getProjectTeamMembers);

module.exports = router;
