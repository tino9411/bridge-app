import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    priority: "",
    dueDate: "",
  });
  const { projectId } = useParams();
  const [error, setError] = useState("");

  const [newTaskData, setNewTaskData] = useState({
    title: "",
    description: "",
    priority: "low",
    dueDate: "",
  });
  //const navigate = useNavigate();

  const handleNewTaskFormChange = (event) => {
    const { name, value } = event.target;
    setNewTaskData({ ...newTaskData, [name]: value });
  };

  const handleNewTaskFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:3000/projects/${projectId}/tasks`,
        newTaskData
      );
      // Add the newly created task to the tasks array
      setTasks([...tasks, response.data]);
      // Optionally, clear the form
      setNewTaskData({
        title: "",
        description: "",
        priority: "low",
        dueDate: "",
      });
      // Redirect to the project page or stay on the same page
      // navigate(`/project/${projectId}`);
    } catch (err) {
      setError(err.response ? err.response.data.error : "Error creating task");
    }
  };

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
      }
    };

    fetchTasks();
  }, [projectId]);

  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditFormData(task);
  };

  const handleEditFormChange = (event) => {
    const { name, value } = event.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleEditFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(
        `http://localhost:3000/projects/${projectId}/tasks/${editingTaskId}`,
        editFormData
      );
      setTasks(
        tasks.map((task) => (task._id === editingTaskId ? editFormData : task))
      );
      setEditingTaskId(null);
    } catch (err) {
      setError(err.response ? err.response.data.error : "Error updating task");
    }
  };

  const handleCancelClick = () => {
    setEditingTaskId(null);
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

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-danger';
      case 'medium':
        return 'bg-warning text-dark';
      case 'low':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  };
  

  return (
    <div className="container my-4">
      <h2 className="mb-3 text-center">Tasks</h2>
      <form onSubmit={handleNewTaskFormSubmit} className="mb-3">
        <div className="input-group mb-3">
          <input
            type="text"
            name="title"
            className="form-control"
            placeholder="Task Title"
            value={newTaskData.title}
            onChange={handleNewTaskFormChange}
            required
          />
        </div>
        <div className="input-group mb-3">
          <textarea
            name="description"
            className="form-control"
            placeholder="Task Description"
            value={newTaskData.description}
            onChange={handleNewTaskFormChange}
          />
        </div>
        <div className="input-group mb-3">
          <select
            name="priority"
            className="form-select"
            value={newTaskData.priority}
            onChange={handleNewTaskFormChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="input-group mb-3">
          <input
            type="date"
            name="dueDate"
            className="form-control"
            value={newTaskData.dueDate}
            onChange={handleNewTaskFormChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Task
        </button>
      </form>
      {error && <p className="alert alert-danger text-center">{error}</p>}

  <table className="table table-striped">
    <thead>
      <tr className="text-center">
        <th>Title</th>
        <th>Description</th>
        <th>Priority</th>
        <th>Due Date</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {tasks.map((task) => (
        <tr key={task._id} className="text-center">
          {editingTaskId === task._id ? (
            // Edit form cells
            <>
              <td>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  value={editFormData.title}
                  onChange={handleEditFormChange}
                  required
                />
              </td>
              <td>
                <textarea
                  name="description"
                  className="form-control"
                  value={editFormData.description}
                  onChange={handleEditFormChange}
                />
              </td>
              <td>
                <select
                  name="priority"
                  className="form-select"
                  value={editFormData.priority}
                  onChange={handleEditFormChange}
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </td>
              <td>
                <input
                  type="date"
                  name="dueDate"
                  className="form-control"
                  value={editFormData.dueDate.substring(0, 10)}
                  onChange={handleEditFormChange}
                />
              </td>
              <td>
                <button type="submit" className="btn btn-primary me-2">Save</button>
                <button type="button" className="btn btn-secondary" onClick={handleCancelClick}>Cancel</button>
              </td>
            </>
          ) : (
            // Display task cells
            <>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td><span className={`badge ${getPriorityBadgeClass(task.priority)}`}>{task.priority}</span></td>
              <td>{task.dueDate}</td>
              <td>
                <button onClick={() => startEditing(task)} className="btn btn-outline-primary me-2">Edit</button>
                <button onClick={() => handleDelete(task._id)} className="btn btn-outline-danger">Delete</button>
              </td>
            </>
          )}
        </tr>
      ))}
    </tbody>
  </table>
</div>
  );
};

export default TaskList;
