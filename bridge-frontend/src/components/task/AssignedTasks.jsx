import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  IconButton,
  Chip,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert

} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { green, orange, red, blue, grey } from "@mui/material/colors";
import AssignedTaskModal from "./AssignedTaskModal";
import axios from "axios";


const TaskAssigned = ({ tasks }) => {
  const [sortField, setSortField] = useState("dueDate"); // default sorting by dueDate
  const [filterStatus, setFilterStatus] = useState(""); // no filter by default
  const [selectedTask, setSelectedTask] = useState(null); // State for the selected task
  const [comments, setComments] = useState([]); // State to store comments
  const [author, setAuthor] = useState(""); // State to store author
  const [error, setError] = useState(""); // State to store error

  // Define a theme object or use ThemeProvider to globally define these
  const theme = {
    status: {
      "open": blue[500],
      "in progress": orange[500],
      "completed": green[500],
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

  // Handler for changing sort field
  const handleSortChange = (event) => {
    setSortField(event.target.value);
  };

  // Handler for changing filter status
  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  // Sorting function
  const sortTasks = (a, b) => {
    if (sortField === "rate") {
      return (a.rate || 0) - (b.rate || 0); // Handle null values
    } else if (sortField === "dueDate") {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    // Add other sorting logic here
  };

  // Filtering function
  const filterTasks = (task) => {
    return filterStatus ? task.status === filterStatus : true;
  };

  // Apply sorting and filtering
  const sortedAndFilteredTasks = tasks
    .filter(filterTasks)
    .sort(sortTasks)
    .reduce((acc, task) => {
      const projectName = task.project.name;
      if (!acc[projectName]) {
        acc[projectName] = [];
      }
      acc[projectName].push(task);
      return acc;
    }, {});

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task); // Set the selected task
  };

  const handleCloseModal = () => {
    setSelectedTask(null); // Reset the selected task when the modal is closed
  };

 // Function to fetch comments from the database
const fetchComments = async () => {
    try {
      const token = localStorage.getItem("token"); // Replace with your token retrieval method
      const response = await axios.get(
        `http://localhost:3000/tasks/${selectedTask._id}/comments`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure the API requires authorization
          },
        }
      );
  
      // Parse each comment to extract the username from the author object
      const parsedComments = response.data.map(comment => ({
        ...comment,
        author: comment.author.username, // Replace the author object with just the username
      }));
  
      setComments(parsedComments); // Set the parsed comments to state
    } catch (err) {
        setError(err.response?.data?.error || "Error fetching comments");
    }
  };
  

  useEffect(() => { 
    if (selectedTask) {
        fetchComments();
    }
}, [selectedTask]);

  

  //Function to set author as user's username
  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:3000/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAuthor(response.data.username);
    } catch (err) {
      console.error("Failed to fetch user info", err);
    }
  };

useEffect(() => {
    fetchCurrentUser();
}, []);

const addComment = async (commentData) => {
    try {
      const token = localStorage.getItem("token"); // Replace with your token retrieval method
      // Submit the new comment to the server
      await axios.post(`http://localhost:3000/tasks/${selectedTask._id}/comments`, commentData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the authorization header
        },
      });
      // If successful, you may want to fetch comments again to update the list
    } catch (err) {
      // If unsuccessful, display an error message
      setError(err.response?.data?.error || "Error adding comment");
    } 
  };
  

  // Function to add a new comment to state and to the database
const handleAddComment = (newCommentText) => {
    const newComment = {
      author: author,
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

  return (
    <Card
      sx={{
        maxHeight: "400px",
        display: "flex",
        flexDirection: "column",
        boxShadow: 3,
        borderRadius: 5,
      }}
    >
      <CardHeader
        title="Assigned Tasks"
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
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
      <List dense sx={{ overflowY: "auto", padding: 0, margin: 0 }}>
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
                                bgcolor: theme.status[task.status],
                                color: "common.white",
                                m: 0.1,
                                fontSize: "0.6rem",
                              }}
                            />{" "}
                            <Chip
                              label={task.priority}
                              size="small"
                              sx={{
                                bgcolor: theme.priority[task.priority],
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
      {/* Render the Modal */}
      {selectedTask && (
        <AssignedTaskModal
          task={selectedTask}
          open={!!selectedTask}
          onClose={handleCloseModal}
          commentsData={comments} // Pass comments to the modal
          addComment={handleAddComment} // Pass function to add comment
          deleteComment={handleDeleteComment} // Pass function to delete comment
        />
      )}
      {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}
    </Card>
  );
};

export default TaskAssigned;
