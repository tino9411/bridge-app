// Project.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import TaskList from '../task/TaskList';
import './Project.css'; 

const Project = () => {
  // State to hold the project details
  const [project, setProject] = useState(null);
  // State to hold any errors
  const [error, setError] = useState('');
  // Get projectId from the URL parameters
  const { projectId } = useParams();

  // Formatting dates
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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

  return (
    <div className="project-container">
      <header className="project-header">
        <Link to="/dashboard" className="btn-back">⬅ Back to Dashboard</Link>
        <h2>{project?.name}</h2>
        <Link to={`/edit-project/${project?._id}`} className="btn-edit">Edit Project</Link>
      </header>

      {error && <div className="alert">{error}</div>}

      {project && (
        <div className="project-details">
          <div className="project-info">
            <p><strong>Description:</strong> {project.description}</p>
            <p><strong>Start Date:</strong> {formatDate(project.startDate)}</p>
            <p><strong>End Date:</strong> {formatDate(project.endDate)}</p>
            <p><strong>Status:</strong> <span className={`status ${project.status.toLowerCase()}`}>{project.status}</span></p>
            <p><strong>Budget:</strong> <span className="budget">${project.budget.toLocaleString()}</span></p>
          </div>
          <TaskList projectId={project._id} /> {/* Pass projectId to TaskList if needed */}
        </div>
      )}
    </div>
  );
};

export default Project;
