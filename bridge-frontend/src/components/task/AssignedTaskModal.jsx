//AssignedTaskModal.jsx
import React from "react";
import Modal from "@mui/material/Modal";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import TaskComment from "../comment/TaskComment";
import { green, orange, red, blue, grey } from "@mui/material/colors";

const AssignedTaskModal = ({
  task,
  open,
  onClose,
  commentsData,
  addComment,
  deleteComment,
}) => {
  if (!task) return null;

  // Define a theme object or use ThemeProvider to globally define these
  const theme = {
    status: {
      open: blue[500],
      "in progress": orange[500],
      completed: green[500],
      "on hold": red[500],
    },
    priority: {
      low: green[700],
      medium: orange[700],
      high: red[700],
      new: grey[700],
    },

    title: {
      fontSize: 12,
    },
  };

  // Function to format dates
  const formatDate = (isoDate) =>
    new Date(isoDate).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  // Function to render skills as chips
  const renderSkills = (skillsNeeded) => (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
      {skillsNeeded.map((skillsNeeded, index) => (
        <Chip
          key={index}
          label={skillsNeeded}
          sx={{ bgcolor: "primary.main", color: "common.white" }}
        />
      ))}
    </Box>
  );

  return (
    <Modal
      open
      onClose={onClose}
      aria-labelledby="task-modal-title"
      aria-describedby="task-modal-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 1,
      }}
    >
      <Card
        sx={{
          width: "80%",
          maxWidth: 1000,
          maxHeight: "100%",
          bgcolor: "background.paper",
          borderRadius: 5,
          boxShadow: 24,
        }}
      >
        <CardHeader
          action={
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          }
          title={
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
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
              {renderSkills(task.skillsNeeded)}
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
                  bgcolor: theme.priority[task.priority],
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
                  bgcolor: theme.status[task.status],
                  color: "common.white",
                  m: 0.1,
                  fontSize: "0.8rem",
                }}
              />
            </strong>
          </Typography>
          <Typography variant="subtitle1" component="div" sx={{ mb: 1 }}>
            <strong>Assignee:</strong> {task.assignee.username || "Unassigned"}
          </Typography>
          <Typography variant="subtitle1" component="div" sx={{ mb: 1 }}>
            <strong>Due Date:</strong> {formatDate(task.dueDate)}
          </Typography>
          <Typography variant="subtitle1" component="div" sx={{ mb: 1 }}>
            <strong>Rate:</strong> {task.rate || "N/A"}
          </Typography>

          <TaskComment
            commentsData={commentsData}
            onSubmitComment={addComment}
            onDeleteComment={deleteComment}
            taskId={task._id}
          />
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
          <Typography variant="subtitle1" component="div">
            <strong>Created at:</strong> {formatDate(task.createdAt)}
          </Typography>
          <Typography variant="subtitle1" component="div">
            <strong>Updated at:</strong> {formatDate(task.updatedAt)}
          </Typography>
        </Box>
      </Card>
    </Modal>
  );
};

export default AssignedTaskModal;
