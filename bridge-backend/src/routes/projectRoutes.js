// projectRoutes.js
const express = require('express');
const {
    createProject,
    getAllProjects,
    getProject,
    updateProject,
    deleteProject,
    getProjectTasksWithAssignees,
    getProjectsWithTaskCount,
    getProjectTeamMembers,
    addTeamMember,
    removeTeamMember,
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
router.patch('/:id', authMiddleware, checkProjectManagerRole, updateProject);

// Route to delete a specific project
router.delete('/:id', authMiddleware, checkProjectManagerRole, deleteProject);

// Route to get tasks with assignees for a specific project
router.get('/:projectId/tasks-with-assignees', authMiddleware, getProjectTasksWithAssignees);

// Route to get all projects with task count
router.get('/projects-with-task-count', authMiddleware, getProjectsWithTaskCount);

//Route to get team members of a project
router.get('/:projectId/team', authMiddleware, checkProjectManagerRole, getProjectTeamMembers);
//Route to add team members of a project
router.post('/:projectId/team', authMiddleware, checkProjectManagerRole, addTeamMember);
//Route to delete team members of a project
router.delete('/:projectId/team', authMiddleware, checkProjectManagerRole, removeTeamMember);

module.exports = router;
