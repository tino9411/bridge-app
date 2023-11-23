// TaskComment.jsx
import React, { useState, useCallback, memo } from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  TextField,
  Divider,
  Box,
  Stack,
  Collapse,
  IconButton
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ReplyIcon from "@mui/icons-material/Reply";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CloseIcon from '@mui/icons-material/Close'
import axios from "axios";

/**
 * TaskComment component displays a list of comments and allows users to add new comments and replies.
 * 
 * @component
 * @param {Object[]} commentsData - The array of comments data.
 * @param {string} taskId - The ID of the task associated with the comments.
 * @returns {JSX.Element} The TaskComment component.
 */

const TaskComment = memo(({ commentsData, taskId }) => {
  const [newComment, setNewComment] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [expandedComments, setExpandedComments] = useState(new Set());
  console.log(commentsData);

// useCallback ensures these functions are not recreated on every render
const handleCommentSubmit = useCallback(() => {
  submitComment({ content: newComment }, taskId);
  setNewComment("");
}, [newComment, taskId]);

const handleReplySubmit = useCallback((commentId) => {
  submitCommentReply({ content: replyContent, parentComment: commentId }, taskId);
  setReplyContent("");
  setReplyTo(null);
}, [replyContent, taskId]);

const toggleExpandComment = useCallback((commentId) => {
  setExpandedComments((prev) => {
    const newSet = new Set(prev);
    newSet.has(commentId) ? newSet.delete(commentId) : newSet.add(commentId);
    return newSet;
  });
}, []);

  const submitComment = async (commentData, taskId) => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token
      const { content, parentComment } = commentData;

      await axios.post(
        `http://localhost:3000/tasks/${taskId}/comments`,
        {
          content,
          parentComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // If successful, fetch comments again or update local state
    } catch (error) {
      console.error("Error submitting comment:", error);
      // Handle error (e.g., show error message)
    }
  };

  const submitCommentReply = async (commentData, parentComment) => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token
      const { content, parentComment } = commentData;
      await axios.post(
        `http://localhost:3000/tasks/${taskId}/comments/${parentComment}/replies`,
        {
          content,
          parentComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // If successful, fetch comments again or update local state
    } catch (error) {
      console.error("Error submitting comment:", error);
      // Handle error (e.g., show error message)
    }
  };

  const renderReplies = (replies, level = 0) => {
    return replies.map((replyId) => {
      const reply = commentsData.find(comment => comment._id === replyId);
      if (!reply) return null;

      return (
        <React.Fragment key={reply._id}>
          {renderCommentItem(reply, true, level + 1)}
          {reply.replies && reply.replies.length > 0 && expandedComments.has(reply._id) && (
            <Collapse in={expandedComments.has(reply._id)}>
              {renderReplies(reply.replies, level + 1)}
            </Collapse>
          )}
        </React.Fragment>
      );
    });
  };

  const renderCommentItem = (comment, isReply = false, level = 0) => {
    const paddingLeft = level * 4;
    const isBeingRepliedTo = comment._id === replyTo;
    const hasReplies = comment.replies && comment.replies.length > 0;

    return (
      <ListItem alignItems="flex-start" sx={{ py: 1, pl: paddingLeft }}>
      
        <ListItemAvatar>
          <Avatar alt={comment.author} />
        </ListItemAvatar>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <ListItemText
          primary={comment.author.username}
          secondary={
            <>
              {/* Comment text and metadata */}
              {/* Reply input field */}
             
            <Typography
              sx={{ display: "inline" }}
              component="span"
              variant="body2"
              color="text.primary"
            >
              {comment.content} {/* Ensure the comment content is displayed */}
            </Typography>
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              {new Date(comment.createdAt).toLocaleString()}
            </Typography>
              {/* Expand/Collapse icon */}
              {hasReplies && (
                <IconButton
                  size="small"
                  onClick={() => toggleExpandComment(comment._id)}
                  sx={{ marginLeft: 'auto' }}
                >
                  {expandedComments.has(comment._id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              )}
              {!isBeingRepliedTo && (
                <IconButton
                  size="small"
                  onClick={() => setReplyTo(comment._id)}
                  sx={{ ml: 0 }}
                >
                  <ReplyIcon fontSize="small" />
                </IconButton>
              )}
            </>
          }
        />
        {isBeingRepliedTo && (
          <>
            <TextField
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              label="Reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              sx={{ mt: 1 }}
            />
            <Box sx={{ mt: 1, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <IconButton 
              color="primary" 
              onClick={() => handleReplySubmit(comment._id)}
              size="small">
              <SendIcon fontSize="small" />
            </IconButton>
            <IconButton 
              onClick={() => setReplyTo(null)} 
              size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
            </Box>
          </>
        )}
        </Box>
      </ListItem>
    );
  };

  const renderComments = useCallback(() => {
    return commentsData.filter((comment) => !comment.parentComment)
      .map((comment) => (
        <React.Fragment key={comment._id}>
          {renderCommentItem(comment)}
          {comment.replies && comment.replies.length > 0 && expandedComments.has(comment._id) && (
            <Collapse in={expandedComments.has(comment._id)}>
              {renderReplies(comment.replies)}
            </Collapse>
          )}
        </React.Fragment>
      ));
  }, [commentsData, expandedComments, renderCommentItem, renderReplies]);

  return (
    <Box sx={{ width: "100%" }}>
      <List dense sx={{ maxHeight: "300px", overflowY: "auto" }}>
        {renderComments()}
        {commentsData.length === 0 && (
          <Typography color="text.secondary" sx={{ mx: 2 }}>
            No comments yet.
          </Typography>
        )}
      </List>
      <Divider sx={{ my: 2 }} />
      <Stack direction="row" spacing={2} sx={{ px: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={2}
          variant="outlined"
          label="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
       
        <IconButton 
              color="primary" 
              onClick={() => handleCommentSubmit()}
              size="small">
              <SendIcon fontSize="small" />
            </IconButton>
      
      </Stack>
    </Box>
  );
});

export default TaskComment;