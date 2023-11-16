// ProjectList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom for navigation

const ProjectList = (onRemoveProject) => {
  // State to hold the list of projects
  const [projects, setProjects] = useState([]);
  // State to hold any error messages
  const [error, setError] = useState('');

  // useEffect to fetch projects when the component mounts
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Send GET request to the server for the list of projects
        const response = await axios.get('http://localhost:3000/projects');
        // If successful, set the projects in state
        setProjects(response.data);
      } catch (err) {
        // If there is an error, capture and set the error message in state
        setError(err.response?.data?.error || 'Error fetching projects');
      }
    };

    // Call the function to fetch projects
    fetchProjects();
  }, []);

  // Handler for delete action
  const handleDelete = async (projectId) => {
    // Confirm before deletion
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        // Send DELETE request to the server to delete the project
        await axios.delete(`http://localhost:3000/projects/${projectId}`);
        // Filter out the deleted project from the projects state
        onRemoveProject(projectId);
      } catch (err) {
        // Handle any errors during deletion
        setError(err.response?.data?.error || 'Error deleting project');
      }
    }
  };

  // Render the list of projects or an error message
  return (
    <div className="container my-4">
    <h2 className="mb-3">Projects</h2>
    {error && <p className="alert alert-danger">{error}</p>}
    <ul className="list-group">
      {projects.map((project) => (
        <li key={project._id} className="list-group-item d-flex justify-content-between align-items-center">
          {project.name}
          <div>
            <Link to={`/projects/${project._id}`} className="btn btn-primary btn-sm me-2">View</Link>
            <Link to={`/edit-project/${project._id}`} className="btn btn-secondary btn-sm me-2">Edit</Link>
            <button onClick={() => handleDelete(project._id)} className="btn btn-danger btn-sm">Delete</button>
          </div>
        </li>
      ))}
    </ul>
  </div>
  );
};

export default ProjectList;
