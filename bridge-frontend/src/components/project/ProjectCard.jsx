// ProjectCard.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./ProjectCard.css"; // Import custom styling

const ProjectCard = ({ project, onDelete }) => {
  let statusClass = "";
  switch (project.status) {
    case "In Progress":
      statusClass = "in-progress";
      break;
    case "Completed":
      statusClass = "completed";
      break;
    case "On Hold":
      statusClass = "on-hold";
      break;
    default:
      statusClass = "not-started";
  }

  let priorityClass = ""; // Add this
  switch (project.priority) {
    case "Medium":
      priorityClass = "medium";
      break;
    case "High":
      priorityClass = "high";
      break;
    case "Low":
      priorityClass = "low";
      break;
    default:
      priorityClass = "new";
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const projectDetailLink = `/projects/${project._id}`; // Add this
  const navigate = useNavigate();

  // Function to navigate to project details
  const goToProjectDetails = () => {
    navigate(`/projects/${project._id}`);
  };
// Handler for the delete action
const handleDelete = async (event) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`http://localhost:3000/projects/${project._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        onDelete(project._id); // Call the onDelete function passed via props
      } catch (error) {
        console.error('Error deleting the project:', error);
      }
    }
  };

  return (
    <div className="project-card" onClick={goToProjectDetails}>
      <div className="project-card-header">
        <h6 className="project-card-title">{project.name}</h6>
        <button className="project-delete-button" onClick={handleDelete}>&times;</button>
        {/* Add icon or image here if needed */}
      </div>
      <div className="project-card-body">
        <p className={`project-status ${statusClass}`}>{project.status}</p>
        <p className="project-budget">Budget: ${project.budget}</p>
        <div className="project-dates">
          <p className="project-date">Start: {formatDate(project.startDate)}</p>
          <p className="project-date">End: {formatDate(project.endDate)}</p>
          <p className="project-task-count">Tasks: {project.taskCount}</p>
        </div>
        <p className={`project-priority ${priorityClass}`}>
          {project.priority}
        </p>
      </div>
      <div className="project-card-footer">
      </div>
    </div>
  );
};

export default ProjectCard;
