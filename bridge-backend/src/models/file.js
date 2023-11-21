//file.js
const mongoose = require('mongoose');
const { Schema } = mongoose;
/**
 * Represents the file schema.
 * @typedef {Object} FileSchema
 * @property {String} filename - The name of the file.
 * @property {String} filepath - The path of the file.
 * @property {mongoose.Schema.Types.ObjectId} taskId - The ID of the associated task.
 */
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
  