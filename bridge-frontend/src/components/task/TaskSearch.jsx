import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  Divider,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stack,
  Snackbar,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import TaskCard from "./TaskCard";
import { useTasks } from "../../contexts/TaskContext";

const TaskSearch = () => {
  const {
    searchTasks,
    tasks,
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    handleSnackbarClose,
  } = useTasks();
  const [filters, setFilters] = useState({
    keywords: "",
    categories: "",
    skills: "",
    rateRange: [0, 500],
    location: "",
    timeCommitment: "",
  });

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleSliderChange = (event, newValue) => {
    setFilters({ ...filters, rateRange: newValue });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = () => {
    searchTasks(filters);
  };

  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        flexDirection: isSmallScreen ? "column" : "row",
        justifyContent: "center", // Center the contents
        alignItems: isSmallScreen ? "center" : "flex-start", // Center items vertically on small screens
        gap: isSmallScreen ? 2 : 0, // Add gap between items on small screens
        maxHeight: "auto",
      }}
    >
      <Paper
        sx={{
          p: 2,
          mb: 2,
          marginRight: isSmallScreen ? 0 : 10,
          maxWidth: "100%",
          width: isSmallScreen ? "100%" : "500px",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Search Tasks
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Keywords"
              name="keywords"
              value={filters.keywords}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Categories"
              name="categories"
              value={filters.categories}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Skills"
              name="skills"
              value={filters.skills}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom>
              Rate Range: ${filters.rateRange[0]} - ${filters.rateRange[1]}
            </Typography>
            <Slider
              value={filters.rateRange}
              onChange={handleSliderChange}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={filters.location}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Time Commitment</InputLabel>
              <Select
                value={filters.timeCommitment}
                label="Time Commitment"
                name="timeCommitment"
                onChange={handleChange}
              >
                <MenuItem value="part-time">Part-Time</MenuItem>
                <MenuItem value="full-time">Full-Time</MenuItem>
                <MenuItem value="freelance">Freelance</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "right" }}>
            <Button variant="contained" color="primary" onClick={handleSearch}>
              Search
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Paper
        sx={{
          p: 2,
          mb: 2,
          maxWidth: "100%",
          width: isSmallScreen ? "100%" : "700px",
        }}
      >
        <Box
  sx={{
    mb: 2,
    p: 2,
    overflowY: "auto",
    maxHeight: isSmallScreen ? "calc(100vh - 350px)" : "calc(100vh - 100px)", // Adjust if needed
    maxWidth: "100%",
    pb: isSmallScreen ? 20 : 5, // Increase padding at the bottom
  }}
>
  <Stack direction="column" spacing={1} sx={{ mb: 3 }}>
    {tasks
      .filter((task) => !task.assignee) // Filter tasks without an assignee
      .map((task) => (
        <TaskCard key={task._id} task={task} />
      ))}
  </Stack>
</Box>

      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{
            width: "100%",
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TaskSearch;
