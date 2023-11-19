//TaskList.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import TaskCard from "./TaskCard";
import './TaskList.css';
import TaskModal from "./TaskModal";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { projectId } = useParams();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/projects/${projectId}/tasks`
        );
        setTasks(response.data);
      } catch (err) {
        setError(
          err.response ? err.response.data.error : "Error fetching tasks"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [projectId]);

  const handleComplete = async (taskId) => {
    try {
      await axios.put(
        `http://localhost:3000/projects/${projectId}/tasks/${taskId}`,
        { status: 'complete' }
      );
      setTasks(
        tasks.map((task) => {
          if (task._id === taskId) {
            return { ...task, status: 'completed' };
          }
          return task;
        })
      );
    } catch (err) {
      setError(err.response ? err.response.data.error : "Error completing task");
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(
        `http://localhost:3000/projects/${projectId}/tasks/${taskId}`
      );
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (err) {
      setError(err.response ? err.response.data.error : "Error deleting task");
    }
  };

  const handleEdit = (taskId, updatedTaskData) => {
    // Implement the logic to update a task here or lift the state up to a parent component
    // and pass the updated task data as props

    const updatedTasks = tasks.map((task) => {
       if (task._id === taskId) {
         return { ...task, ...updatedTaskData };
       }
       return task;
     });
     setTasks(updatedTasks);

  };


  const [selectedTask, setSelectedTask] = useState(null);

    const handleTaskClick = (task) => {
        setSelectedTask(task); // When a task is clicked, set it as the selected task
    };

    const handleCloseModal = () => {
        setSelectedTask(null); // To close the modal, clear the selected task
    };

  if (isLoading) return <div>Loading tasks...</div>;

  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="task-list-container">
      <div className="task-card-container">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onClick={() => handleTaskClick(task)} // Add this line to handle clicking
            onDelete={handleDelete}
            onComplete={handleComplete}
            onEdit={handleEdit}
          />
        ))}
      </div>
      <TaskModal task={selectedTask} onClose={handleCloseModal} />
    </div>
  );
};

export default TaskList;
