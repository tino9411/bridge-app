// ProjectSummary.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ProjectSummary = ({ project }) => {
  return (
    <div>
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      {/* Other summary details */}
      <Link to={`/projects/${project._id}`}>View More</Link>
      {/* Include edit link for authorized users */}
      { /* Assuming you have a method to check if the user can edit */ }
      {userCanEdit && <Link to={`/edit-project/${project._id}`}>Edit</Link>}
    </div>
  );
};

export default ProjectSummary;
