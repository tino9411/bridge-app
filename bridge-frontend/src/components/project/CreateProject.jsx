// CreateProject.jsx
import React, { useState } from 'react';
import axios from 'axios';

const CreateProject = () => {
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: 0,
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setProjectData({ ...projectData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add your token from localStorage or context API
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3000/projects',
        projectData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('Project created successfully: ' + response.data.name);
      setProjectData({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        budget: 0,
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Error creating project');
    }
  };

  return (
    <div>
      <h2>Create Project</h2>
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
        <button type="submit">Create Project</button>
      </form>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default CreateProject;
