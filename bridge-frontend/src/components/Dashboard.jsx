// Dashboard.jsx
// Desc: This file contains the Dashboard component which is the main page of the application.
import React, { useState, useEffect } from "react";
import ProjectCard from "./project/ProjectCard";
import { Container, Typography, Grid, Button, Alert, Box } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import TaskAssigned from "./task/TasksAssigned";
import TeamMembers from "./team/TeamMembers";
import CreateProjectModal from "./project/CreateProjectModal"; // Import the CreateProjectModal component
import EditProjectModal from "./project/EditProjectModal"; // Import the EditProjectModal component
import { useAuth } from "../hooks/useAuth"; // Import useAuth hook
import { useProjects } from "../contexts/ProjectContext";
import { useTeam } from "../contexts/TeamContext";
import { useTasks } from '../contexts/TaskContext';

const Dashboard = ({ onLogout }) => {
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const { token, user } = useAuth();
  const { 
    projects, 
    fetchProjects, 
    deleteProject, 
    addProject,
    updateProject, 
    snackbarOpen, 
    snackbarMessage, 
    snackbarSeverity, 
    handleSnackbarClose } = useProjects();
  const { assignedTasks, fetchAssignedTasks, fetchProjectTasks } = useTasks();
  const { team, fetchTeam } = useTeam(); // Use the useTeam hook
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // State to handle modal visibility
  
  const openCreateModal = () => setIsCreateModalOpen(true);

  // Function to close the create project modal
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProjectToEdit, setCurrentProjectToEdit] = useState(null);


  // Function to handle project selection change
  const handleProjectChange = (projectId) => {
    setSelectedProjectId(projectId);
    setCurrentProjectToEdit(projectId)
  };

  // Function to handle new project submission
  const handleCreateProject = async (projectData) => {
    try {
      await addProject(projectData); // Add project using the context function
      closeCreateModal();
      fetchProjects(); // Fetch updated projects list
    } catch (error) {
      console.error("Error creating project", error);
    }
  };

  // Function to open the edit project modal
  const openEditModal = (project) => {
    setCurrentProjectToEdit(project);
    setIsEditModalOpen(true);
  };

  // Function to close the edit project modal
  const closeEditModal = () => {
    setCurrentProjectToEdit(null);
    setIsEditModalOpen(false);
  };

  // Function to handle project edit submission
  const handleEditProject = async (projectData) => {
    try {
      // Assume updateProject is a method from useProjects context
      await updateProject(currentProjectToEdit._id, projectData, token);
      closeEditModal();
      fetchProjects(token); // Fetch updated projects list
    } catch (error) {
      console.error("Error updating project", error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteProject(projectId);
      fetchProjects(); // Fetch updated projects list
    } catch (error) {
      console.error("Error deleting project", error);
    }
  }

  useEffect(() => {
    if (token) {
      fetchProjects();
    }
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchTeam(selectedProjectId); // Fetch team when selectedProjectId changes
    }
  }, [selectedProjectId]); // Add fetchTeam as a dependency

  useEffect(() => {
    if (user) {
      fetchAssignedTasks(user.username);
    }
  }, [user]); // Add fetchAssignedTasks as a dependency

  if (!user) {
    // Redirect to login or show a message if the user is not authenticated
    // You might also want to call the logout function to clear any invalid auth state
    return (
      <Typography variant="h6">Please login to view the dashboard.</Typography>
    );
  }
  return (
    <Container
      maxWidth="x-lg"
      sx={{ flexGrow: 1, overflowY: "auto", my: 5, m: 0 }}
    >
      <Box my={5}>
        <Typography variant="h3" component="h1" gutterBottom>
          Dashboard
        </Typography>

        <Grid container spacing={2} justifyContent="center"
        sx={{
          height: "auto",
          display: "flex",
          minWidth: "300px",
        }}
        >
          {/* Projects Column */}
          <Grid item xs={12} sm={6} md={8}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<AddCircleOutlineIcon />}
              onClick={openCreateModal}
              sx={{ mb: 2 }}
            >
              Create New Project
            </Button>
            {projects && projects.length > 0 ? (
              <Grid container xs={12} sm={12} md={12} lg={12}
               sx={{
                    minWidth: "300px",
                  }}  
              >
                {projects.map((project) => (
                  <Grid item key={project._id} xs={12} sm={12} md={4} lg={3}>
                    <ProjectCard
                      project={project}
                      onDelete={() => handleDeleteProject(project._id)}
                      openEditModal={openEditModal}
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
          <Grid item xs={12} md={4}
          sx={{
        

          }}
          >
            <Box mb={4}>
              {" "}
              {/* Add bottom margin to create space */}
              <TaskAssigned tasks={assignedTasks} />
            </Box>
            <Box
              mb={4}
              sx={{
                maxHeight: "100%",
              }}
            >
              {" "}
              {/* Add bottom margin to create space */}
              <TeamMembers
                team={team}
                projects={projects}
                onProjectSelect={handleProjectChange}
              />

            </Box>
          </Grid>
        </Grid>
      </Box>
      <CreateProjectModal
        open={isCreateModalOpen}
        onClose={closeCreateModal}
        onSubmit={handleCreateProject}
      />
       <EditProjectModal
        open={isEditModalOpen}
        onClose={closeEditModal}
        onSubmit={handleEditProject}
        projectData={currentProjectToEdit}
      />
       <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          elevation={6}
          variant="filled"
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default Dashboard;
