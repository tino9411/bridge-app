const TaskComment = require('../models/taskComment');

module.exports = async (req, res, next) => {
  try {
    // Get the comment ID from the request parameters
    const commentId = req.params.commentId;

    // Find the comment by ID
    const comment = await TaskComment.findById(commentId);

    // Check if the logged-in user is the author of the comment
    if (!comment.author.equals(req.user._id)) {
      return res.status(403).json({ error: 'Access denied. Not the comment creator.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};