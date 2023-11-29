import React, { useState } from "react";
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

const CreateProjectModal = ({ open, onClose, onSubmit, users, phases }) => {
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    startDate: new Date().toISOString().split("T")[0], // Default to today's date
    endDate: new Date().toISOString().split("T")[0], // Default to today's date
    status: "planning",
    priority: "low",
    budget: 0,
    client: "",
    clientEmail: "",
    clientPhoneNumber: "",
    tags: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const handleTagsChange = (event, value) => {
    setNewProject({ ...newProject, tags: value });
  };

  return (
    <StyledModal open={open} onClose={onClose}>
      <StyledCard>
        <CardHeader
          title={<Typography variant="h5">Create New Project</Typography>}
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
              onSubmit(newProject);
            }}
          >
            <Box sx={{ maxHeight: "800px", overflowY: "auto" }}>
              <TextField
                label="Project Name"
                name="name"
                fullWidth
                margin="normal"
                value={newProject.name}
                onChange={handleInputChange}
                required
              />
              <TextField
                label="Description"
                name="description"
                fullWidth
                margin="normal"
                value={newProject.description}
                onChange={handleInputChange}
                multiline
                rows={4}
              />
              <TextField
                label="Start Date"
                name="startDate"
                type="date"
                fullWidth
                margin="normal"
                value={newProject.startDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="End Date"
                name="endDate"
                type="date"
                fullWidth
                margin="normal"
                value={newProject.endDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={newProject.status}
                  onChange={handleInputChange}
                  label="Status"
                >
                  <MenuItem value="planning">Planning</MenuItem>
                  <MenuItem value="in progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="on hold">On Hold</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Priority</InputLabel>
                <Select
                  name="priority"
                  value={newProject.priority}
                  onChange={handleInputChange}
                  label="Priority"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Budget"
                name="budget"
                type="number"
                fullWidth
                margin="normal"
                value={newProject.budget}
                onChange={handleInputChange}
              />
              {/* Additional fields for risks, budget details, client info, etc. */}
              <TextField
                label="Client"
                name="client"
                fullWidth
                margin="normal"
                value={newProject.client}
                onChange={handleInputChange}
              />
              <TextField
                label="Client Email"
                name="clientEmail"
                fullWidth
                margin="normal"
                value={newProject.clientEmail}
                onChange={handleInputChange}
              />
              <TextField
                label="Client Phone Number"
                name="clientPhoneNumber"
                fullWidth
                margin="normal"
                value={newProject.clientPhoneNumber}
                onChange={handleInputChange}
              />
             <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={newProject.tags}
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
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button variant="contained" type="submit">
                Create Project
              </Button>
            </Box>
          </form>
        </CardContent>
      </StyledCard>
    </StyledModal>
  );
};

export default CreateProjectModal;
