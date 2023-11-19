import React, { useState } from "react";
import axios from "axios";
import "./TaskCard.css";

const Task = ({ task, onDelete, onComplete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({ ...task });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    setLoading(true);
    try {
      await axios.delete(`http://localhost:3000/tasks/${task._id}`);
      onDelete(task._id);
    } catch (error) {
      setError("Error deleting the task.");
      console.error("Error deleting the task:", error);
    }
    setLoading(false);
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await axios.patch(`http://localhost:3000/tasks/${task._id}`, {
        status: "completed",
      });
      onComplete(task._id);
    } catch (error) {
      setError("Error completing the task.");
      console.error("Error completing the task:", error);
    }
    setLoading(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditFormData({ ...task });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const updatedTask = await axios.put(
        `http://localhost:3000/tasks/${task._id}`,
        editFormData
      );
      setIsEditing(false);
      onEdit(task._id, updatedTask.data);
    } catch (error) {
      setError("Error updating the task.");
      console.error("Error updating the task:", error);
    }
    setLoading(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditFormData({ ...task });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const renderEditView = () => {
    // Return JSX for editing the task
    // Include form inputs pre-filled with task data and a save button
    // Call handleSave with the updated task data when the save button is clicked
    return (
      <div className="task-card">
        <div className="task-content">
          <form onSubmit={handleSave}>
            <label htmlFor="title">Title:</label>
            <input
              id="title"
              name="title"
              type="text"
              value={task.title}
              onChange={handleChange}
              required
            />
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={task.description}
              onChange={handleChange}
              required
            />
            <label htmlFor="priority">Priority:</label>
            <select
              id="priority"
              name="priority"
              value={task.priority}
              onChange={handleChange}
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <label htmlFor="status">Status:</label>
            <select
              id="status"
              name="status"
              value={task.status}
              onChange={handleChange}
              required
            >
              <option value="not open">Not Started</option>
              <option value="in progress">In Progress</option>
              <option value="on hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
            <label htmlFor="assignedTo">Assigned To:</label>
            <select
              id="assignedTo"
              name="assignedTo"
              value={task.assignee}
              onChange={handleChange}
              required
            >
              <option value="not assigned">Not Assigned</option>
              <option value="me">Me</option>
              <option value="someone else">Someone Else</option>
            </select>
            <label htmlFor="rate">Rate:</label>
            <input
              id="rate"
              name="rate"
              type="number"
              value={task.rate}
              onChange={handleChange}
              required
            />
            <label htmlFor="phase">Phase:</label>
            <select
              id="phase"
              name="phase"
              value={task.phase}
              onChange={handleChange}
              required
            >
              <option value="not assigned">Not Assigned</option>
              <option value="phase 1">Phase 1</option>
              <option value="phase 2">Phase 2</option>
              <option value="phase 3">Phase 3</option>
            </select>
            <label htmlFor="dueDate">Due Date:</label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={task.dueDate}
              onChange={handleChange}
              required
            />
            <button type="submit">Save</button>
            <button onClick={handleCancelClick} type="button">
              Cancel
            </button>
          </form>
        </div>
      </div>
    );
  };

  const renderDefaultView = () => (
    <div className="task-card">
      <div className="task-header">
        <h5 className="task-title">{task.title}</h5>
      </div>
      <div className="task-body">
        <p>Assigned to: {task.assignee}</p>
        <p>Rate: {task.rate}</p>
        <p>Phase: {task.phase}</p>
        <div className="task-metadata">
          <span className="task-date">Due Date: {task.dueDate}</span>
          <span className="task-date">Created: {task.createdAt}</span>
          <span className="task-date">Updated: {task.updatedAt}</span>
        </div>
        <div className="task-actions">
        <button onClick={() => onEdit(task)} className="task-action-button task-action-button-edit">
          <i className="fas fa-pencil-alt"></i>
        </button>
        <button onClick={() => onComplete(task)} className="task-action-button task-action-button-complete">
          <i className="fas fa-check"></i>
        </button>
        <button onClick={() => onDelete(task)} className="task-action-button task-action-button-delete">
          <i className="fas fa-times"></i>
        </button>
      </div>
      </div>
      
      <div className="task-footer">
        <span className={`task-status-badge ${task.status.toLowerCase()}`}>{task.status}</span>
        <span className={`task-priority-badge ${task.priority.toLowerCase()}`}>{task.priority}</span>
      </div>
    </div>
  );

  return isEditing ? renderEditView() : renderDefaultView();
};

export default Task;
