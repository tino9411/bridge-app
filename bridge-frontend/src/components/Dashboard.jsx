// Dashboard.jsx
// Desc: This file contains the Dashboard component which is the main page of the application.
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectCard from './project/ProjectCard';
import { Container, Typography, Grid, Button, Alert, Box } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TaskAssigned from './task/AssignedTasks';
import TeamMembers from './team/TeamMembers';

const Dashboard = ({ onLogout }) => {
  const [projects, setProjects] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [team, setTeam] = useState([]);
  const [error, setError] = useState('');

  // Function to handle project selection change
  const handleProjectChange = (projectId) => {
    setSelectedProjectId(projectId);
    fetchTeamMembers(projectId); // Call a function to fetch team members for the selected project
  };

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:3000/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser(response.data);
    } catch (err) {
      console.error('Failed to fetch user info', err);
    }
  };

  const fetchProjects = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('http://localhost:3000/projects', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(response.data);
      } catch (err) {
        setError(err?.response?.data?.error || 'Error fetching projects');
      }
    }
  };

  const fetchAssignedTasks = async () => {
    if (currentUser) {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:3000/users/assignedTasks/${currentUser.username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssignedTasks(response.data);
      } catch (err) {
        console.error('Failed to fetch assigned tasks', err);
      }
    }
  };

  const fetchTeamMembers = async (projectId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:3000/projects/${projectId}/team`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeam(response.data);
    } catch (err) {
      console.error('Failed to fetch team members', err);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchProjects();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchAssignedTasks();
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedProjectId) {
      fetchTeamMembers(selectedProjectId);
    }
  }, [selectedProjectId]);

  const handleAddProject = () => {
    // ...logic to add a new project
  };

  const deleteProject = (projectId) => {
    const updatedProjects = projects.filter(project => project._id !== projectId);
    setProjects(updatedProjects);
  };

  return (
    <Container maxWidth="x-lg" sx={{overflowY: 'auto'}}>
      <Box my={5}>
        <Typography variant="h3" component="h1" gutterBottom>
          Projects Dashboard
        </Typography>

        <Grid container spacing={30}>
          {/* Projects Column */}
          <Grid item xs={12} md={8}>
            <Button
              variant="contained"
              color="primary"
              size='small'
              startIcon={<AddCircleOutlineIcon />}
              onClick={handleAddProject}
              sx={{ mb: 2 }}
            >
              Create New Project
            </Button>
            {projects.length > 0 ? (
              <Grid container spacing={1}>
                {projects.map((project) => (
                  <Grid item key={project._id} xs={12} sm={6} md={4}>
                    <ProjectCard
                      project={project}
                      onDelete={() => deleteProject(project._id)}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="subtitle1">
                No projects found. Start by creating a new project.
              </Typography>
            )}
          </Grid>

         {/* Tasks and Team Members Column */}
          <Grid item xs={12} md={4}>
            <Box mb={4}> {/* Add bottom margin to create space */}
              <TaskAssigned tasks={assignedTasks} />
            </Box>
            <TeamMembers team={team} projects={projects} onProjectSelect={handleProjectChange} />
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
