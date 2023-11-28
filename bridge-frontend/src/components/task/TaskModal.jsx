//TaskModal.jsxs
import React from "react";
import { Skeleton } from "@mui/material";
import {
  CardContent,
  CardHeader,
  IconButton,
  Typography,
  Chip,
} from "@mui/material";
import { conditionalRender } from "../../utils/renderUtils";
import CloseIcon from "@mui/icons-material/Close";
import TaskComment from "../comment/TaskComment";
import { StyledCard } from "../../utils/cardUtils";
import { StyledModal } from "../../utils/modalUtils";
import typographyStyles from "../../utils/typographyStyles";
import { formatDate } from "../../utils/dateUtils";
import { renderSkillsAsChips } from "../../utils/chipUtils";
import { useTheme } from "@mui/material/styles";

const TaskModal = ({
    
  task,
  onClose,
  commentsData,
  addComment,
  deleteComment,
  isLoadingComments,
}) => {
  const theme = useTheme();

  const renderTaskPhase = () => {
    if (task.phase) {
      return (
        <Typography variant="subtitle1" component="div" sx={{ mb: 1 }}>
          <strong>Phase:</strong> {task.phase.name}
        </Typography>
      );
    }
    return null;
  };

  const renderCommentsSection = () => {
    if (isLoadingComments) {
      return [...Array(5)].map((_, index) => (
        <Skeleton
          key={index}
          animation="wave"
          height={40}
          style={{ marginBottom: 6 }}
        />
      ));
    }

    if (commentsData && commentsData.length > 0) {
      return (
        <TaskComment
          commentsData={commentsData}
          addComment={addComment}
          deleteComment={deleteComment}
          taskId={task._id}
        />
      );
    } else {
      return (
        <Typography sx={{ m: 2 }} color="text.secondary">
          No comments yet.
        </Typography>
      );
    }
  };

  if (!task) return null;

  return (
    <StyledModal open={Boolean(task)} onClose={onClose}>
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
            <strong>Assignee:</strong>{" "}
            {task.assignee && task.assignee.username
              ? task.assignee.username
              : "Unassigned"}
          </Typography>
          {renderTaskPhase()}
          <Typography variant="subtitle1" component="div" sx={{ mb: 1 }}>
            <strong>Due Date:</strong> {formatDate(task.dueDate)}
          </Typography>
          <Typography variant="subtitle1" component="div" sx={{ mb: 1 }}>
            <strong>Rate:</strong> {task.rate || "N/A"}
          </Typography>

          {conditionalRender(task, renderCommentsSection())}
        </CardContent>
      </StyledCard>
    </StyledModal>
  );
};

export default TaskModal;
