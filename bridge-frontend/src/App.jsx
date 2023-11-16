import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/user/Login';
import Register from './components/user/Register';
import Dashboard from './components/Dashboard'; // Assume this is a component you will create
import Layout from './components/Layout';
import Project from './components/project/Project';
import EditProject from './components/project/EditProject';
import CreateTask from './components/task/CreateTask';
import TaskList from './components/task/TaskList';
import ProjectList from './components/project/ProjectList';


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check local storage for an authentication token
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // Optionally set up Axios defaults or similar if you're using it for API calls
    }
  }, []);

  const handleLogin = (token) => {
    // Set the token in local storage and update authenticated state
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Clear the token from local storage and update authenticated state
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Layout>
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />} />
            <Route path="/projects/:projectId" element={<Project />} />
            <Route path="/edit-project/:projectId" element={<EditProject />} />
            <Route path="/create-task/:projectId" element={<CreateTask />} />
            <Route path="/" element={<Navigate replace to="/dashboard" />} />
            {/* Add more routes as needed */}
          </Routes>

      </Layout>
      
    </Router>
  );
};

export default App;
