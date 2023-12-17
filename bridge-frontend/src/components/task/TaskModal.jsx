//TaskModal.jsx
import React, { useState } from "react";
import {
  CardContent,
  CardHeader,
  IconButton,
  Typography,
  Chip,
  Box,
  Card,
} from "@mui/material";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { conditionalRender } from "../../utils/renderUtils";
import CloseIcon from "@mui/icons-material/Close";
import TaskComment from "../comment/TaskComment";
import { StyledCard } from "../../utils/cardUtils";
import { StyledModal } from "../../utils/modalUtils";
import typographyStyles from "../../utils/typographyStyles";
import { formatDate } from "../../utils/dateUtils";
import { renderSkillsAsChips } from "../../utils/chipUtils";
import { useTheme } from "@mui/material/styles";
import { useComments } from "../../contexts/CommentContext";
import Snackbar from "@mui/material/Snackbar";
import TaskHistory from "./TaskHistory";

const TaskModal = ({ task, onClose, token }) => {
  const {
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    handleSnackbarClose,
  } = useComments(); // Destructure functions and state from useComments
  const theme = useTheme();

  const [showTaskActivity, setShowTaskActivity] = useState(false);

  const toggleTaskActivity = () => {
    setShowTaskActivity(!showTaskActivity);
  };


  
  const renderTaskPhase = () => {
    if (task.phase) {
      return (
        <Typography variant="body2" component="div" sx={{ mb: 1 }}>
          <strong>Phase:</strong> {task.phase.name}
        </Typography>
      );
    }
    return null;
  };

  if (!task) return null;

  return (
    <StyledModal open={Boolean(task)} onClose={onClose}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: showTaskActivity ? "1100px" : "600px",
          maxHeight: "calc(100vh - 100px)",
        }}
      >
        <StyledCard
          sx={{
            flexBasis: showTaskActivity ? "100%" : "100%",
            position: "relative",
          }}
        >
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
            sx={{ borderBottom: "1px solid #ddd", pb: 1 }}
          />

          <CardContent>
            <Box>
              <IconButton
                onClick={toggleTaskActivity}
                sx={{ display: "flex", marginLeft: "auto", p: 1, top: -20, right: -10 }}
              >
                {showTaskActivity ? (
                  <ArrowBackIosIcon />
                ) : (
                  <ArrowForwardIosIcon />
                )}
              </IconButton>
            </Box>

            <Box>
              <Typography
                variant="body2"
                component="div"
                sx={{
                  mb: 0,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" component="div" sx={{ mb: 1 }}>
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
                  <Typography variant="body2" component="strong" sx={{ mr: 1 }}>
                    <strong>Skills Needed: </strong>{" "}
                  </Typography>
                  {/* Add right margin */}
                  {renderSkillsAsChips(task.skillsNeeded)}
                </Typography>
              </Typography>

              <Typography variant="body2" component="div" sx={{ mb: 1 }}>
                <strong>Description:</strong> {task.description}
              </Typography>
              <Typography
                variant="body2"
                component="div"
                sx={{
                  mb: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                }}
              >
                <strong>
                  Priority:{" "}
                  <Chip
                    label={task.priority}
                    size="small"
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
                    size="small"
                    sx={{
                      bgcolor: theme.palette.status[task.status],
                      color: "common.white",
                      m: 0.1,
                      fontSize: "0.8rem",
                    }}
                  />
                </strong>
              </Typography>
              <Typography variant="body2" component="div" sx={{ mb: 1 }}>
                <strong>Assignee:</strong>{" "}
                {task.assignee && task.assignee.username
                  ? task.assignee.username
                  : "Unassigned"}
              </Typography>
              {renderTaskPhase()}
              <Typography variant="body2" component="div" sx={{ mb: 1 }}>
                <strong>Due Date:</strong> {formatDate(task.dueDate)}
              </Typography>
              <Typography variant="body2" component="div" sx={{ mb: 1 }}>
                <strong>Rate:</strong> {task.rate || "N/A"}
              </Typography>
            </Box>

            {conditionalRender(task, <TaskComment taskId={task._id} />)}
          </CardContent>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            message={snackbarMessage}
            severity={snackbarSeverity}
          />
        </StyledCard>
        {showTaskActivity && (
          <Card
            sx={{
              width: "80%",
              overflowY: "auto",
              bgcolor: "background.paper",
              padding: 2,
              maxHeight: "calc(100vh)",
              boxSizing: "border-box",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
              Task Activity
            </Typography>
            <TaskHistory task={task} /> {/* Use TaskHistory component */}
          </Card>
        )}
      </Box>
    </StyledModal>
  );
};

export default TaskModal;
