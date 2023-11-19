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
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    phase: {
      type: Schema.Types.ObjectId,
      ref: 'Phase', // Reference to a 'Phase' model
      default: null
    },
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
