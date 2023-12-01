import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Chip, CardHeader, CardActions, Stack, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { useTasks } from '../../contexts/TaskContext';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

import { format } from 'date-fns';

const TaskCard = ({ task }) => {
  const { requestToJoinTask } = useTasks();
  const [openDialog, setOpenDialog] = useState(false);
  const [joinMessage, setJoinMessage] = useState('');

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
      'open': { icon: <HourglassEmptyIcon />, label: 'Open', color: 'primary' },
      'in progress': { icon: <WorkOutlineIcon />, label: 'In Progress', color: 'warning' },
      'completed': { icon: <CheckCircleOutlineIcon />, label: 'Completed', color: 'success' }
    };
    return statusProps[status] || { icon: null, label: 'Unknown', color: 'default' };
  };
  const formattedDueDate = task.dueDate ? format(new Date(task.dueDate), 'PPP') : 'No Due Date';
  const { icon, label, color } = getStatusChip(task.status);

  return (
    <Card sx={{ 
      maxWidth: 900,  
      flexGrow: 1, // Take up all the available space
        boxShadow: 3,
        "&:hover": { transform: "translateY(-5px)", boxShadow: 8 },
        m: 1, // Margin to ensure space around the card
        display: "flex",
        flexDirection: "column", // Stack children vertically
        justifyContent: "space-between", // Distribute space around items
      }}>
      <CardHeader 
        title={task.title}
        subheader={`Category: ${task.category || 'Not Specified'}`}
        avatar={icon}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {task.description}
        </Typography>
        <Stack direction="row" spacing={5} sx={{ mb: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Due Date: {formattedDueDate}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Rate: ${task.rate || 'Not Specified'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Time Commitment: {task.timeCommitment || 'Not Specified'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Location: {task.location || 'Not Specified'}
        </Typography>
          {task.skillsNeeded.map(skill => (
            <Chip key={skill} label={skill} variant="outlined" size="small" />
          ))}
        </Stack>
        <Chip label={label} color={color} size="small" />
      </CardContent>
      <CardActions>
  <Button
    variant="outlined"
    startIcon={<GroupAddIcon />}
    onClick={handleOpenDialog}
  >
    Request to Join
  </Button>
</CardActions>


      {/* Dialog for Join Request */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Request to Join Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To request to join this task, please enter a brief message to the project manager.
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
