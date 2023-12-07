// TaskComment.jsx
import React, { useState, useCallback, memo, useEffect } from "react";
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
  IconButton,
} from "@mui/material";
import { Skeleton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import { useComments } from "../../contexts/CommentContext"; // Import the useComments hook
import EditCommentSection from './EditCommentSection';
import CommentSection from './CommentSection'; // Adjust the import path as needed

/**
 * TaskComment component displays a list of comments and allows users to add new comments and replies.
 *
 * @component
 * @param {Object[]} commentsData - The array of comments data.
 * @param {string} taskId - The ID of the task associated with the comments.
 * @returns {JSX.Element} The TaskComment component.
 */

const TaskComment = memo(({ taskId }) => {
  const {
    user,
    comments,
    fetchComments,
    addComment,
    updateComment,
    deleteComment,
    addReplyToComment,
    loading,
  } = useComments(); // Destructure the needed functions and states from useComments
  const [newComment, setNewComment] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [expandedComments, setExpandedComments] = useState(new Set());
  const [editMode, setEditMode] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    fetchComments(taskId);
  }, [taskId]);

  const handleCommentSubmit = useCallback(() => {
    addComment(taskId, { content: newComment, author: user.username });
    setNewComment("");
  }, [taskId, newComment, addComment]);

  const handleReplySubmit = useCallback(
    (commentId) => {
      addReplyToComment(taskId, commentId, { content: replyContent });
      setReplyContent("");
      setReplyTo(null);
    },
    [taskId, replyContent, addReplyToComment]
  );

  const toggleExpandComment = useCallback((commentId) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev);
      newSet.has(commentId) ? newSet.delete(commentId) : newSet.add(commentId);
      return newSet;
    });
  }, []);

  const submitCommentReply = useCallback(
    (commentId) => {
      addReplyToComment(taskId, commentId, { content: replyContent });
      setReplyContent("");
      setReplyTo(null);
    },
    [taskId, replyContent, addReplyToComment]
  );

  const renderReplies = (replies, level = 0) => {
    return replies.map((replyId) => {
      const reply = comments.find((comment) => comment._id === replyId);
      if (!reply) return null;

      return (
        <React.Fragment key={reply._id}>
          {renderCommentItem(reply, true, level + 1)}
          {reply.replies &&
            reply.replies.length > 0 &&
            expandedComments.has(reply._id) && (
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
    const isEditable =
      user._id === comment.author._id && comment.content !== "[deleted]";
    const isEditing = editMode && editingCommentId === comment._id;

    if (!isEditing) {
      return (
        <ListItem alignItems="flex-start" sx={{ py: 1, pl: paddingLeft }}>
          <ListItemAvatar>
            <Avatar alt={comment.author} />
          </ListItemAvatar>
          <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
            <CommentSection
              comment={comment}
              onReply={() => setReplyTo(comment._id)}
              onDelete={() => deleteComment(taskId, comment._id)}
              onEdit={() => {
                setEditMode(true);
                setEditingCommentId(comment._id);
                setEditedContent(comment.content);
              }}
              onToggleExpand={() => toggleExpandComment(comment._id)}
              isExpanded={expandedComments.has(comment._id)}
              isEditable={user._id === comment.author._id && comment.content !== "[deleted]"}
            />
          </Box>
        </ListItem>
      );
    }

    return (
      <ListItem alignItems="flex-start" sx={{ py: 1, pl: paddingLeft }}>
        <ListItemAvatar>
          <Avatar alt={comment.author} />
        </ListItemAvatar>
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
        {isEditing && (
    <EditCommentSection
        editedContent={editedContent}
        setEditedContent={setEditedContent}
        onSave={() => {
            updateComment(taskId, comment._id, editedContent);
            setEditMode(false);
        }}
        onCancel={() => setEditMode(false)}
    />
)}

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
              <Box
                sx={{
                  mt: 1,
                  display: "flex",
                  gap: 1,
                  justifyContent: "flex-end",
                }}
              >
                <IconButton
                  color="primary"
                  onClick={() => handleReplySubmit(comment._id)}
                  size="small"
                >
                  <SendIcon fontSize="small" />
                </IconButton>
                <IconButton onClick={() => setReplyTo(null)} size="small">
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
    if (loading) {
      return Array.from(new Array(5)).map((_, index) => (
        <Skeleton
          key={index}
          variant="rectangular"
          height={118}
          sx={{ my: 1 }}
        />
      ));
    }
    return comments
      .filter((comment) => !comment.parentComment)
      .map((comment) => (
        <React.Fragment key={comment._id}>
          {renderCommentItem(comment)}
          {comment.replies &&
            comment.replies.length > 0 &&
            expandedComments.has(comment._id) && (
              <Collapse in={expandedComments.has(comment._id)}>
                {renderReplies(comment.replies)}
              </Collapse>
            )}
        </React.Fragment>
      ));
  }, [comments, expandedComments, renderCommentItem, renderReplies]);

  return (
    <Box sx={{ width: "100%" }}>
      <List dense sx={{ maxHeight: "300px", overflowY: "auto" }}>
        {renderComments()}
        {comments.length === 0 && (
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

        <IconButton color="primary" onClick={handleCommentSubmit} size="small">
          <SendIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Box>
  );
});

export default TaskComment;
