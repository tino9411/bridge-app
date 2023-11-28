const mongoose = require('mongoose');
const { Schema } = mongoose;

const milestoneSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  phase: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Phase'
  },
  dueDate: {
    type: Date,
    required: true
  },
  progress: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true }); // Corrected line

const Milestone = mongoose.model('Milestone', milestoneSchema);

module.exports = Milestone;