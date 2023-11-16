// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectList from './project/ProjectList';
import CreateProject from './project/CreateProject';
import { useNavigate, useParams } from 'react-router-dom';


const Dashboard = ({ onLogout }) => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const params = useParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:3000/projects', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        setProjects(response.data);
      })
      .catch(error => {
        setError(error.response?.data?.error || 'Error fetching projects');
      });
    }
  }, []);

  const addProject = (newProject) => {
    setProjects(prevProjects => [...prevProjects, newProject]);
  };

  const removeProjectFromState = (projectId) => {
    setProjects(projects.filter(project => project._id !== projectId));
    if (projectId === params.projectId) {
      navigate('/dashboard');
    }
  };

  const renderNoProjects = () => (
    <p>No projects found. Start by creating a new project.</p>
  );

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h2">Dashboard</h1>
        <button onClick={onLogout} className="btn btn-outline-danger">Logout</button>
      </div>
      
      <CreateProject onProjectCreation={addProject} />

      {error && <p className="alert alert-danger">{error}</p>}

      {projects.length > 0 ? (
        <ProjectList projects={projects} onRemoveProject={removeProjectFromState} />
      ) : (
        renderNoProjects()
      )}
    </div>
  );
};

export default Dashboard;
