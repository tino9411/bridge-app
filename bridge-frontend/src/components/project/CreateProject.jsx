// CreateProject.jsx
import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const CreateProject = ({ onProjectCreation }) => {
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
      onProjectCreation(response.data);
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
    <div className="container my-4">
      <h2>Create Project</h2>
      <form onSubmit={handleSubmit} className="mb-3">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            name="name"
            placeholder="Project Name"
            value={projectData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <textarea
            className="form-control"
            name="description"
            placeholder="Project Description"
            value={projectData.description}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="mb-3">
          <input
            type="date"
            className="form-control"
            name="startDate"
            value={projectData.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="date"
            className="form-control"
            name="endDate"
            value={projectData.endDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="number"
            className="form-control"
            name="budget"
            placeholder="Budget"
            value={projectData.budget}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
        </div>

        <button type="submit" className="btn btn-primary">Create Project</button>
      </form>
      {message && <p className="alert alert-success">{message}</p>}
      {error && <p className="alert alert-danger">{error}</p>}
    </div>
  );
};

CreateProject.propTypes = {
  onProjectCreation: PropTypes.func.isRequired,
};

export default CreateProject;
