// Project.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import TaskList from '../task/TaskList';

const Project = () => {
  // State to hold the project details
  const [project, setProject] = useState(null);
  // State to hold any errors
  const [error, setError] = useState('');
  // Get projectId from the URL parameters
  const { projectId } = useParams();

  // useEffect to run the fetch operation when the component mounts or when projectId changes
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        // Attempt to get the project details from the API
        const response = await axios.get(`http://localhost:3000/projects/${projectId}`);
        // If successful, set the project details in state
        setProject(response.data);
      } catch (err) {
        // If there is an error, set the error message in state
        setError(err.response?.data?.error || 'Error fetching project details');
      }
    };

    // Call the function to fetch project details
    fetchProjectDetails();
  }, [projectId]);

  // If the project data is not yet loaded, show a loading message
  if (!project) return <p>Loading...</p>;

  // Render the project details, or an error message if an error occurred
  return (
    <div className="container my-4">
      <Link to="/dashboard" className="btn btn-secondary mb-3">Back to Dashboard</Link>
      <h2 className="mb-3">{project?.name}</h2>
      {error && <p className="alert alert-danger">{error}</p>}

      {project && (
        <div className="card mb-3">
          <div className="card-body">
            <p><strong>Description:</strong> {project.description}</p>
            <p><strong>Start Date:</strong> {project.startDate}</p>
            <p><strong>End Date:</strong> {project.endDate}</p>
            <p><strong>Status:</strong> {project.status}</p>
            <p><strong>Budget:</strong> ${project.budget}</p>
          </div>
        </div>
      )}
      <Link to={`/edit-project/${project?._id}`} className="btn btn-primary mb-3">Edit Project</Link>

      <TaskList /> {/* Render TaskList component */}
    </div>
  );
};

export default Project;
