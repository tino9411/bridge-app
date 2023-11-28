//phase.js Phase model
// /**
//  * phase.js
//  * @typedef {import('mongoose')} mongoose
//  * @typedef {import('mongoose')} Schema
//  * @typedef {import('mongoose')} Model
//  * @typedef {import('mongoose')} Document
//  *
//  * @typedef {Object} Milestone
//  * @property {string} title - The title of the milestone.
//  * @property {Date} dueDate - The due date of the milestone.
//  * @property {number} [progress=0] - The progress of the milestone.
//  * @property {boolean} [completed=false] - Whether the milestone is completed.
//  *
//  * @typedef {Object} Phase
//  * @property {string} name - The name of the phase.
//  * @property {Date} startDate - The start date of the phase.
//  * @property {Date} endDate - The end date of the phase.
//  * @property {'Not Started' | 'In Progress' | 'Completed'} [status='Not Started'] - The status of the phase.
//  * @property {string[]} [assignedTasks] - The IDs of the tasks assigned to the phase.
//  * @property {Milestone[]} [milestones] - The milestones of the phase.
//  *
//  * @type {Schema<Phase, Model<Phase, Document>, Phase>}
//  */
//

const mongoose = require('mongoose');
const { Schema } = mongoose;

const phaseSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  project: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Project'
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
    enum: ['planned', 'in progress', 'completed'],
    default: 'planned'
  },
  assignedTasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task'
  }],
  milestones: [{
    type: Schema.Types.ObjectId,
    ref: 'Milestone'
  }]
}, { timestamps: true });

const Phase = mongoose.model('Phase', phaseSchema);
module.exports = Phase;
