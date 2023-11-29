import React, { useState, useEffect } from "react";
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

const EditProjectModal = ({ open, onClose, onSubmit, projectData }) => {
  const [editedProject, setEditedProject] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "",
    priority: "",
    budget: 0,
    client: "",
    clientEmail: "",
    clientPhoneNumber: "",
    tags: []
  });

  useEffect(() => {
    // Populate the form with existing project data when the modal is opened
    if (projectData && open) {
      setEditedProject({ ...projectData,
        startDate: projectData?.startDate?.split("T")[0], // Ensure the date is in 'YYYY-MM-DD' format
        endDate: projectData?.endDate?.split("T")[0],
    });
    }
  }, [projectData, open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProject({ ...editedProject, [name]: value });
  };

  const handleTagsChange = (event, value) => {
    setEditedProject({ ...editedProject, tags: value });
  };

  return (
    <StyledModal open={open} onClose={onClose}>
      <StyledCard>
        <CardHeader
          title={<Typography variant="h5">Edit Project</Typography>}
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
              onSubmit(editedProject);
            }}
          >
            <Box sx={{ maxHeight: "800px", overflowY: "auto" }}>
              {/* Form fields similar to CreateProjectModal but using editedProject state */}
              {/* ... */}
              <TextField
                label="Project Name"
                name="name"
                fullWidth
                margin="normal"
                value={editedProject.name}
                onChange={handleInputChange}
                required
              />
              <TextField
                label="Description"
                name="description"
                fullWidth
                margin="normal"
                value={editedProject.description}
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
                value={editedProject.startDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="End Date"
                name="endDate"
                type="date"
                fullWidth
                margin="normal"
                value={editedProject.endDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={editedProject.status}
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
                  value={editedProject.priority}
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
                value={editedProject.budget}
                onChange={handleInputChange}
              />
              {/* Additional fields for risks, budget details, client info, etc. */}
              <TextField
                label="Client"
                name="client"
                fullWidth
                margin="normal"
                value={editedProject.client}
                onChange={handleInputChange}
              />
              <TextField
                label="Client Email"
                name="clientEmail"
                fullWidth
                margin="normal"
                value={editedProject.clientEmail}
                onChange={handleInputChange}
              />
              <TextField
                label="Client Phone Number"
                name="clientPhoneNumber"
                fullWidth
                margin="normal"
                value={editedProject.clientPhoneNumber}
                onChange={handleInputChange}
              />
             <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={editedProject.tags}
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
                Update Project
              </Button>
            </Box>
          </form>
        </CardContent>
      </StyledCard>
    </StyledModal>
  );
};

export default EditProjectModal;
