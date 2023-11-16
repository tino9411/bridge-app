// ProjectList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom for navigation

const ProjectList = () => {
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
        setProjects(projects.filter(project => project._id !== projectId));
      } catch (err) {
        // Handle any errors during deletion
        setError(err.response?.data?.error || 'Error deleting project');
      }
    }
  };

  // Render the list of projects or an error message
  return (
    <div>
      <h2>Projects</h2>
      {error && <p className="error">{error}</p>}
      <ul>
        {projects.map((project) => (
          <li key={project._id}>
            {project.name}
            {/* Add links for view and edit, and a button for delete */}
            <Link to={`/projects/${project._id}`}>View</Link>
            <Link to={`/edit-project/${project._id}`}>Edit</Link>
            <button onClick={() => handleDelete(project._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
