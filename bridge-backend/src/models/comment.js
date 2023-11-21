const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Represents a comment in the application.
 * @typedef {Object} Comment
 * @property {string} content - The content of the comment.
 * @property {Schema.Types.ObjectId} author - The ID of the author of the comment.
 * @property {Schema.Types.ObjectId} project - The ID of the project the comment belongs to.
 * @property {Date} createdAt - The date and time when the comment was created.
 * @property {Date} updatedAt - The date and time when the comment was last updated.
 */
const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    project: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Project'
    }
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
