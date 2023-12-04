// TaskComment model definition seems correct.

// Corrected TaskComment controllers:

const TaskComment = require('../models/taskComment');
const Task = require('../models/task');
const mongoose = require('mongoose');

// Create a new comment
exports.createTaskComment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
    try {
        if (!req.body.content) {
            return res.status(400).json({ error: 'Comment content is required.' });
          }
          
      const comment = new TaskComment({
        content: req.body.content,
        author: req.user._id,
        task: req.params.taskId,
        parentComment: req.body.parentComment || null
      });
      await comment.save();

      await Task.findByIdAndUpdate(
        req.params.taskId,
        { $push: { comments: comment._id } },
        { session } // Include the session in the operation
      );

      await session.commitTransaction();
      res.status(201).json(comment);
    } catch (error) {
      await session.abortTransaction();
      res.status(400).json({ error: error.message });
    } finally {
      session.endSession();
    }
  };

// Create comment reply
exports.createTaskCommentReply = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
      const parentComment = await TaskComment.findById(req.params.commentId).session(session);
      if (!parentComment) {
          await session.abortTransaction();
          return res.status(404).json({ error: 'Parent comment not found' });
      }
      if (!req.body.content) {
          await session.abortTransaction();
          return res.status(400).json({ error: 'Comment content is required.' });
      }

      const comment = new TaskComment({
          content: req.body.content,
          author: req.user._id,
          task: req.params.taskId,
          parentComment: req.params.commentId
      });

      parentComment.replies.push(comment._id); // Add the reply to the parent comment's replies array
      await parentComment.save({ session });
      await comment.save({ session });

      await session.commitTransaction();
      res.status(201).json(comment);
  } catch (error) {
      await session.abortTransaction();
      res.status(400).json({ error: error.message });
  } finally {
      session.endSession();
  }
};

//Get task comment

exports.getTaskComment = async (req, res) => {
    try {
        const comment = await TaskComment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found. Please check the comment ID.' });
          }
          
        res.json(comment);
    }
    catch (error) {
        console.error(error); // Log the actual error for internal tracking
        res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
      }
      
};


// Get all comments for a task
exports.getTaskComments = async (req, res) => {
  try {
    const comments = await TaskComment.find({ task: req.params.taskId })
      .populate('author', 'username')
      .lean(); // Convert to plain JavaScript objects to modify

    const processedComments = comments.map(comment => {
      if (comment.isDeleted) {
        comment.content = '[deleted]';
      }
      if (!comment.author) {
        comment.author = '[deleted]';
      }
      return comment;
    });

    res.json(processedComments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
  }
};

// Get a specific comment
exports.getTaskCommentCount = async (req, res) => {
    try {
        const count = await TaskComment.countDocuments({ task: req.params.taskId });
        res.json(count);
    } catch (error) {
        console.error(error); // Log the actual error for internal tracking
        res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
      }
      

    };

// Update a comment
exports.updateTaskComment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const comment = await TaskComment.findOneAndUpdate(
      { _id: req.params.commentId, author: req.user._id },
      { content: req.body.content, edited: true },
      { new: true, session }
    );

    if (!comment) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Comment not found' });
    }

    await session.commitTransaction();
    res.json(comment);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ error: error.message });
  } finally {
    session.endSession();
  }
};


// Delete a comment
exports.deleteTaskComment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
      const comment = await TaskComment.findOneAndUpdate(
          { _id: req.params.commentId, author: req.user._id },
          { isDeleted: true }, // Mark as deleted instead of actual deletion
          { new: true, session }
      );
      if (!comment) {
          await session.abortTransaction();
          return res.status(404).json({ error: 'Comment not found' });
      }

      // Remove the comment from the task's comments array
      await Task.findByIdAndUpdate(req.params.taskId, {
          $pull: { comments: comment._id }
      }, { session });

      await session.commitTransaction();
      res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
      await session.abortTransaction();
      console.error(error); // Log the actual error for internal tracking
      res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
  } finally {
      session.endSession();
  }
};



