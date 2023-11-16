// CreateTask.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Used to access the URL parameter

const CreateTask = () => {
  // State to hold task data
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'low', // default priority
    dueDate: ''
  });

  // State to hold success and error messages
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Extract projectId from the URL parameters
  const { projectId } = useParams();

  // Update the taskData state as form inputs change
  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      // Send POST request to create a new task
      await axios.post(`http://localhost:3000/projects/${projectId}/tasks`, taskData);
      // If successful, show success message
      setMessage('Task created successfully');
      // Optionally, clear the form
      setTaskData({
        title: '',
        description: '',
        priority: 'low',
        dueDate: ''
      });
    } catch (err) {
      // If error, show error message
      setError(err.response?.data?.error || 'Error creating task');
    }
  };

  // Render the form for creating a task
  return (
    <div>
      <h2>Create Task</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          name="title"
          type="text"
          value={taskData.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={taskData.description}
          onChange={handleChange}
          required
        />

        <label htmlFor="priority">Priority:</label>
        <select
          id="priority"
          name="priority"
          value={taskData.priority}
          onChange={handleChange}
          required
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <label htmlFor="dueDate">Due Date:</label>
        <input
          id="dueDate"
          name="dueDate"
          type="date"
          value={taskData.dueDate}
          onChange={handleChange}
        />

        <button type="submit">Create Task</button>
      </form>

      {/* Display success or error message */}
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default CreateTask;
