/**
 * task.js
 * @typedef {import('mongoose').Schema} Schema
 * @typedef {import('mongoose').Model} Model
 * @typedef {import('mongoose').Document} Document
 * 
 * @typedef {Object} Task
 * @property {import('mongoose').Types.ObjectId} project - The ID of the project the task belongs to.
 * @property {string} title - The title of the task.
 * @property {string} [description] - The description of the task.
 * @property {'open' | 'in progress' | 'on hold' | 'completed'} [status='open'] - The status of the task.
 * @property {'low' | 'medium' | 'high'} [priority='medium'] - The priority of the task.
 * @property {import('mongoose').Types.ObjectId} [phase] - The ID of the phase the task belongs to.
 * @property {string[]} [skillsNeeded] - The skills needed for the task.
 * @property {import('mongoose').Types.ObjectId} [assignee] - The ID of the user assigned to the task.
 * @property {Date} [dueDate] - The due date of the task.
 * @property {number} [rate] - The rate of the task.
 * @property {import('mongoose').Types.ObjectId[]} [files] - The IDs of the files associated with the task.
 * @property {import('mongoose').Types.ObjectId[]} [comments] - The IDs of the comments associated with the task.
 * @property {Date} createdAt - The creation date of the task.
 * @property {Date} updatedAt - The last update date of the task.
 * 
 * @type {Schema<Task, Model<Task, Document>, Task>}
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema({
    project: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Project' // Reference to the Project model
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['open', 'in progress', 'on hold', 'completed'],
        default: 'open'
    },
    priority: {
        type: String,
        enum: ['new','low', 'medium', 'high'],
        default: 'low'
    },
    phase: {
      type: Schema.Types.ObjectId,
      ref: 'Phase', // Reference to a 'Phase' model
      default: null
    },
    skillsNeeded: [{
        type: String,
        trim: true
        }],
    assignee: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    dueDate: {
        type: Date,
        default: null // You can set a default due date, if required
    },
    rate: {
        type: Number,
        default: null
    }, 
    files: [{
        type: Schema.Types.ObjectId,
        ref: 'File' // Reference to the 'File' model
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment' // Reference to the 'Comment' model
    }]

}, { timestamps: true }); // Add createdAt and updatedAt fields

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
