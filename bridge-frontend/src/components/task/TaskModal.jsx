// TaskModal.jsx
import React from "react";
import "./TaskModal.css";
import "./TaskCard.css";

const TaskModal = ({ task, onClose }) => {

    // Render each skill as a tag
  const renderSkills = (skills) => {
    return skills.map((skill, index) => (
      <span key={index} className="task-skill-tag">{skill}</span>
    ));
  };
    
  if (!task) return null; // Don't render if no task is selected

  return (
    <div className="task-modal-overlay" onClick={onClose}>
      <div className="task-modal" onClick={(e) => e.stopPropagation()}>
        <div className="task-modal-header">
          <h2 className="task-modal-title">{task.title}</h2>
          <button onClick={onClose} className="task-modal-close-btn">
            &times;
          </button>
        </div>
        <div className="task-modal-body">
          {/* Task details here */}
          <div className="task-modal-body-1">
          <p>
            <strong>Project:</strong> {task.project.name}
            </p>
          <p >
            <strong>Status:</strong> <span className={`task-status-badge ${task.status.toLowerCase()}`}>{task.status} </span>
          </p>
            </div>
          <div className="task-modal-body-description">
          <p>
            <strong>Description:</strong> {task.description}
          </p>
          </div>
            <div className="task-modal-body-2">
          <p>
            <strong>Priority:</strong> <span className={`task-priority-badge ${task.priority.toLowerCase()}`}>{task.priority} </span>
          </p>
          <p>
            <strong>Phase:</strong> {task.phase}
          </p>
          <p>
            
            <div> <strong>Skills Needed:</strong>{renderSkills(task.skillsNeeded)}</div>
          </p>
         
            </div>
            <div className="task-modal-body-3">
          <p>
            <strong>Assignee:</strong> {task.assignee}
          </p>
          <p>
            <strong>Due Date:</strong> {task.dueDate}
          </p>
          <p>
            <strong>Rate:</strong> {task.rate}
          </p>
        </div>

        </div>
        <div className="task-modal-footer">{/* Footer content here */}
            <p>Created at: {task.createdAt}</p>
            <p>Updated at: {task.updatedAt}</p>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
