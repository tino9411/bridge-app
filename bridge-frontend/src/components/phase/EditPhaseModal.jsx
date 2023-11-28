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
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { StyledModal } from "../../utils/modalUtils";
import PhaseContext from "./PhaseContext";

const EditPhaseModal = ({ open, onClose, phaseToEdit }) => {
  const { handleUpdatePhaseSubmit } = useContext(PhaseContext);
  const [phase, setPhase] = useState({ ...phaseToEdit });

  useEffect(() => {
    if (open) {
      setPhase({
        ...phaseToEdit,
        startDate: phaseToEdit?.startDate?.split("T")[0], // Ensure the date is in 'YYYY-MM-DD' format
        endDate: phaseToEdit?.endDate?.split("T")[0],
      });
    }
  }, [open, phaseToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPhase({ ...phase, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdatePhaseSubmit(phase);
  };
  return (
    <StyledModal open={open} onClose={onClose}>
      <Card>
        <CardHeader
          title={<Typography variant="h6"
          sx={{
            borderBottom: "1px solid #ddd",
          }}
          >Edit Phase</Typography>}
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

            <Select
              label="Status"
              name="status"
              fullWidth
              margin="normal"
              value={phase.status}
              onChange={handleInputChange}
              required
            >
              {/* Update with actual status options */}
              <MenuItem value="planned">Planned</MenuItem>
              <MenuItem value="in progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>

            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Milestones:
            </Typography>
            <List>
              {phase?.milestones?.map((milestone, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={milestone.title}
                    secondary={`Progress: ${milestone.progress}%`}
                  />
                </ListItem>
              ))}
            </List>

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
