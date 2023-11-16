// TaskList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Replace useHistory with useNavigate

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const { projectId } = useParams();
  const navigate = useNavigate(); // Use useNavigate hook

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/projects/${projectId}/tasks`);
        setTasks(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.error : 'Error fetching tasks');
      }
    };

    fetchTasks();
  }, [projectId]);

  // Function to handle task deletion
  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`http://localhost:3000/projects/${projectId}/tasks/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId)); // Update the tasks state to reflect deletion
      // Optionally, you could redirect or provide a success message
    } catch (err) {
      setError(err.response ? err.response.data.error : 'Error deleting task');
    }
  };

  return (
    <div>
      <h2>Tasks</h2>
      {error && <p>{error}</p>}
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            {task.title}
            {/* Other task actions (view, edit) go here */}
            <button onClick={() => handleDelete(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
      {/* Add a button or link to navigate to task creation */}
    </div>
  );
};

export default TaskList;
