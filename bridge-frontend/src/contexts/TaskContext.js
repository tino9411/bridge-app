// contexts/TaskContext.js
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const token = localStorage.getItem('token');

  // Function to fetch tasks for a specific project
  const fetchProjectTasks = async (projectId) => {
    try {
      const response = await axios.get(`http://localhost:3000/projects/${projectId}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks for project', error);
      // Optionally handle error
    }
  };

  // Function to fetch assigned tasks for a specific user
  const fetchAssignedTasks = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3000/users/assignedTasks/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignedTasks(response.data);
    } catch (error) {
      console.error('Error fetching assigned tasks', error);
      // Optionally handle error
    }
  };

  // Add other task-related methods as needed (e.g., createTask, updateTask, deleteTask)

  return (
    <TaskContext.Provider value={{ tasks, assignedTasks, fetchProjectTasks, fetchAssignedTasks }}>
      {children}
    </TaskContext.Provider>
  );
};
