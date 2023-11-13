const express = require('express');
const { createProject, getAllProjects, getProject, updateProject, deleteProject } = require('../controllers/projectController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.post('/', authMiddleware, createProject);
router.get('/', authMiddleware, getAllProjects);
router.get('/:id', authMiddleware, getProject);
router.put('/:id', authMiddleware, updateProject);
router.delete('/:id', authMiddleware, deleteProject);

module.exports = router;
