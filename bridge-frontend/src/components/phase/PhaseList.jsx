import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Collapse,
  Box,
  LinearProgress,
  Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CreatePhaseModal from './CreatePhaseModal'; // Import the CreatePhaseModal component
import TaskAssignModal from './TaskAssignModal';
import { StyledCard } from '../../utils/cardUtils';

const PhaseList = ({ projectId }) => {
  const [phases, setPhases] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false); // State for CreatePhaseModal visibility
  const [showTaskAssignModal, setShowTaskAssignModal] = useState(false);
  const [selectedPhaseId, setSelectedPhaseId] = useState(null);

  useEffect(() => {
    fetchPhases();
  }, [projectId]);

  const fetchPhases = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/projects/${projectId}/phases`);
      setPhases(response.data);
    } catch (err) {
      console.error('Error fetching phases', err);
    }
  };

  const handleExpandClick = (phaseId) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [phaseId]: !prevExpanded[phaseId]
    }));
  };

  const handleCreatePhaseSubmit = async (newPhaseData) => {
    try {
      await axios.post(`http://localhost:3000/projects/${projectId}/phases`, newPhaseData);
      fetchPhases(); // Refresh the list of phases
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error creating phase', err);
    }
  };

  const openTaskAssignModal = (phaseId) => {
    setSelectedPhaseId(phaseId);
    setShowTaskAssignModal(true);
  };

  return (
    <Card sx={{
      height: "100%",
      maxHeight: "450px",
      maxWidth: "500px",
      display: "flex",
      flexDirection: "column",
      boxShadow: 3,
      borderRadius: 5,
    }}>
      <CardHeader title="Phases" 
        action={
          <IconButton aria-label="add-phase"
          onClick={() => setShowCreateModal(true)}
          >
         
            <AddRoundedIcon />
          </IconButton>}
      titleTypographyProps={{ variant: "h6", align: "center" }}/>
      <CardContent>
        <List sx={{
          width: '100%',
          bgcolor: 'background.paper',
          overflow: 'auto',
          maxHeight: 300,
      
        }}>
          {phases.map((phase) => (
            <React.Fragment key={phase._id}>
              <ListItem
                secondaryAction={
                  <IconButton onClick={() => handleExpandClick(phase._id)}>
                    <ExpandMoreIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={phase.name}
                  secondary={
                    <React.Fragment>
                      Deadline: {phase.endDate ? new Date(phase.endDate).toLocaleDateString() : 'N/A'}
                      {/* Display task count in a Chip */}
                      <Chip 
                        label={`${phase.assignedTasks.length} Task${phase.assignedTasks.length !== 1 ? 's' : ''}`} 
                        size="small" 
                        sx={{ ml: 1 }} 
                      />
                       <IconButton onClick={() => openTaskAssignModal(phase._id)}>
                  <AddRoundedIcon /> {/* Change the icon as needed */}
                </IconButton>
                    </React.Fragment>
                  }
                  
                />
                
              </ListItem>
              <Collapse in={expanded[phase._id]} timeout="auto" unmountOnExit>
                <Box sx={{ pl: 4, pr: 2, pb: 2 }}>
                  <Typography variant="subtitle1">Milestones</Typography>
                  {phase.milestones.map((milestone) => (
                    <Box key={milestone._id} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        {milestone.title}
                      </Typography>
                      <LinearProgress variant="determinate" value={milestone.progress} sx={{ width: '50%' }} />
                    </Box>
                  ))}
                </Box>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
         {/* Task Assignment Modal */}
  {showTaskAssignModal && (
    <TaskAssignModal
      open={showTaskAssignModal}
      onClose={() => setShowTaskAssignModal(false)}
      projectId={projectId}
      phaseId={selectedPhaseId}
      onTaskAssigned={fetchPhases} // Refresh phases list after task assignment
    />
  )}
        <CreatePhaseModal 
          open={showCreateModal} 
          onClose={() => setShowCreateModal(false)} 
          onSubmit={handleCreatePhaseSubmit}
          projectId={projectId}
        />
      </CardContent>
    </Card>
  );
};

export default PhaseList;
