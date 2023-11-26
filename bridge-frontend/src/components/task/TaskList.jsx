//TaskList.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  ListSubheader,
  IconButton,
  Chip,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Snackbar,
} from "@mui/material";
import TaskModal from "./TaskModal";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { formatDate } from "../../utils/dateUtils";
import { useTheme } from "@mui/material/styles";
import { sortTasks, filterTasks } from "../../utils/taskUtils";
import useFetchData from "../../hooks/useFetchData";
import useComments from "../../hooks/useComments";
import CreateTaskModal from "./CreateTaskModal"; // Import the modal componen
import DeleteIcon from "@mui/icons-material/Delete";
import MuiAlert from "@mui/material/Alert";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [sortField, setSortField] = useState("dueDate"); // default sorting by dueDate
  const [filterStatus, setFilterStatus] = useState(""); // no filter by default
  const [selectedTask, setSelectedTask] = useState(null);
  const token = localStorage.getItem("token"); // Replace with your token retrieval method
  const [error, setError] = useState("");
  const { data: currentUser, error: userError } = useFetchData(
    "http://localhost:3000/users/profile",
    token
  );

  const [comments, setComments, isLoadingComments] = useComments(selectedTask ? selectedTask._id : null, token);
  
  
  const { projectId } = useParams();
  const theme = useTheme();
  const [showCreateModal, setShowCreateModal] = useState(false); // State to control the modal visibility
  const [openDialog, setOpenDialog] = useState(false); // State to control the dialog visibility
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const [alertType, setAlertType] = useState("success"); // Can be 'error', 'warning', 'info', 'success'

  // Handler for changing sort field
  const handleSortChange = (event) => {
    setSortField(event.target.value);
  };

  // Handler for changing filter status
  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleDeleteTask = async (taskId) => {
    setOpenDialog(false); // Close the confirmation dialog
    try {
      const response = await axios.delete(
        `http://localhost:3000/projects/${projectId}/tasks/${taskId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setTasks(tasks.filter((task) => task._id !== taskId));
        setSuccessMessage(response.data.message || "Task successfully deleted");
        setAlertType("success");
      } else {
        // If the status code is not 200, we assume the backend has reasons for not deleting the task
        setSuccessMessage(
          response.data.message ||
            "Task could not be deleted due to constraints"
        );
        setAlertType("error");
      }
    } catch (err) {
      // If the backend sends an error response, we display that message to the user
      setSuccessMessage(
        err.response?.data?.message ||
          "Failed to delete task. Please try again later."
      );
      setAlertType("error");
    }
    setShowSnackbar(true); // Show the Snackbar after handling the deletion
  };

  const handleOpenDialog = (taskId, event) => {
    event.stopPropagation(); // This will prevent the event from bubbling up to the parent elements
    setSelectedTaskId(taskId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError(""); // Clear error message
  };
  // Inside your component
  const sortedAndFilteredTasks = tasks
    ? sortTasks(filterTasks(tasks, filterStatus), sortField).reduce(
        (acc, task) => {
          const projectName = task.project.name;
          if (!acc[projectName]) {
            acc[projectName] = [];
          }
          acc[projectName].push(task);
          return acc;
        },
        {}
      )
    : {};

  const handleTaskClick = (task) => {
    setSelectedTask(task); // Set the selected task
  };

  const handleCloseModal = () => {
    setSelectedTask(null); // Reset the selected task when the modal is closed
  };

  // Function to handle the submission of a new task
  const handleCreateTask = async (newTaskData) => {
    try {
      // Adjust the formatting of the newTaskData
      const taskSubmission = {
        ...newTaskData,
        phase: newTaskData.phase || null, // Directly assign the phase ID
        skillsNeeded: newTaskData.skillsNeeded, // Directly use the skillsNeeded array
        rate: parseFloat(newTaskData.rate) || 0,
      };

      // Log formatted data to check
      console.log("Task Submission Data:", taskSubmission);

      const response = await axios.post(
        `http://localhost:3000/projects/${projectId}/tasks`,
        taskSubmission,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data) {
        setTasks([...tasks, response.data]);
        setSuccessMessage("Task created successfully");
        setAlertType("success");
      } else {
        setSuccessMessage("Failed to create task");
        setAlertType("error");
      }
      setShowSnackbar(true);

      setShowCreateModal(false); // Close the modal
    } catch (err) {
      setError(err.response?.data?.error || "Error creating task");
      console.error("Task creation error:", err.response || err);
    }
  };
 // Function to add a new comment to state and to the database
const handleAddComment = async (newCommentText) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/tasks/${selectedTask._id}/comments`,
      { content: newCommentText }, // Pass only the content to the server
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Use the comment data returned from the server
    if (response.data) {
      setComments([...comments, response.data]);
      setSuccessMessage("Comment added successfully");
      setAlertType("success");
    } else {
      throw new Error('Failed to add comment');
    }
  } catch (err) {
    const errorMsg = err.response?.data?.error || "Error adding comment";
    setSuccessMessage(errorMsg);
    setAlertType("error");
  }
  setShowSnackbar(true);
};

  // Function to delete a comment
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/tasks/${selectedTask._id}/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Update commentsData state by filtering out the deleted comment
      const updatedComments = comments.filter((comment) => comment._id !== commentId);
      setComments(updatedComments);
      setSuccessMessage(response.data.message || "Comment deleted successfully");
      setAlertType("success");
    } catch (err) {
      setSuccessMessage(err.response?.data?.error || "Error deleting comment");
      setAlertType("error");
    }
    setShowSnackbar(true);
  };
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/projects/${projectId}/tasks`
        );
        setTasks(response.data);
      } catch (err) {
        const errorMsg = err.response
          ? err.response.data.error
          : "Error fetching tasks";
        setError(errorMsg);
        setSuccessMessage(errorMsg);
        setAlertType("error");
        setShowSnackbar(true);
      }
    };

    fetchTasks();
  }, [projectId]);

  useEffect(() => {
    if (error) {
      setSuccessMessage(error);
      setAlertType("error");
      setShowSnackbar(true);
    }
  }, [error]);

  useEffect(() => {
    if (userError) {
      setSuccessMessage(userError);
      setAlertType("error");
      setShowSnackbar(true);
    }
  }, [userError]);

  if (error) {
    return (
      <Alert severity="error" onClose={() => setError("")}>
        {error}
      </Alert>
    );
  }

  return (
    <Card
      sx={{
        maxHeight: "450px",
        maxWidth: "400px",
        display: "flex",
        flexDirection: "column",
        boxShadow: 3,
        borderRadius: 5,
        mb: 2,
      }}
    >
      <CardHeader
        title="Task List"
        action={
          <IconButton
            aria-label="add-task"
            onClick={() => setShowCreateModal(true)} // Open the modal
          >
            <AddRoundedIcon />
          </IconButton>
        }
        titleTypographyProps={{ variant: "h6", align: "center" }}
      />
      <Box
        sx={{ display: "flex", justifyContent: "space-between", padding: 2 }}
      >
        <FormControl
          variant="outlined"
          size="small"
          sx={{ width: "100px", m: 1 }}
        >
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortField}
            onChange={handleSortChange}
            label="Sort By"
            size="small"
          >
            <MenuItem value="dueDate">Due Date</MenuItem>
            <MenuItem value="rate">Rate</MenuItem>
            <MenuItem value="default">Default</MenuItem>
            {/* Add other sort options here */}
          </Select>
        </FormControl>
        <FormControl
          variant="outlined"
          size="small"
          sx={{ width: "100px", m: 1 }}
        >
          <InputLabel>Filter</InputLabel>
          <Select
            value={filterStatus}
            onChange={handleFilterChange}
            label="Filter Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="open">Open</MenuItem>
            <MenuItem value="in progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="on hold">On Hold</MenuItem>
            {/* Add other filter options here */}
          </Select>
        </FormControl>
      </Box>
      <List
        dense
        sx={{ overflowY: "auto", padding: 0, margin: 0, maxHeight: "400px" }}
      >
        {Object.entries(sortedAndFilteredTasks).map(([projectName, tasks]) => (
          <li key={projectName} style={{ backgroundColor: "inherit" }}>
            {" "}
            {/* Ensure background continuity */}
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <ListSubheader
                sx={{ bgcolor: "background.paper", lineHeight: "30px" }}
              >
                {projectName}
              </ListSubheader>
              {tasks.map((task) => (
                <React.Fragment key={task._id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      justifyContent: "space-between",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)", // or any other color you prefer
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => handleTaskClick(task)} // Add click handler
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                      }}
                    >
                      <ListItemText
                        primary={task.title}
                        secondary={
                          <>
                            <Chip
                              label={task.status}
                              size="small"
                              sx={{
                                bgcolor: theme.palette.status[task.status],
                                color: "common.white",
                                m: 0.1,
                                mt: 1.5,
                                fontSize: "0.6rem",
                              }}
                            />{" "}
                            <Chip
                              label={task.priority}
                              size="small"
                              sx={{
                                bgcolor: theme.palette.priority[task.priority],
                                color: "common.white",
                                m: 0.1,
                                mt: 1.5,
                                fontSize: "0.6rem",
                              }}
                            />
                          </>
                        }
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                        sx={{
                          fontSize: "0.7rem",
                          fontWeight: "fontWeightLight",
                        }}
                      >
                        {formatDate(task.dueDate)}
                      </Typography>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "0.7rem" }}
                      >
                        Rate: ${task.rate}
                      </Typography>
                      <IconButton
                        onClick={(event) => handleOpenDialog(task._id, event)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </ListItem>
                  <Divider variant="middle" sx={{ bgcolor: "grey.800" }} />
                </React.Fragment>
              ))}
            </ul>
          </li>
        ))}
      </List>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Task Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this task? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={() => handleDeleteTask(selectedTaskId)} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => {
          setShowSnackbar(false);
          setSuccessMessage(""); // Clear the message if needed
        }}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity={alertType}
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
      {console.log("In TaskList, addComment is:", handleAddComment)}

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={handleCloseModal}
          commentsData={comments} // Pass comments to the modal
          addComment={handleAddComment} // Pass function to add comment
          deleteComment={handleDeleteComment} // Pass function to delete comments
          isLoadingComments={isLoadingComments} // Pass the loading state
        />
      )}
      <CreateTaskModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateTask}
        projectId={projectId}
      />
    </Card>
  );
};

export default TaskList;
