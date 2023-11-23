// Dashboard.jsx
// Desc: This file contains the Dashboard component which is the main page of the application.
import React, { useState, useEffect } from "react";
import axios from "axios";
import ProjectCard from "./project/ProjectCard";
import { Container, Typography, Grid, Button, Alert, Box } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import TaskAssigned from "./task/AssignedTasks";
import TeamMembers from "./team/TeamMembers";
import { useApiData } from "../hooks/useApiData";
import { handleApiError } from "../utils/handleApiError";

const Dashboard = ({ onLogout }) => {
  const token = localStorage.getItem("token");
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [projects, setProjects, projectsError] = useApiData(
    "http://localhost:3000/projects",
    token
  );
  const [assignedTasks, assignedTasksError] = useApiData(
    `http://localhost:3000/users/assignedTasks/${currentUser?.username}`,
    token,
    [currentUser]
  );
  const [team, teamError] = useApiData(
    `http://localhost:3000/projects/${selectedProjectId}/team`,
    token,
    [selectedProjectId]
  );

  // Function to handle project selection change
  const handleProjectChange = (projectId) => {
    setSelectedProjectId(projectId);
  };

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:3000/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser(response.data);
    } catch (err) {
      console.error("Failed to fetch user info", err);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const handleAddProject = () => {
    // ...logic to add a new project
  };

  const deleteProject = (projectId) => {
    const updatedProjects = projects.filter(
      (project) => project._id !== projectId
    );
    setProjects(updatedProjects);
  };

  return (
    <Container
      maxWidth="x-lg"
      sx={{ flexGrow: 1, overflowY: "auto", my: 5, m: 0 }}
    >
      <Box my={5}>
        <Typography variant="h3" component="h1" gutterBottom>
          Dashboard
        </Typography>

        <Grid container spacing={30}>
          {/* Projects Column */}
          <Grid item xs={12} md={8}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<AddCircleOutlineIcon />}
              onClick={handleAddProject}
              sx={{ mb: 2 }}
            >
              Create New Project
            </Button>
            {projects && projects.length > 0 ? (
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
            <Box mb={4}>
              {" "}
              {/* Add bottom margin to create space */}
              <TaskAssigned tasks={assignedTasks} />
            </Box>
            <Box
              mb={4}
              sx={{
                maxHeight: "100%",
                height: "500px",
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

        {projectsError && (
          <Alert severity="error">{handleApiError(projectsError)}</Alert>
        )}
        {assignedTasksError && (
          <Alert severity="error">{handleApiError(assignedTasksError)}</Alert>
        )}
        {teamError && (
          <Alert severity="error">{handleApiError(teamError)}</Alert>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
