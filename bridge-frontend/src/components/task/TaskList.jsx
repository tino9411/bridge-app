//TaskList.jsx
import React, { useState, useEffect } from "react";
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
import CreateTaskModal from "./CreateTaskModal"; // Import the modal component
import EditTaskModal from "./EditTaskModal"; // Import the EditTaskModal component
import DeleteIcon from "@mui/icons-material/Delete";
import Alert from "@mui/material/Alert";
import { useTasks } from "../../contexts/TaskContext"; // Import the useTasks hook
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useUser } from "../../contexts/UserContext";

const TaskList = () => {
  const {
    tasks,
    fetchProjectTasks,
    deleteTask,
    addTask,
    updateTask,
    addHistoryLogToTask,
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    showSnackbar,
    handleSnackbarClose,
  } = useTasks();
  const [sortField, setSortField] = useState("dueDate");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const { projectId } = useParams();
  const [error, setError] = useState(null);
  const theme = useTheme();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // State to manage EditTaskModal visibility
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const { user } = useUser();

  // Handler for changing sort field
  const handleSortChange = (event) => {
    setSortField(event.target.value);
  };

  // Handler for changing filter status
  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  useEffect(() => {
    fetchProjectTasks(projectId); // Replace the direct API call with fetchProjectTasks from TaskContext
  }, [projectId]);

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

  const handleTaskEditClick = (task) => {
    setSelectedTask(task); // Set the selected task
    setShowEditModal(true); // Open the modal
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false); // Close the EditTaskModal
    setSelectedTask(null); // Reset the selected task
  };

  const handleCloseModal = () => {
    setSelectedTask(null); // Reset the selected task when the modal is closed
  };

  const captureTaskChanges = (oldTask, newTask) => {
    const changes = [];
    Object.keys(newTask).forEach(key => {
      if (newTask[key] !== oldTask[key]) {
        changes.push({ field: key, oldValue: oldTask[key], newValue: newTask[key] });
      }
    });
    return changes;
  };

  // Function to handle the submission of a new task
  const handleCreateTask = async (newTaskData) => {
    try {
      // Adjust the formatting of the newTaskData
      const taskSubmission = {
        ...newTaskData,
        phase: newTaskData.phase || null,
        skillsNeeded: newTaskData.skillsNeeded,
        rate: parseFloat(newTaskData.rate) || 0,
      };

      await addTask(projectId, taskSubmission); // Use addTask from TaskContext

      const createdTaskId = tasks[tasks.length - 1]._id; // Get the ID of the newly created task
      const historyLog = {
        date: new Date(),
        action: "Task Created",
        description: `Task '${newTaskData.title}' was created.`
      };

      await addHistoryLogToTask(createdTaskId, historyLog);

      setShowCreateModal(false); // Close the modal after task creation
    } catch (err) {
      console.error("Task creation error:", err.response || err);
      showSnackbar(err.response?.data?.error || "Error creating task", "error");
    }
  };

  const handleDeleteTask = async (taskId, projectId) => {
    setOpenDialog(false);
  
    try {
      await deleteTask(taskId, projectId); // Use deleteTask from TaskContext
  
      // Add history log after successful task deletion
      const historyLog = {
        date: new Date(),
        action: "Task Deleted",
        description: `Task with ID '${taskId}' was deleted.`
      };
  
      await addHistoryLogToTask(taskId, historyLog);
    } catch (err) {
      console.error("Error deleting task:", err.response || err);
      showSnackbar(err.response?.data?.error || "Error deleting task", "error");
    }
  };
  

  const handleUpdateTask = async (taskId) => {
    try {
      const taskSubmission = {
        ...selectedTask,
        phase: selectedTask.phase || null,
        skillsNeeded: selectedTask.skillsNeeded,
        rate: parseFloat(selectedTask.rate) || 0,
      };
      await updateTask(taskId, taskSubmission); // Use updateTask from TaskContext

   
    } catch (err) {
      console.error("Task update error:", err.response || err);
      showSnackbar(err.response?.data?.error || "Error updating task", "error");
    }
  };
  

  useEffect(() => {
    if (error) {
      showSnackbar(error, "error");
    }
  }, [error, showSnackbar]);

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
        width: "450px",
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
          sx={{ width: "200px", m: 1 }}
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
                      <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "flex-end",
        
                        
                      }}
                      >

                      <IconButton
                        onClick={(event) => handleOpenDialog(task._id, event)}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton onClick={(event) => handleTaskEditClick(task._id, event)}>
        <EditRoundedIcon />
      </IconButton>


                      </Box>
                     
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
          <Button onClick={() => handleDeleteTask(selectedTaskId, projectId)} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {selectedTask && (
        <TaskModal task={selectedTask} onClose={handleCloseModal} />
      )}
      <CreateTaskModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateTask}
        projectId={projectId}
      />

      {/* EditTaskModal component */}
      {selectedTask && (
        <EditTaskModal
          open={showEditModal}
          onClose={handleCloseEditModal}
          taskData={selectedTask}
          projectId={projectId}
        />
      )}
    </Card>
  );
};

export default TaskList;
