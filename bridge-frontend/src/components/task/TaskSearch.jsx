import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography, Grid, Divider, Slider, FormControl, InputLabel, Select, MenuItem, Chip, Stack } from '@mui/material';
import TaskCard from './TaskCard';
import { useTasks } from '../../contexts/TaskContext';

const TaskSearch = () => {
  const { searchTasks, tasks } = useTasks();
  const [filters, setFilters] = useState({
    keywords: '',
    categories: '',
    skills: '',
    rateRange: [0, 500],
    location: '',
    timeCommitment: ''
  });

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
    <Box sx={{ p: 2, display: "flex", flexDirection: "row", justifyContent: "space-evenly", maxHeight: "auto" }}>
      <Paper sx={{ p: 2, mb: 2, maxWidth: "500px" }}>
        <Typography variant="h6" gutterBottom>Search Tasks</Typography>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth label="Keywords" name="keywords" value={filters.keywords} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth label="Categories" name="categories" value={filters.categories} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth label="Skills" name="skills" value={filters.skills} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom>Rate Range: ${filters.rateRange[0]} - ${filters.rateRange[1]}</Typography>
            <Slider value={filters.rateRange} onChange={handleSliderChange} valueLabelDisplay="auto" min={0} max={1000} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Location" name="location" value={filters.location} onChange={handleChange} />
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
          <Grid item xs={12} sx={{ textAlign: 'right' }}>
            <Button variant="contained" color="primary" onClick={handleSearch}>
              Search
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Paper sx={{ p: 2, mb: 2, width: "700px" }}>
      <Box sx={{ 
        mb: 2,
        p: 2,
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 100px)',
        maxWidth: '100%',
         }}>
      <Stack direction="column" spacing={1} sx={{ mb: 2}}>
        {tasks.map(task => <TaskCard key={task._id} task={task} />)}
      </Stack>
      </Box>
      </Paper>
    </Box>
  );
};

export default TaskSearch;
