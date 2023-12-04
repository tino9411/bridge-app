//AssignedTaskModal.jsx
import React, { memo } from "react";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import TaskComment from "../comment/TaskComment";
import { formatDate } from '../../utils/dateUtils';
import { renderSkillsAsChips } from '../../utils/chipUtils';
import { conditionalRender } from '../../utils/renderUtils';
import typographyStyles from '../../utils/typographyStyles';
import { StyledCard } from '../../utils/cardUtils';
import { StyledModal } from "../../utils/modalUtils";
import { useTheme } from '@mui/material/styles';

const AssignedTaskModal = memo(({
  task,
  open,
  onClose,
  commentsData,
  addComment,
  deleteComment,
}) => {
 
  const theme = useTheme();


 
  return (
    <StyledModal
      open = {open}
      onClose={onClose}
    >
      <StyledCard>
        <CardHeader
          action={
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          }
          title={
            <Typography variant="h6" sx={typographyStyles.boldTitle}>
              {task.title}
            </Typography>
          }
          sx={{ borderBottom: "1px solid #ddd", pb: 2 }}
        />
        <CardContent sx={{ pt: 2, p: 2, m: 2 }}>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{
              mb: 1,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="subtitle1" component="div" sx={{ mb: 1 }}>
              <strong>Project:</strong> {task.project.name}
            </Typography>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{
                display: "flex",
                alignItems: "center", // Align items vertically
                marginRight: 1, // Add right margin
                mb: 1,
                  
              }}
            >
            <Typography variant="subtitle1" component="strong" sx={{ mr: 1 }}>
              <strong>Skills Needed: </strong>{" "}
              </Typography>
              {/* Add right margin */}
              {renderSkillsAsChips(task.skillsNeeded)}
            </Typography>
          </Typography>

          <Typography variant="subtitle1" component="div" sx={{ mb: 1 }}>
            <strong>Description:</strong> {task.description}
          </Typography>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{
              mb: 1,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <strong>
              Priority:{" "}
              <Chip
                label={task.priority}
                size="medium"
                sx={{
                  bgcolor: theme.palette.priority[task.priority],
                  color: "common.white",
                  m: 0.1,
                  fontSize: "0.8rem",
                }}
              />
            </strong>
            <strong>
              Status:{" "}
              <Chip
                label={task.status}
                size="medium"
                sx={{
                  bgcolor: theme.palette.status[task.status],
                  color: "common.white",
                  m: 0.1,
                  fontSize: "0.8rem",
                }}
              />
            </strong>
          </Typography>
          <Typography variant="subtitle1" component="div" sx={{ mb: 1 }}>
          <strong>Assignee:</strong> {task.assignee && task.assignee.username ? task.assignee.username : "Unassigned"}



</Typography>
          <Typography variant="subtitle1" component="div" sx={{ mb: 1 }}>
            <strong>Due Date:</strong> {formatDate(task.dueDate)}
          </Typography>
          <Typography variant="subtitle1" component="div" sx={{ mb: 1 }}>
            <strong>Rate:</strong> {task.rate || "N/A"}
          </Typography>
            {conditionalRender(task,
              <TaskComment
            commentsData={commentsData}
            onSubmitComment={addComment}
            onDeleteComment={deleteComment}
            taskId={task._id}
          /> )}    
          
        </CardContent>
        <Box
          sx={{
            p: 1,
            m: 0,
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #ddd",
          }}
        >
          <Typography variant="body2" component="div">
            <strong>Created at:</strong> {formatDate(task.createdAt)}
          </Typography>
          <Typography variant="body2" component="div">
            <strong>Updated at:</strong> {formatDate(task.updatedAt)}
          </Typography>
        </Box>
      </StyledCard>
    </StyledModal>
  );
});

export default AssignedTaskModal;
