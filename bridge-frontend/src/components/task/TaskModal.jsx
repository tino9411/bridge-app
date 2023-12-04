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
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
/* import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import HotelIcon from "@mui/icons-material/Hotel";
import RepeatIcon from "@mui/icons-material/Repeat"; */
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
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

  const renderTaskHistory = () => {
    const importantFields = ['status', 'dueDate', 'rate', 'phase']; // Focus on these fields
  
    const formatDetail = (value) => {
      if (value instanceof Date || (typeof value === 'string' && Date.parse(value))) {
        return new Date(value).toLocaleDateString(); // Format date strings and Date objects
      }
      if (value && typeof value === 'object') {
        if (value.username) return value.username; // For User objects
        if (value.name) return value.name; // For other objects with 'name' field
        return JSON.stringify(value); // Fallback for other object types
      }
      return value; // Return primitive types as-is
    };
  
    const actionColors = {
      "Task Updated": "secondary",
      "Task Assigned to Phase": "primary",
      "Task Removed from Phase": "error",
      // Add other actions and their colors as needed
    };
  
    return (
      <Timeline position="alternate">
        {task.history.slice().reverse().map((log, index) => (
          <TimelineItem key={index}>
            <TimelineOppositeContent
              sx={{ m: 'auto 0' }}
              align="right"
              variant="body2"
              color="text.secondary"
            >
              {new Date(log.date).toLocaleString()} {/* Format date for display */}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot color={actionColors[log.action] || "grey"} variant="outlined" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: '12px', px: 2 }}>
              <Typography variant="h6" >{log.action}</Typography>
              <Typography variant="body2" color="text.secondary" style={{ fontSize: '0.8rem' }}>{log.description}</Typography>
              {log.details && log.details
                .filter(detail => importantFields.includes(detail.field) && formatDetail(detail.oldValue) !== formatDetail(detail.newValue))
                .map((detail, detailIndex) => (
                  <Typography key={detailIndex} variant="body2" style={{ fontSize: '0.75rem', color: 'gray' }}>
                    {detail.field}: Changed from "{formatDetail(detail.oldValue)}" to "{formatDetail(detail.newValue)}"
                  </Typography>
                ))
              }
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    );
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
          width: showTaskActivity ? "1100px" : "1000px",
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
                sx={{ display: "flex", marginLeft: "auto", p: 1 }}
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
                  mb: 1,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
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
                  flexDirection: "row",
                  justifyContent: "space-between",
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
              width: "100%",
              overflowY: "auto",
              bgcolor: "background.paper",
              padding: 2,
              maxHeight: "calc(100vh - 205px)",
              boxSizing: "border-box",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
              Task Activity
            </Typography>
            {renderTaskHistory()}
          </Card>
        )}
      </Box>
    </StyledModal>
  );
};

export default TaskModal;
