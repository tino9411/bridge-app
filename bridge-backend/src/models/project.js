//project.js

/**
 * @typedef {Object} ProjectSchema
 * @property {string} name - The name of the project.
 * @property {string} description - The description of the project.
 * @property {Schema.Types.ObjectId} projectManager - The ID of the project manager.
 * @property {string} priority - The priority of the project. Can be one of: 'New', 'Low', 'Medium', 'High'.
 * @property {Date} startDate - The start date of the project.
 * @property {Date} endDate - The end date of the project.
 * @property {string} status - The status of the project. Can be one of: 'Not Started', 'In Progress', 'Completed', 'On Hold'.
 * @property {number} budget - The budget of the project.
 * @property {Schema.Types.ObjectId[]} tasks - The IDs of the tasks associated with the project.
 * @property {PhaseSchema[]} phases - The phases of the project.
 * @property {Schema.Types.ObjectId[]} resources - The IDs of the resources associated with the project.
 * @property {Risk[]} risks - The risks associated with the project.
 * @property {BudgetDetails} budgetDetails - The budget details of the project.
 * @property {string[]} tags - The tags associated with the project.
 * @property {string} client - The client of the project.
 * @property {string} clientEmail - The email of the client.
 * @property {string} clientPhoneNumber - The phone number of the client.
 * @property {Date} createdAt - The creation date of the project.
 * @property {Date} updatedAt - The last update date of the project.
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const projectSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  projectManager: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  priority: {
    type: String,
    enum: ['new', 'low', 'medium', 'high'],
    default: 'new'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['planning', 'in progress', 'completed', 'on hold'],
    default: 'planning'
  },
  budget: {
    type: Number,
    default: 0
  },

  tasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task'
  }],
  phases: [{ // Adjusted to reference the Phase model
    type: Schema.Types.ObjectId,
    ref: 'Phase'
  }],
  team: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  risks: [{
    description: String,
    likelihood: Number, // e.g., 0-100%
    impact: String, // e.g., Low, Medium, High
    mitigationPlan: String
  }],
  budgetDetails: {
    estimatedBudget: Number,
    currentSpend: Number,
    forecastCompletionBudget: Number
  },
  tags: [{
    type: String,
    trim: true
  }],
  client: {
    type: String,
    trim: true
  },
  clientEmail: {
    type: String,
    trim: true
  },
  clientPhoneNumber: {
    type: String,
    trim: true
  },
  
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
