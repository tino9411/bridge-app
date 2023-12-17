import React, { useState } from 'react';
import { Box, TextField, Select, MenuItem, Button } from '@mui/material';

const RequestFilters = ({ setFilters }) => {
  const [filterData, setFilterData] = useState({
    taskTitle: '',
    taskStatus: ''
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterData({ ...filterData, [name]: value });
  };

  const applyFilters = () => {
    setFilters(filterData);
  };

  return (
    <Box display="flex" gap={2} mb={2}>
      <TextField
        label="Task Title"
        variant="outlined"
        name="taskTitle"
        value={filterData.taskTitle}
        onChange={handleFilterChange}
      />
      <Select
        label="Task Status"
        name="taskStatus"
        value={filterData.taskStatus}
        onChange={handleFilterChange}
        displayEmpty
      >
        <MenuItem value=""><em>None</em></MenuItem>
        <MenuItem value="open">Open</MenuItem>
        <MenuItem value="in progress">In Progress</MenuItem>
        <MenuItem value="on hold">On Hold</MenuItem>
        <MenuItem value="completed">Completed</MenuItem>
      </Select>
      <Button variant="contained" color="primary" onClick={applyFilters}>
        Apply Filters
      </Button>
    </Box>
  );
};

export default RequestFilters;
