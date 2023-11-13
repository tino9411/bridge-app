const Project = require('../models/project');
const Task = require('../models/task'); // Assuming you have a Task model

// Create a new project
exports.createProject = async (req, res) => {
    try {
        const project = new Project({
            ...req.body,
            owner: req.user._id  // req.user is set by the auth middleware
        });
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all projects for the logged-in user
exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find({ owner: req.user._id });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a specific project by ID
exports.getProject = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
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
            { _id: req.params.id, owner: req.user._id }, 
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

// Delete a specific project
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        // Optionally, delete all tasks associated with the project
        await Task.deleteMany({ project: req.params.id });

        res.status(200).json({ message: 'Project deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// You may also need to implement other functions like adding a task to a project etc.
