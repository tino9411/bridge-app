//project.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const milestoneSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
}); // Prevents creation of separate _id for milestones

const phaseSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
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
    enum: ['Not Started', 'In Progress', 'Completed'],
    default: 'Not Started'
  },
  milestones: [milestoneSchema] // Embeds the milestones within phases
}); // Prevents creation of separate _id for phases

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
    enum: ['Not Started', 'In Progress', 'Completed', 'On Hold'],
    default: 'Not Started'
  },
  budget: {
    type: Number,
    default: 0
  },
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task'
  }],
  phases: [phaseSchema], // Uses the phaseSchema defined above
  resources: [{
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
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
