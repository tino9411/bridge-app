import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import TaskList from '../task/TaskList';
import PhaseList from '../phase/PhaseList'; 
import { Container, Box, Typography, Button, Paper, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '@mui/material/styles';
import typographyStyles from '../../utils/typographyStyles';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner'; // Import the LoadingSpinner component

const Project = () => {
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { projectId } = useParams();
  const { user, token } = useAuth(); // Destructure the needed values from useAuth
  
  const theme = useTheme();

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  const fetchProjectDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Use the token from useAuth
        },
      });
      setProject(response.data);
      setError('');
    } catch (err) {
      if (err.response?.status === 401) {
        // Handle unauthorized error, e.g., by calling a logout function from useAuth or redirecting to login page
        setError('Not authorized. Please login.');
      } else {
        setError(err.response?.data?.error || 'Error fetching project details');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) { // Check if the user is authenticated before fetching project details
      fetchProjectDetails();
    }
  }, [projectId, user, token]); // Add user and token as dependencies

  if (loading) {
    return <LoadingSpinner />; // Use the LoadingSpinner component
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
        <Box sx={{ }}>
        <Typography variant="subtitle1" sx={typographyStyles.projectDates}>
        <Typography variant="body1"
        sx={typographyStyles.projectDate}><strong>Start Date: </strong> {formatDate(project?.startDate)}
        </Typography>
        <Typography variant="body1"
        sx={typographyStyles.projectDate}><strong>End Date: </strong> {formatDate(project?.endDate)}
        </Typography>
        </Typography>
        ,</Box>
        <Box>
        <Typography variant="body1"  sx={ typographyStyles.projectStatusPriority}>
        <Typography variant="body1"
        sx={typographyStyles.projectStatus}>
          <strong>Status:</strong>
          <Chip label={project?.status} sx={{ bgcolor: theme.palette.statusProject[project?.status.toLowerCase()], color: 'common.white', ml: 1, size: "medium" }} />
        </Typography>
        <Typography variant="body1"
        sx={typographyStyles.projectPriority}>
          <strong>Priority:</strong>
          <Chip label={project?.priority} sx={{ bgcolor: theme.palette.priority[project?.priority.toLowerCase()], color: 'common.white', ml: 1, size: "medium" }} />
        </Typography>
        </Typography>
        </Box>
        <Typography variant="body1"><strong>Budget:</strong> ${project?.budget.toLocaleString()}</Typography>
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
    </Container>
  );
};

export default Project;
