const mongoose = require('mongoose');
const { Schema } = mongoose;
const fileSchema = new mongoose.Schema({
    filename: {
      type: String,
      required: true
    },
    filepath: {
      type: String,
      required: true
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    }
    // You can add more fields as necessary
  });
  
  const File = mongoose.model('File', fileSchema);
  
  module.exports = File;
  