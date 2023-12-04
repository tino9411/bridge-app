import React, { useState, useEffect, useContext } from "react";
import {
  CardContent,
  CardHeader,
  IconButton,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Autocomplete,
  Chip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { StyledCard } from "../../utils/cardUtils";
import { StyledModal } from "../../utils/modalUtils";
import { useTasks } from "../../contexts/TaskContext";
import axios from "axios";
import skillsData from "../user/skills";
import { Form } from "react-router-dom";

const EditTaskModal = ({ open, onClose, taskData, projectId }) => {
  const { updateTask, addHistoryLogToTask } = useTasks();
  const [editedTask, setEditedTask] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    dueDate: "",
    assignee: "",
    rate: 0,
    skillsNeeded: [],
    tags: [],
    location: "",
    timeCommitment: "",
    phase: "",
    files: []
    // Add other relevant fields as necessary
  });

  useEffect(() => {
    if (taskData && open) {
      setEditedTask({
        ...taskData,
        dueDate: taskData.dueDate?.split("T")[0],
        phase: taskData.phase?._id || null,
        skillsNeeded: taskData.skillsNeeded.map(skill => skill), // Only use skill names
        tags: taskData.tags || []
      });
    }
  }, [taskData, open, projectId]);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  const handleSkillChange = (event, newValue) => {
    // Convert selected skills to an array of skill names
    const selectedSkills = newValue.map(skill => skill.skill);
    setEditedTask({ ...editedTask, skillsNeeded: selectedSkills });
  };
  

  const handleTagsChange = (event, newValue) => {
    setEditedTask({ ...editedTask, tags: newValue });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTask(editedTask._id, editedTask, projectId);
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error updating task:", error);
      // Handle error appropriately
    }
  };

  const allSkills = skillsData.reduce((acc, categoryItem) => {
    const categorySkills = categoryItem.skills.map((skill) => ({
      label: `${skill} (${categoryItem.category})`,
      category: categoryItem.category,
      skill,
    }));
    return [...acc, ...categorySkills];
  }, []);

  return (
    <StyledModal open={open} onClose={onClose}>
      <StyledCard>
        <CardHeader
          title={<Typography variant="h5">Edit Task</Typography>}
          action={
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          }
        />
        <CardContent>
        
          <form onSubmit={handleFormSubmit}>
          <Box sx={{overflowY: 'auto', height: '850px'}}>
            <TextField
              label="Title"
              name="title"
              fullWidth
              margin="normal"
              value={editedTask.title}
              onChange={handleInputChange}
              required
            />
            <TextField
              label="Description"
              name="description"
              fullWidth
              margin="normal"
              value={editedTask.description}
              onChange={handleInputChange}
              multiline
              rows={4}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={editedTask.priority}
                onChange={handleInputChange}
                label="Priority"
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
            <Autocomplete
  multiple
  options={allSkills.sort((a, b) => -b.category.localeCompare(a.category))}
  groupBy={(option) => option.category}
  getOptionLabel={(option) => option.skill}
  value={editedTask.skillsNeeded.map(skill => allSkills.find(s => s.skill === skill) || '')} // Map skill names back to full objects for Autocomplete
  onChange={handleSkillChange}
  renderInput={(params) => (
    <TextField {...params} label="Skills Needed" placeholder="Add skills" />
  )}
  sx={{ my: 2 }}
/>
            <TextField
              label="Due Date"
              name="dueDate"
              type="date"
              fullWidth
              margin="normal"
              value={editedTask.dueDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />
             <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                    name="status"
                    value={editedTask.status}
                    onChange={handleInputChange}
                    label="Status"
                >
                    <MenuItem value="open">Open</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
                <InputLabel>Priority</InputLabel>
                <Select
                  name="priority"
                  value={editedTask.priority}
                  onChange={handleInputChange}
                  label="Priority"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            <TextField
              label="Rate"
              name="rate"
              type="number"
              fullWidth
              margin="normal"
              value={editedTask.rate}
              onChange={handleInputChange}
            />
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={editedTask.tags}
              onChange={handleTagsChange}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} label="Tags" placeholder="Add tags" />
              )}
              sx={{ my: 2 }}
            />
            <TextField
              label="Location"
              name="location"
              fullWidth
              margin="normal"
              value={editedTask.location}
              onChange={handleInputChange}
            />
            <FormControl fullWidth margin="normal">
                <InputLabel>Time Commitment</InputLabel>
                <Select
                    name="timeCommitment"
                    value={editedTask.timeCommitment}
                    onChange={handleInputChange}
                    label="Time Commitment"
                >
                    <MenuItem value="part-time">Part-Time</MenuItem>
                    <MenuItem value="fulltime">Full-Time</MenuItem>
                    <MenuItem value="freelancer">Freelancer</MenuItem>
                </Select>
            </FormControl>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button variant="contained" type="submit">
                Update Task
              </Button>
            </Box>
          </form>
         
        </CardContent>
      </StyledCard>
    </StyledModal>
  );
};

export default EditTaskModal;
