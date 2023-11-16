// EditTask.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // useHistory for navigation after task update

const EditTask = () => {
  // State to store task data
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: '',
    dueDate: ''
  });

  // Extract taskId from the URL parameters
  const { taskId } = useParams();
  const { projectId } = useParams();
  const history = useNavigate(); // Used for redirecting after form submission

  // State for managing messages
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch task details when the component mounts or taskId changes
  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        // Fetching task details from the server
        const response = await axios.get(`http://localhost:3000/projects/${projectId}/tasks/${taskId}`);
        setTaskData(response.data);
      } catch (err) {
        // Handle any errors
        setError(err.response ? err.response.data.error : 'Error fetching task details');
      }
    };

    fetchTaskDetails();
  }, [taskId]); // Dependency array ensures the effect runs when taskId changes

  // Update taskData state as form inputs change
  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send PUT request to update the task
      const response = await axios.put(`http://localhost:3000/projects/${projectId}/tasks/${taskId}`, taskData);
      // Show success message
      setMessage(response.data.message);
      // Redirect user to the task list or details page
      history.push('/tasks');
    } catch (err) {
      // Handle any errors
      setError(err.response ? err.response.data.error : 'Error updating task');
    }
  };

  // Render form for editing a task
  return (
    <div>
      <h2>Edit Task</h2>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
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
          type="date"
          id="dueDate"
          name="dueDate"
          value={taskData.dueDate.substring(0, 10)} // Format the date for input[type=date]
          onChange={handleChange}
        />

        <button type="submit">Update Task</button>
      </form>
    </div>
  );
};

export default EditTask;
