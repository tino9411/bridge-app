import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import TaskList from '../task/TaskList';
import PhaseList from '../phase/PhaseList'; 
import { Container, Box, Typography, Button, Paper, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '@mui/material/styles';
import typographyStyles from '../../utils/typographyStyles';
import { useAuth } from '../../hooks/useAuth';
import { useProjects } from '../../contexts/ProjectContext';
import LoadingSpinner from '../common/LoadingSpinner'; // Import the LoadingSpinner component
import Snackbar from '@mui/material/Snackbar';
import {formatDate} from '../../utils/dateUtils';

const Project = () => {
  const { projectId } = useParams();
  const { user, token } = useAuth();
  const [error, setError] = useState(null);
  const { projects, fetchProjects, snackbarOpen, snackbarMessage, snackbarSeverity, handleSnackbarClose } = useProjects();
  const theme = useTheme();

  useEffect(() => {
    if (user) {
      fetchProjects(token);
    }
  }, [user, token]);

  const project = projects.find(p => p._id === projectId);

  if (!project) {
    return <LoadingSpinner />;
  }

  return (
    <Container maxWidth="x-lg" sx={{ my: 3, flexGrow: 1, p: 2, height: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2,  }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} component={Link} to="/dashboard">
          Back to Dashboard
        </Button>
        <Button variant="contained" startIcon={<EditIcon />} component={Link} to={`/edit-project/${project?._id}`}>
          Edit Project
        </Button>
      </Box>

      {error && <Typography color="error">{error}</Typography>}

      <Paper 
      sx={{ 
        p: 2, 
        mb: 3,
        borderRadius: 5,
        
         }}>
        <Typography variant="h4" gutterBottom>{project?.name}</Typography>
        <Box sx={ typographyStyles.projectDescription }>
       
        <Typography variant='body2'>
        {project?.description}
        </Typography>
       
        </Box>
        <Box>
       
        <Typography variant="body1"><strong>Start Date: </strong> {formatDate(project?.startDate)}
        </Typography>
        <Typography variant="body1"
        sx={typographyStyles.projectDate}><strong>End Date: </strong> {formatDate(project?.endDate)}
        </Typography>
        <Typography variant="body1"
        sx={typographyStyles.projectStatus}>
          <strong>Status:</strong>
          <Chip size="small" label={project?.status} sx={{ bgcolor: theme.palette.statusProject[project?.status.toLowerCase()], color: 'common.white', ml: 1, }} />
        </Typography>
        <Typography variant="body1"
        sx={typographyStyles.projectPriority}>
          <strong>Priority:</strong>
          <Chip size="small" label={project?.priority} sx={{ bgcolor: theme.palette.priority[project?.priority.toLowerCase()], color: 'common.white', ml: 1, }} />
          <Typography variant="body1"><strong>Budget:</strong> ${project?.budget.toLocaleString()}</Typography>
        </Typography>
        ,</Box>
        <Box>
       
        
       
        </Box>
        
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', overflowY: 'auto', p: 2}}>
        <Box sx={{ flex: 1, mr: 2 }}>
          {/* Place other project-specific components here if needed */}
          <PhaseList projectId={project?._id} /> {/* Integrate PhaseList here */}
        </Box>
        <Box sx={{ flex: 1, mr: 2 }}>
          {/* Place other project-specific components here if needed */}
        </Box>
        <Box sx={{ flex: 1, mr: 2 }}>
          {/* Place other project-specific components here if needed */}
        </Box>
        
        <Box sx={{ flex: 1, maxHeight: 'auto',mr: 2 }}>
          <TaskList 
          projectId={project?._id}
          
          />
        </Box>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </Container>
  );
};

export default Project;
