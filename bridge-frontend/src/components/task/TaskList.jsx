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
  Alert, } from "@mui/material";
import TaskModal from "./TaskModal";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { formatDate } from "../../utils/dateUtils";
import { useTheme } from "@mui/material/styles";
import { sortTasks, filterTasks } from "../../utils/taskUtils";
import useFetchData from "../../hooks/useFetchData";
import useComments from "../../hooks/useComments";
import CreateTaskModal from "./CreateTaskModal"; // Import the modal component

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [sortField, setSortField] = useState("dueDate"); // default sorting by dueDate
  const [filterStatus, setFilterStatus] = useState(""); // no filter by default
  const [selectedTask, setSelectedTask] = useState(null);
  const token = localStorage.getItem("token"); // Replace with your token retrieval method
  const [error, setError] = useState("");
  const { data: currentUser, error: userError } = useFetchData("http://localhost:3000/users/profile", token);
  const [comments, setComments] = useComments(selectedTask ? selectedTask._id : null, token);
  const { projectId } = useParams();
  const theme = useTheme();
  const [showCreateModal, setShowCreateModal] = useState(false); // State to control the modal visibility


   // Handler for changing sort field
   const handleSortChange = (event) => {
    setSortField(event.target.value);
  };

  // Handler for changing filter status
  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };


// Inside your component
const sortedAndFilteredTasks = tasks 
? sortTasks(filterTasks(tasks, filterStatus), sortField)
  .reduce((acc, task) => {
    const projectName = task.project.name;
    if (!acc[projectName]) {
      acc[projectName] = [];
    }
    acc[projectName].push(task);
    return acc;
  }, {})
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

    if(response.data) {
      setTasks([...tasks, response.data]);
    }

    setShowCreateModal(false); // Close the modal
  } catch (err) {
    setError(err.response?.data?.error || "Error creating task");
    console.error("Task creation error:", err.response || err);
  }
};


const addComment = async (commentData) => {
  try {
    const token = localStorage.getItem("token"); // Replace with your token retrieval method
    // Submit the new comment to the server
    await axios.post(
      `http://localhost:3000/tasks/${selectedTask._id}/comments`,
      commentData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include the authorization header
        },
      }
    );
    // If successful, you may want to fetch comments again to update the list
  } catch (err) {
    // If unsuccessful, display an error message
    setError(err.response?.data?.error || "Error adding comment");
  }
};

// Function to add a new comment to state and to the database
const handleAddComment = (newCommentText) => {
  const newComment = {
    author: currentUser.username,
    content: newCommentText,
  };

  const updatedComments = [...comments, newComment];
  setComments(updatedComments); // Update local state
  addComment({ content: newCommentText }); // Send the correct object structure to the API
};

// Function to delete a comment
const handleDeleteComment = (commentId) => {
  const updatedComments = comments.filter(
    (comment) => comment.id !== commentId
  );
  setComments(updatedComments);
};



  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/projects/${projectId}/tasks`);
        setTasks(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.error : "Error fetching tasks");
      }
    };

    fetchTasks();
  }, [projectId]);

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Card sx={{
      maxHeight: "450px",
      maxWidth: "400px",
      display: "flex",
      flexDirection: "column",
      boxShadow: 3,
      borderRadius: 5,
      mb: 2
    }}>
      <CardHeader title="Task List" 
       action={
          <IconButton aria-label="add-task"
          onClick={() => setShowCreateModal(true)} // Open the modal
          >
         
            <AddRoundedIcon />
          </IconButton>
        }
      titleTypographyProps={{ variant: "h6", align: "center" }} />
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
      <List dense sx={{ overflowY: "auto", padding: 0, margin: 0, maxHeight: '400px'  }}>
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
                    </Box>
                  </ListItem>
                  <Divider variant="middle" sx={{ bgcolor: "grey.800" }} />
                </React.Fragment>
              ))}
            </ul>
          </li>
        ))}
      </List>
      {selectedTask && <TaskModal 
      task={selectedTask} 
      onClose={handleCloseModal} 
      commentsData={comments} // Pass comments to the modal
      addComment={handleAddComment} // Pass function to add comment
      deleteComment={handleDeleteComment} // Pass function to delete comments

      />}
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
