// contexts/ProjectContext.js
import { createContext, useContext, useState } from 'react';
import useSnackbar from '../hooks/useSnackbar'; // Import the useSnackbar hook

import axios from 'axios';

const ProjectContext = createContext();

export const useProjects = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const { snackbarOpen, snackbarMessage, snackbarSeverity, showSnackbar, handleSnackbarClose } = useSnackbar(); // Use the useSnackbar hook
  
  const fetchProjects = async (token) => {
    try {
      const response = await axios.get('http://localhost:3000/projects', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(response.data);
    } catch (err) {
      console.error('Failed to fetch projects', err);
        showSnackbar('Failed to fetch projects', 'error'); // Show error snackbar
    }
  };

  const deleteProject = async (projectId, token) => {
    try {
      await axios.delete(`http://localhost:3000/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(projects.filter((project) => project._id !== projectId));
        showSnackbar('Project deleted successfully', 'success'); // Show success snackbar
    } catch (err) {
      console.error('Failed to delete project', err);
        showSnackbar('Failed to delete project', 'error'); // Show error snackbar
    }
  };

  const addProject = async (projectData, token) => {
    try {
      const response = await axios.post(
        'http://localhost:3000/projects',
        projectData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProjects([...projects, response.data]);
      showSnackbar('Project added successfully', 'success'); // Show success snackbar
    } catch (err) {
      console.error('Failed to add project', err);
        showSnackbar('Failed to add project', 'error'); // Show error snackbar
    }
  }

  const updateProject = async (projectId, projectData, token) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/projects/${projectId}`,
        projectData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProjects(
        projects.map((project) =>
          project._id === projectId ? response.data : project
        )
      );
        showSnackbar('Project updated successfully', 'success'); // Show success snackbar
    } catch (err) {
      console.error('Failed to update project', err);
        showSnackbar('Failed to update project', 'error'); // Show error snackbar
    }
  }


  const value = {
    projects,
    fetchProjects,
    addProject,
    deleteProject,
    updateProject,
    // Provide the snackbar states and functions
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    showSnackbar,
    handleSnackbarClose,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};
