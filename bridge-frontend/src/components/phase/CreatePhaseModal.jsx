import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
  TextField,
  Button,
  Box,
  Autocomplete,
  Select,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { StyledModal } from "../../utils/modalUtils";
import axios from "axios";
import PhaseContext from "./PhaseContext";

const CreatePhaseModal = ({ open, onClose }) => {
  const { projectId, newPhase, setNewPhase, handleCreatePhaseSubmit } =
    useContext(PhaseContext);

  const [availableTasks, setAvailableTasks] = useState([]);
  const [selectedTaskCount, setSelectedTaskCount] = useState(0);

  useEffect(() => {
    if (newPhase.startDate && newPhase.endDate) {
      fetchTasksForPhase();
    }
  }, [newPhase.startDate, newPhase.endDate, projectId]);

  const fetchTasksForPhase = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/projects/${projectId}/tasks`,
        {
          params: {
            startDate: newPhase.startDate,
            endDate: newPhase.endDate,
          },
        }
      );
      setAvailableTasks(
        response.data.filter(
          (task) =>
            new Date(task.dueDate) >= new Date(newPhase.startDate) &&
            new Date(task.dueDate) <= new Date(newPhase.endDate)
        )
      );
    } catch (err) {
      console.error("Error fetching tasks for phase", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPhase({ ...newPhase, [name]: value });
  };

  const handleTaskSelection = (event, newValue) => {
    setNewPhase({
      ...newPhase,
      assignedTasks: newValue.map((task) => task._id),
    });
    setSelectedTaskCount(newValue.length); // Update the selected task count
  };

  return (
    <StyledModal open={open} onClose={onClose}>
      <Card>
        <CardHeader
          title={<Typography variant="h6">Create New Phase</Typography>}
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
              handleCreatePhaseSubmit(newPhase);
            }}
          >
            <TextField
              label="Phase Name"
              name="name"
              fullWidth
              margin="normal"
              value={newPhase.name}
              onChange={handleInputChange}
              required
            />

            <TextField
              label="Start Date"
              name="startDate"
              type="date"
              fullWidth
              margin="normal"
              value={newPhase.startDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="End Date"
              name="endDate"
              type="date"
              fullWidth
              margin="normal"
              value={newPhase.endDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />

            <Select
              label="Status"
              name="status"
              fullWidth
              margin="normal"
              value={newPhase.status}
              onChange={handleInputChange}
              required
            >
              {/* Update with actual status options */}
              <MenuItem value="planned">Planned</MenuItem>
              <MenuItem value="in progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>

            <Autocomplete
              multiple
              options={availableTasks}
              getOptionLabel={(option) => option.title}
              onChange={handleTaskSelection}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Assign Tasks"
                  placeholder="Select tasks"
                />
              )}
              sx={{ my: 2 }}
            />
            <Typography variant="body2" sx={{ mt: 1 }}>
              {selectedTaskCount} task{selectedTaskCount !== 1 ? "s" : ""}{" "}
              selected
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button variant="contained" type="submit">
                Create Phase
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </StyledModal>
  );
};

export default CreatePhaseModal;
