const mongoose = require('mongoose');
const { Schema } = mongoose;

const checklistItemSchema = new Schema({
  text: String,
  isCompleted: { type: Boolean, default: false }
});

const historyLogSchema = new Schema({
    date: {
      type: Date,
      default: Date.now
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    action: {
      type: String,
      required: true
    },
    details: [{
      field: String,
      oldValue: Schema.Types.Mixed,
      newValue: Schema.Types.Mixed
    }]
  });  

const taskSchema = new Schema({
    project: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Project'
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
        enum: ['new', 'low', 'medium', 'high'],
        default: 'low'
    },
    phase: {
        type: Schema.Types.ObjectId,
        ref: 'Phase'
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
        default: null
    },
    rate: {
        type: Number,
        default: null
    },
    categories: [{
        type: String,
        trim: true
    }],
    location: {
        type: String,
        trim: true
    },
    timeCommitment: {
        type: String,
        enum: ['part-time', 'full-time', 'freelance'],
        default: 'part-time'
    },
    checklistItems: [checklistItemSchema],
    tags: [{
        type: String,
        trim: true
    }],
    history: [historyLogSchema],
    requestToJoin: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        message: String,
        status: {
            type: String,
            enum: ['pending', 'approved', 'denied'],
            default: 'pending'
        }
    }],
    feedbacks: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: Number,
        comment: String
    }],
    files: [{
        type: Schema.Types.ObjectId,
        ref: 'File'
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    isArchived: {
        type: Boolean,
        default: false
    }
    
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
