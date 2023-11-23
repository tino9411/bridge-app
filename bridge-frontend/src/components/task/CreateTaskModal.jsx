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
  Autocomplete
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { StyledCard } from '../../utils/cardUtils';
import { StyledModal } from "../../utils/modalUtils";

const CreateTaskModal = ({ open, onClose, onSubmit }) => {
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'open',
    priority: 'low',
    skillsNeeded: [],
    assignee: '',
    dueDate: '',
    rate: 0,
    phase: '',
    files: [],
  });

  // Define skills for selection (could be fetched or predefined)
  const skills = ['JavaScript', 'React', 'Node.js', 'Python'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleSkillChange = (event, newValue) => {
    setNewTask({ ...newTask, skillsNeeded: newValue });
  };

  // File input change handler
  const handleFileChange = (e) => {
    // For simplicity, storing the FileList in state
    setNewTask({ ...newTask, files: e.target.files });
  };


  return (
    <StyledModal 
    open={open} 
    onClose={onClose}
    >
      <Card sx={{ /* styling */ }}>
        <CardHeader
          title={<Typography variant="h6">Create New Task</Typography>}
          action={<IconButton onClick={onClose}><CloseIcon /></IconButton>}
        />
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); onSubmit(newTask); }}>
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
              options={skills}
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

            {/* Date, Phase, Rate, and File upload fields */}
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

            <TextField
              label="Phase"
              name="phase"
              fullWidth
              margin="normal"
              value={newTask.phase}
              onChange={handleInputChange}
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
              style={{ display: 'none' }}
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

           <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
  
              <Button variant="contained" type="submit">
                Create
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </StyledModal>
  );
};

export default CreateTaskModal;
