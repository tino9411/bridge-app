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
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Assuming you have a User model defined elsewhere
    },
    tasks: [{
        type: Schema.Types.ObjectId,
        ref: 'Task' // This will reference Task model
    }]
}, { timestamps: true }); // Add createdAt and updatedAt fields

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
