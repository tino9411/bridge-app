const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        required: true,
        enum: [
            'task', 
            'milestone', 
            'project', 
            'phase', 
            'comment', 
            'team', 
            'user', 
            'request',
            'requestStatus', 
            'message']
    },
    relatedTo: {
        type: Schema.Types.ObjectId,
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User' // The sender of the notification
    },
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User' // The recipient of the notification
    },
    team: [{
        type: Schema.Types.ObjectId,
        ref: 'User' // The team members who will receive the notification
    }],


    }, { timestamps: true });

    const Notification = mongoose.model('Notification', notificationSchema);
    module.exports = Notification;