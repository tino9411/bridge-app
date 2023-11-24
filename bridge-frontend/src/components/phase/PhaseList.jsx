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
  LinearProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { StyledCard } from '../../utils/cardUtils';

const PhaseList = ({ projectId }) => {
  const [phases, setPhases] = useState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchPhases = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/projects/${projectId}/phases`);
        setPhases(response.data);
      } catch (err) {
        console.error('Error fetching phases', err);
      }
    };

    fetchPhases();
  }, [projectId]);

  const handleExpandClick = (phaseId) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [phaseId]: !prevExpanded[phaseId]
    }));
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
      <CardHeader title="Phases" />
      <CardContent>
        <List>
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
                  secondary={`Deadline: ${phase.endDate ? new Date(phase.endDate).toLocaleDateString() : 'N/A'}`}
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
      </CardContent>
    </Card>
  );
};

export default PhaseList;
