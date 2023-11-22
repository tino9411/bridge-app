// TaskComment model definition seems correct.

// Corrected TaskComment controllers:

const TaskComment = require('../models/taskComment');

// Create a new comment
exports.createTaskComment = async (req, res) => {
    try {
      const comment = new TaskComment({
        content: req.body.content,
        author: req.user._id,
        task: req.params.taskId,
        parentComment: req.body.parentComment || null
      });
      await comment.save();
      res.status(201).json(comment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

// Create comment reply
exports.createTaskCommentReply = async (req, res) => {
    try {
        const parentComment = await TaskComment.findById(req.params.commentId);
        if (!parentComment) {
            return res.status(404).json({ error: 'Parent comment not found' });
        }

        const comment = new TaskComment({
            content: req.body.content,
            author: req.user._id,
            task: req.params.taskId,
            parentComment: req.params.commentId
        });

        parentComment.replies.push(comment._id); // Add the reply to the parent comment's replies array
        await parentComment.save();
        await comment.save();

        res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//Get task comment

exports.getTaskComment = async (req, res) => {
    try {
        const comment = await TaskComment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        res.json(comment);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};


  

// Get all comments for a task
exports.getTaskComments = async (req, res) => {
  try {
    const comments = await TaskComment.find({ task: req.params.taskId }).populate('author', 'username');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific comment
exports.getTaskCommentCount = async (req, res) => {
    try {
        const count = await TaskComment.countDocuments({ task: req.params.taskId });
        res.json(count);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

    };

// Update a comment
exports.updateTaskComment = async (req, res) => {
  try {
    const comment = await TaskComment.findOneAndUpdate(
      { _id: req.params.commentId, author: req.user._id },
      { content: req.body.content },
      { new: true }
    );
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a comment
exports.deleteTaskComment = async (req, res) => {
  try {
    const comment = await TaskComment.findOneAndDelete({
      _id: req.params.commentId,
      author: req.user._id
    });
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


