// Project model definition.
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  owner: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
  // Include any other project-specific information here
  tasks: [{ type: ObjectId, ref: 'Task' }],
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
