import React from 'react';
import { ListItemText, Typography, IconButton, Box } from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const CommentSection = ({ comment, onReply, onDelete, onEdit, onToggleExpand, isExpanded, isEditable }) => {
    return (
        <ListItemText
            primary={comment.author.username}
            secondary={
                <>
                    <Typography
                        sx={{ display: 'inline' }}
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
                        sx={{ mt: 1 }}
                    >
                        {new Date(comment.createdAt).toLocaleString()} {comment.edited ? 'Edited ' : ''}
                    </Typography>

                    {comment.replies && comment.replies.length > 0 && (
                        <IconButton
                            size="small"
                            onClick={onToggleExpand}
                            sx={{ marginLeft: 'auto' }}
                        >
                            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                    )}
                    <IconButton size="small" onClick={onReply} sx={{ ml: 0 }}>
                        <ReplyIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        color="error"
                        onClick={onDelete}
                        size="small"
                        sx={{ ml: 'auto', visibility: isEditable ? 'visible' : 'hidden' }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                    
                    {isEditable && (
                        <IconButton onClick={onEdit} size="small">
                            <EditIcon fontSize="small" />
                        </IconButton>
                    )}
                    

     
                </>
            }
        />
    );
};

export default CommentSection;
