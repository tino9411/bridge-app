// Task model definition.
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const taskSchema = new mongoose.Schema({
  project: {
    type: ObjectId,
    ref: 'Project',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['open', 'in progress', 'completed'],
    default: 'open',
  },
  // You can add deadline, assignee, priority, etc.
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
