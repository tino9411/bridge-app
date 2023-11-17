//App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/user/Login';
import Register from './components/user/Register';
import UserProfile from './components/user/UserProfile';
import Dashboard from './components/Dashboard';
import Layout from './components/Layout';
import Project from './components/project/Project';
import EditProject from './components/project/EditProject';
import CreateTask from './components/task/CreateTask';
import TaskList from './components/task/TaskList';
import ProjectList from './components/project/ProjectList';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
      <Route path="/" element={<Navigate replace to="/dashboard" />} />
        <Route path="/dashboard" element={
          <Layout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
            <Dashboard />
          </Layout>
        } />
        <Route path="/user-profile" element={
          <Layout isAuthenticated={isAuthenticated}>
            <UserProfile />
          </Layout>
        } />
        <Route path="/projects" element={
          <Layout isAuthenticated={isAuthenticated}>
            <ProjectList />
          </Layout>
        } />
        <Route path="/tasks" element={
          <Layout isAuthenticated={isAuthenticated}>
            <TaskList />
          </Layout>
        } />
        <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/projects/:projectId" element={
          <Layout isAuthenticated={isAuthenticated}>
            <Project />
          </Layout>
        } />
        <Route path="/edit-project/:projectId" element={
          <Layout isAuthenticated={isAuthenticated}>
            <EditProject />
          </Layout>
        } />
        <Route path="/create-task/:projectId" element={
          <Layout isAuthenticated={isAuthenticated}>
            <CreateTask />
          </Layout>
        } />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;
