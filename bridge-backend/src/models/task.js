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
        enum: ['open', 'in progress', 'completed'],
        default: 'open'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    dueDate: {
        type: Date,
        default: null // You can set a default due date, if required
    },
}, { timestamps: true }); // Add createdAt and updatedAt fields

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
