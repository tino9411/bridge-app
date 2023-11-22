// TaskComments.jsx
import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  TextField,
  Button,
  Divider,
  Box,
  Stack,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";

const TaskComment = ({ commentsData, taskId }) => {
  const [newComment, setNewComment] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  

  // Submit a top-level comment
  const handleCommentSubmit = () => {
    submitComment({ content: newComment }, taskId);
    setNewComment("");
  };

  // Submit a reply to a comment
  const handleReplySubmit = (commentId) => {
    submitCommentReply(
      { content: replyContent, parentComment: commentId },
      taskId
    );
    setReplyContent("");
    setReplyTo(null);
  };

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

  const renderReplies = (replies) => {
    return replies.map((replyId, index) => {
      const reply = commentsData.find(comment => comment._id === replyId); // Find the reply in commentsData
      if (!reply) return null; // If reply not found, don't render anything

      return (
        <React.Fragment key={index}>
          <ListItem sx={{ pl: 4 }}>
            <ListItemAvatar>
              <Avatar alt={reply.author} />
            </ListItemAvatar>
            <ListItemText
              primary={reply.author}
              secondary={
                <>
            <Typography
              sx={{ display: "inline" }}
              component="span"
              variant="body2"
              color="text.primary"
            >
              {reply.content}
            </Typography>
            {/* You would format the date here */}
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
            >
              {reply.createdAt}
            </Typography>
          </>
              }
              
            />
          </ListItem>
          {reply.replies && reply.replies.length > 0 && renderReplies(reply.replies)}
        </React.Fragment>
      );
    });
  };

  const renderCommentItem = (comment, isReply = false) => {
    const isBeingRepliedTo = comment._id === replyTo;
    return (
      <ListItem alignItems="flex-start" sx={{ py: 1, pl: isReply ? 4 : 0 }}>
        <ListItemAvatar>
          <Avatar alt={comment.author} />
        </ListItemAvatar>
        <ListItemText
          primary={comment.author}
          secondary={
            <>
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {comment.content}
              </Typography>
              <Typography
                variant="caption"
                display="block"
                color="text.secondary"
              >
                {new Date(comment.createdAt).toLocaleString()} {/* Improved date format */}
              </Typography>
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
                  <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleReplySubmit(comment._id)}
                    >
                      Reply
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setReplyTo(null)}
                    >
                      Cancel
                    </Button>
                  </Box>
                </>
              )}
              {!isBeingRepliedTo && !isReply && (
                <Button
                  variant="outlined"
                  size="small"
                  color="primary"
                  onClick={() => setReplyTo(comment._id)}
                  sx={{ mt: 1 }}
                >
                  Reply
                </Button>
              )}
            </>
          }
        />
      </ListItem>
    );
  };

  const renderComments = () => {
    return commentsData
      .filter((comment) => !comment.parentComment)
      .map((comment, index) => (
        <React.Fragment key={index}>
          {renderCommentItem(comment)}
          {comment.replies && renderReplies(comment.replies)}
        </React.Fragment>
      ));
  };

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
        <Button
          variant="contained"
          size="small"
          color="primary"
          endIcon={<SendIcon />}
          onClick={handleCommentSubmit}
        >
          Send
        </Button>
      </Stack>
    </Box>
  );
};

export default TaskComment;