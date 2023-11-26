//CreateTaskModal.jsx
import React, { useState } from "react";
import {
  Modal,
  Card,
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
  Chip,
  Box,
  Autocomplete,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { StyledCard } from "../../utils/cardUtils";
import { StyledModal } from "../../utils/modalUtils";
import { useEffect } from "react";
import axios from "axios";
import skillsData from "../user/skills";

const CreateTaskModal = ({ open, onClose, onSubmit, projectId }) => {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "open",
    priority: "low",
    skillsNeeded: [],
    assignee: "",
    dueDate: "",
    rate: 0,
    phase: "",
    files: [],
  });

  const [phases, setPhases] = useState([]);

  useEffect(() => {
    const fetchPhases = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/projects/${projectId}/phases`
        );
        const filteredPhases = response.data.filter(
          (phase) =>
            newTask.dueDate &&
            new Date(newTask.dueDate) >= new Date(phase.startDate) &&
            new Date(newTask.dueDate) <= new Date(phase.endDate)
        );
        setPhases(filteredPhases);
      } catch (error) {
        console.error("Error fetching phases", error);
      }
    };

    if (newTask.dueDate) {
      fetchPhases();
    }
  }, [newTask.dueDate, projectId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleSkillChange = (event, newValue) => {
    const selectedSkills = newValue.map((item) => item.skill);
    setNewTask({ ...newTask, skillsNeeded: selectedSkills });
  };

  // File input change handler
  const handleFileChange = (e) => {
    // For simplicity, storing the FileList in state
    setNewTask({ ...newTask, files: e.target.files });
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
      <StyledCard
        sx={
          {
            /* styling */
          }
        }
      >
        <CardHeader
          title={<Typography variant="h6">Create New Task</Typography>}
          action={
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          }
        />
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(newTask);
            }}
          >
            <TextField
              label="Title"
              name="title"
              fullWidth
              margin="normal"
              value={newTask.title}
              onChange={handleInputChange}
              required
            />
            <TextField
              label="Description"
              name="description"
              fullWidth
              margin="normal"
              value={newTask.description}
              onChange={handleInputChange}
              multiline
              rows={4}
            />
            {/* Other form fields like status, priority, assignee, etc. */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={newTask.priority}
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
              id="grouped-skills"
              options={allSkills.sort(
                (a, b) => -b.category.localeCompare(a.category)
              )}
              groupBy={(option) => option.category}
              getOptionLabel={(option) => option.skill}
              onChange={handleSkillChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Skills Needed"
                  placeholder="Add skills"
                />
              )}
              sx={{ my: 2 }}
            />

            <TextField
              label="Due Date"
              name="dueDate"
              type="date"
              fullWidth
              margin="normal"
              value={newTask.dueDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />
           <Autocomplete
  options={phases}
  getOptionLabel={(option) => option.name}
  onChange={(event, newValue) => {
    setNewTask({
      ...newTask,
      phase: newValue?._id || null,
    });
  }}
  renderInput={(params) => (
    <TextField {...params} label="Select Phase (Optional)" placeholder="Choose a phase" />
  )}
  sx={{ my: 2 }}
/>

            <TextField
              label="Rate"
              name="rate"
              type="number"
              fullWidth
              margin="normal"
              value={newTask.rate}
              onChange={handleInputChange}
            />
            <input
              accept="*/*"
              style={{ display: "none" }}
              id="raised-button-file"
              multiple
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="raised-button-file">
              <Button variant="contained" component="span" sx={{ mt: 2 }}>
                Upload File(s)
              </Button>
            </label>
            {/* Other fields like dueDate, rate, etc. */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button variant="contained" type="submit">
                Create
              </Button>
            </Box>
          </form>
        </CardContent>
      </StyledCard>
    </StyledModal>
  );
};

export default CreateTaskModal;
