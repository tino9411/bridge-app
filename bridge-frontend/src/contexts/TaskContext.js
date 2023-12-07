// contexts/TaskContext.js
import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import useSnackbar from "../hooks/useSnackbar"; // Import the useSnackbar hook
import { useAuth } from "../hooks/useAuth"; // Assuming you have an auth hook for authentication

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const { token, user } = useAuth(); // Assuming you have an auth hook for authentication
  const [tasks, setTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  // useSnackbar hook for displaying notifications
  const { snackbarOpen, snackbarMessage, snackbarSeverity, showSnackbar, handleSnackbarClose } = useSnackbar(); // Use the useSnackbar hook

  // Function to fetch tasks for a specific project
  const fetchProjectTasks = async (projectId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/projects/${projectId}/tasks`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks for project", error);
      showSnackbar("Error fetching tasks for project", "error");
    }
  };

  // Function to fetch assigned tasks for a specific user
  const fetchAssignedTasks = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/users/assignedTasks/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAssignedTasks(response.data);
    } catch (error) {
      console.error("Error fetching assigned tasks", error);
      // Optionally handle error
      showSnackbar("Error fetching assigned tasks", "error");
    }
  };

  // Function to add a new task
  const addTask = async (projectId, taskData) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/projects/${projectId}/tasks`,
        taskData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([...tasks, response.data]);
      // Handle success (e.g., show notification)
      showSnackbar("Task added successfully", "success");
    } catch (error) {
      console.error("Error adding task", error);
      // Handle error
      showSnackbar("Error adding task", "error");
    }
  };

  // Function to update a task
  const updateTask = async (taskId, taskData, projectId) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/projects/${projectId}/tasks/${taskId}`,
        taskData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(
        tasks.map((task) => (task._id === taskId ? response.data : task))
      );
      // Handle success
      showSnackbar("Task updated successfully", "success");
    } catch (error) {
      console.error("Error updating task", error);
      // Handle error
      showSnackbar("Error updating task", "error");
    }
  };

  // Function to delete a task
  const deleteTask = async (taskId, projectId) => {
    try {
      await axios.delete(`http://localhost:3000/projects/${projectId}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task._id !== taskId));
      // Handle success
      showSnackbar("Task deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting task", error);
      // Handle error
      showSnackbar("Error deleting task", "error");
    }
  };

  // Function to complete a task
  const completeTask = async (taskId, projectId) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/projects/${projectId}/${taskId}/complete`,
        {}, // You may need to send some data if required by your backend
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(
        tasks.map((task) =>
          task._id === taskId ? { ...task, status: "completed" } : task
        )
      );
      showSnackbar("Task completed successfully", "success");
      // Handle success (e.g., update UI, show notification)
    } catch (error) {
      console.error("Error completing task", error);
      // Handle error
      showSnackbar("Error completing task", "error");
    }
  };

  const searchTasks = async (filters) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/projects/tasks/search",
        {
          params: filters,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(response.data);
    } catch (error) {
      console.error("Error searching tasks", error);
        // Handle error
        showSnackbar("Error searching tasks", "error");
    }
  };

  const requestToJoinTask = async (taskId, message) => {
  
    try {
      await axios.post(
        `http://localhost:3000/projects/tasks/${taskId}/request-to-join`,
        {
          userId: user._id, // Ensure that you are sending the user's ID
          message,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Handle successful request
      showSnackbar("Request sent successfully", "success");
    } catch (error) {
      console.error("Error requesting to join task", error);
      showSnackbar("Error requesting to join task", "error");
    }
  };
  

  // Add other task-related methods as needed (e.g., createTask, updateTask, deleteTask)

  return (
    <TaskContext.Provider
      value={{
        user,
        tasks,
        assignedTasks,
        fetchProjectTasks,
        fetchAssignedTasks,
        addTask,
        updateTask,
        deleteTask,
        completeTask,
        searchTasks,
        requestToJoinTask,
      


        //Snackbar props
        snackbarOpen,
        snackbarMessage,
        snackbarSeverity,
        handleSnackbarClose,

      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
