// PhaseListItem.jsx
import React, {useContext} from "react";
import {
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Collapse,
  Box,
  LinearProgress,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import AddTaskRoundedIcon from "@mui/icons-material/AddTaskRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded"; // Import the icon
import PhaseContext from './PhaseContext'; // Adjust the import path as needed

const PhaseListItem = ({ phase, expanded }) => {
    const {
      handleExpandClick,
      openTaskAssignModal,
      openDeletePhaseDialog,
      openEditPhaseDialog
      // You can add other context values here as needed
    } = useContext(PhaseContext);

  return (
    <React.Fragment>
      <ListItem
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
        secondaryAction={
          <IconButton onClick={() => handleExpandClick(phase._id)}>
            <ExpandMoreIcon />
          </IconButton>
        }
      >
        <ListItemText
          primary={phase.name}
          secondary={
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                Deadline:{" "}
                {phase.endDate
                  ? new Date(phase.endDate).toLocaleDateString()
                  : "N/A"}
                <Chip
                  label={`${phase.assignedTasks.length} Task${
                    phase.assignedTasks.length !== 1 ? "s" : ""
                  }`}
                  size="small"
                  sx={{ ml: 1 }}
                />
                <IconButton onClick={() => openTaskAssignModal(phase._id)}>
                  <AddTaskRoundedIcon />
                </IconButton>
                <IconButton onClick={() => openDeletePhaseDialog(phase._id, phase.assignedTasks.length > 0)}>
        <RemoveCircleOutlineRoundedIcon />
      </IconButton>
      <IconButton onClick={() => openEditPhaseDialog(phase)}>
        <EditRoundedIcon />
      </IconButton>
              </Box>
            </>
          }
        />
        <Collapse in={expanded[phase._id]} timeout="auto" unmountOnExit>
          <Box sx={{ pl: 0, pr: 2, pb: 2 }}>
            <Typography variant="subtitle1">Milestones</Typography>
            {phase.milestones.map((milestone) => (
              <Box
                key={milestone._id}
                sx={{ display: "flex", alignItems: "center", mt: 1 }}
              >
                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                  {milestone.title}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={milestone.progress}
                  sx={{ width: "50%" }}
                />
              </Box>
            ))}
          </Box>
        </Collapse>
      </ListItem>
    </React.Fragment>
  );
};

export default PhaseListItem;
