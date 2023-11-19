
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectCard from './project/ProjectCard'; // Import the ProjectCard component
//import CreateProject from './project/CreateProject';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Assuming you have or will create a custom CSS file for Dashboard

const Dashboard = ({ onLogout }) => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
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

  // Function to delete a project
  const deleteProject = (projectId) => {
    const updatedProjects = projects.filter(project => project._id !== projectId);
    setProjects(updatedProjects);
  };

  const renderNoProjects = () => (
    <p>No projects found. Start by creating a new project.</p>
  );

  return (
    <div className="container my-5">
      <h1 className="mb-4">Projects Dashboard</h1>

      {/* Placeholder for top-level metrics like earnings, readers, etc. */}
      <div className="row mb-4">
        {/* Earnings, Readers, Bookmarks, Visitors */}
        {/* These would be separate components like <Earnings />, <Readers />, etc. */}
      </div>

      <div className="row">
        <div className="col-lg-8">
          <h2 className="mb-3">Projects</h2>
          {/* Project cards grid */}
          <div className="row">
            {projects.length > 0 ? (
              projects.map((project) => (
                <div key={project.id} className="col-md-6 col-lg-4 mb-4">
                  <ProjectCard project={project} onDelete={deleteProject} />
                </div>
              ))
            ) : (
              renderNoProjects()
            )}
          </div>
        </div>
        <div className="col-lg-4">
          <h2 className="mb-3">Team Members</h2>
          {/* Team members list */}
          {/* This would be a separate component like <TeamMembersList /> */}
        </div>
      </div>

    {/* <CreateProject onProjectCreation={addProject} /> */}

      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Dashboard;
