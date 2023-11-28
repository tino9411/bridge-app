// EditPhaseModal.jsx
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { StyledModal } from "../../utils/modalUtils";
import axios from "axios";
import PhaseContext from "./PhaseContext";

const EditPhaseModal = ({ open, onClose, phaseToEdit }) => {
  const { projectId, handleUpdatePhaseSubmit } = useContext(PhaseContext);
  const [phase, setPhase] = useState(phaseToEdit || {});
  const [availableTasks, setAvailableTasks] = useState([]);

  useEffect(() => {
    setPhase(phaseToEdit || {});
    if (phaseToEdit?.startDate && phaseToEdit?.endDate) {
      fetchTasksForPhase();
    }
  }, [phaseToEdit, projectId]);

  const fetchTasksForPhase = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/projects/${projectId}/tasks`,
        {
          params: {
            startDate: phase.startDate,
            endDate: phase.endDate,
          },
        }
      );
      setAvailableTasks(response.data);
    } catch (err) {
      console.error("Error fetching tasks for phase", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPhase({ ...phase, [name]: value });
  };

  const handleTaskSelection = (event, newValue) => {
    setPhase({
      ...phase,
      assignedTasks: newValue.map((task) => task._id),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdatePhaseSubmit(phase);
  };

  return (
    <StyledModal open={open} onClose={onClose}>
      <Card>
        <CardHeader
          title={<Typography variant="h6">Edit Phase</Typography>}
          action={
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          }
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Phase Name"
              name="name"
              fullWidth
              margin="normal"
              value={phase.name}
              onChange={handleInputChange}
              required
            />

            <TextField
              label="Start Date"
              name="startDate"
              type="date"
              fullWidth
              margin="normal"
              value={phase.startDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="End Date"
              name="endDate"
              type="date"
              fullWidth
              margin="normal"
              value={phase.endDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />

            <Autocomplete
              multiple
              options={availableTasks}
              getOptionLabel={(option) => option.title}
              value={availableTasks.filter(task =>
                phase.assignedTasks?.includes(task._id))}
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

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button variant="contained" type="submit">
                Update Phase
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </StyledModal>
  );
};

export default EditPhaseModal;
