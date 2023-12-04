import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  CardHeader,
  CardActions,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import { useTasks } from "../../contexts/TaskContext";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";

import { formatDate } from "../../utils/dateUtils"; // Adjust the path as necessary

const TaskCard = ({ task }) => {
  const { requestToJoinTask, updateChecklistItems } = useTasks();
  const [openDialog, setOpenDialog] = useState(false);
  const [joinMessage, setJoinMessage] = useState("");
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleChecklistChange = (index, checked) => {
    let newChecklist = [...task.checklistItems];
    newChecklist[index].isCompleted = checked;
    updateChecklistItems(task._id, newChecklist);
  };

  const handleRequestJoin = () => {
    requestToJoinTask(task._id, joinMessage);
    setOpenDialog(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleJoinMessageChange = (event) => {
    setJoinMessage(event.target.value);
  };

  const getStatusChip = (status) => {
    const statusProps = {
      open: { icon: <HourglassEmptyIcon />, label: "Open", color: "primary" },
      "in progress": {
        icon: <WorkOutlineIcon />,
        label: "In Progress",
        color: "warning",
      },
      completed: {
        icon: <CheckCircleOutlineIcon />,
        label: "Completed",
        color: "success",
      },
    };
    return (
      statusProps[status] || { icon: null, label: "Unknown", color: "default" }
    );
  };
  const formattedDueDate = task.dueDate
    ? formatDate(task.dueDate)
    : "No Due Date"; // Use formatDate utility here

  const { icon, label, color } = getStatusChip(task.status);

  return (
    <Card
      sx={{
        maxWidth: 900,
        flexGrow: 1, // Take up all the available space
        boxShadow: 3,
        "&:hover": { transform: "translateY(-5px)", boxShadow: 8 },
        m: 1, // Margin to ensure space around the card
        display: "flex",
        flexDirection: "column", // Stack children vertically
        justifyContent: "space-between", // Distribute space around items
      }}
    >
      <CardHeader
        title={task.title}
        subheader={`Category: ${task.category || "Not Specified"}`}
        avatar={icon}
      />
      <CardContent>
        <Stack direction="row" spacing={5} sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Due Date: {formattedDueDate}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Rate: ${task.rate || "Not Specified"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Time Commitment: {task.timeCommitment || "Not Specified"}
          </Typography>
        </Stack>
        <Stack direction="column" spacing={1} sx={{ mb: 1 }}>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Skills Needed:{" "}
            {task.skillsNeeded.map((skill) => (
              <Chip key={skill} label={skill} variant="outlined" size="small" />
            ))}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
           Tags: {task.tags.map((tag, index) => (
              <Chip key={index} label={tag} variant="outlined" size="small" />
            ))}
          </Typography>
        </Stack>
        <Chip label={label} color={color} size="small" />
        {task.checklistItems.map((item, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                checked={item.isCompleted}
                onChange={(e) => handleChecklistChange(index, e.target.checked)}
              />
            }
            label={item.text}
          />
        ))}
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
        <Button
          variant="outlined"
          startIcon={<GroupAddIcon />}
          onClick={handleOpenDialog}
        >
          Request to Join
        </Button>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {/* Detailed task information here */}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Location: {task.location || "Not Specified"}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {task.description}
          </Typography>
         {/*  <Typography variant="body2" color="text.secondary">
            History:
          </Typography>
          {task.history.map((log, index) => (
            <Typography key={index} variant="body2">
              {new Date(log.date).toLocaleDateString()} - {log.action}:{" "}
              {log.description}
            </Typography>
          ))} */}
        </CardContent>
      </Collapse>

      {/* Dialog for Join Request */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Request to Join Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To request to join this task, please enter a brief message to the
            project manager.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="joinMessage"
            label="Your Message"
            type="text"
            fullWidth
            variant="standard"
            value={joinMessage}
            onChange={handleJoinMessageChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleRequestJoin}>Send Request</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default TaskCard;
