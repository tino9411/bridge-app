import React from 'react';
import { TextField, Box, IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const EditCommentSection = ({ editedContent, setEditedContent, onSave, onCancel }) => {
    return (
        <>
            <TextField
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
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
                <IconButton color="primary" onClick={onSave} size="small">
                    <CheckIcon fontSize="small" />
                </IconButton>
                <IconButton onClick={onCancel} size="small">
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>
        </>
    );
};

export default EditCommentSection;
