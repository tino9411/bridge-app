// EditProject.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditProject = () => {
  // State for the project data
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: 0,
  });
  // Access the projectId from the URL parameters
  const { projectId } = useParams();
  // For navigation after successful edit
  const history = useNavigate();
  // State for messages and errors
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch project details on component mount and when projectId changes
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const token = localStorage.getItem('token'); // Replace with your token retrieval method
        const response = await axios.get(`http://localhost:3000/projects/${projectId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure the API requires authorization
          },
        });
        // Set the fetched project details to state
        setProjectData(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching project details');
      }
    };
    fetchProjectDetails();
  }, [projectId]);

  // Update projectData state when form inputs change
  const handleChange = (e) => {
    setProjectData({ ...projectData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Replace with your token retrieval method
      // Submit the updated project data to the server
      await axios.put(`http://localhost:3000/projects/${projectId}`, projectData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the authorization header
        },
      });
      // If successful, set a success message
      setMessage('Project updated successfully');
      // Redirect or update UI after successful edit
      history.push('/path-to-redirect');
    } catch (err) {
      // If an error occurs, set an error message
      setError(err.response?.data?.error || 'Error updating project');
    }
  };

  // Form with input fields that are pre-filled with the current project data
  return (
    <div>
      <h2>Edit Project</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Project Name"
          value={projectData.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Project Description"
          value={projectData.description}
          onChange={handleChange}
        />
        <input
          type="date"
          name="startDate"
          placeholder="Start Date"
          value={projectData.startDate}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="endDate"
          placeholder="End Date"
          value={projectData.endDate}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="budget"
          placeholder="Budget"
          value={projectData.budget}
          onChange={handleChange}
          min="0"
          step="0.01"
        />
        <button type="submit">Update Project</button>
      </form>
      {/* Display message or error if any */}
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default EditProject;
