//EditTask.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditTask = () => {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: '',
    dueDate: ''
  });
  const { taskId } = useParams();
  const history = useNavigate();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await axios.get(`https://localhost:3000/projects/${projectId}/tasks`);
        setTaskData(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.error : 'Error fetching task details');
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`https://localhost:3000/projects/${projectId}/tasks/${taskId}`, taskData);
      setMessage(response.data.message);
      // Redirect user to the task list or details page after successful update
      history.push('/tasks');
    } catch (err) {
      setError(err.response ? err.response.data.error : 'Error updating task');
    }
  };

  return (
    <div>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={taskData.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={taskData.description}
          onChange={handleChange}
        />

        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          name="priority"
          value={taskData.priority}
          onChange={handleChange}
          required
        >
          <option value="">Select Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <label htmlFor="dueDate">Due Date</label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={taskData.dueDate.substring(0, 10)}
          onChange={handleChange}
        />

        <button type="submit">Update Task</button>
      </form>
    </div>
  );
};

export default EditTask;
