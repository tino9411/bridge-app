//taskComment models
const mongoose = require('mongoose');

const taskCommentSchema = new mongoose.Schema({
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TaskComment',
        default: null // Indicates a top-level comment
      },
      replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TaskComment'
      }],
      isDeleted: {
        type: Boolean,
        default: false
      },
      edited: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

const TaskComment = mongoose.model('TaskComment', taskCommentSchema);

module.exports = TaskComment;
