// ProjectDetails.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProjectDetails = () => {
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
    <div>
      <h2>Project Details</h2>
      {error && <p className="error">{error}</p>}
      {/* Check if the project data is available before trying to access its properties */}
      {project && (
        <>
          <p>Name: {project.name}</p>
          <p>Description: {project.description}</p>
          <p>Start Date: {project.startDate}</p>
          <p>End Date: {project.endDate}</p>
          <p>Status: {project.status}</p>
          <p>Budget: ${project.budget}</p>
          {/* Add more details as needed */}
        </>
      )}
    </div>
  );
};

export default ProjectDetails;
