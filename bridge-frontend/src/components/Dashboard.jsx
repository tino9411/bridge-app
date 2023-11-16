import React, { useState, useEffect } from 'react';
import ProjectList from './project/ProjectList';
import CreateProject from './project/CreateProject';

const Dashboard = ({ onLogout }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // TODO: Fetch projects from the backend and set them in the state
  }, []);

  const addProject = (newProject) => {
    // TODO: Add logic to create a new project in the backend
    // On success, update the state to include the new project
  };

  return (
    <div>
      <button onClick={onLogout}>Logout</button>
      <CreateProject onProjectCreation={addProject} />
      <ProjectList projects={projects} />
      {/* Render other dashboard related components */}
    </div>
  );
};

export default Dashboard;
