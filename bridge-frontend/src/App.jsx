//App.jsx
import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from './utils/theme';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/user/Login';
import Register from './components/user/Register';
import UserProfile from './components/user/UserProfile';
import Dashboard from './components/Dashboard';
import Layout from './components/Layout';
import Project from './components/project/Project';
import TaskList from './components/task/TaskList';
import ProjectList from './components/project/ProjectList';
import { AuthProvider } from './hooks/useAuth';
import { ProjectProvider } from './contexts/ProjectContext';
import { UserProvider } from './contexts/UserContext';
import { TeamProvider } from './contexts/TeamContext';
import { TaskProvider } from './contexts/TaskContext';
import TaskSearch from './components/task/TaskSearch';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (token, rememberMe) => {
    if (rememberMe) {
      localStorage.setItem('token', token); // Persistent storage
    } else {
      sessionStorage.setItem('token', token); // Session-only storage
    }
    setIsAuthenticated(true);
  };
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <ThemeProvider theme={theme}>
    <AuthProvider>
    <UserProvider>
    <ProjectProvider>
    <TeamProvider>
    <TaskProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate replace to="/dashboard" />} />
        <Route path="/dashboard" element={
          <Layout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
            <Dashboard />
          </Layout>
        } />
        <Route path="/user-profile" element={
          <Layout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
            <UserProfile />
          </Layout>
        } />
        <Route path="/projects" element={
          <Layout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
            <ProjectList />
          </Layout>
        } />
        <Route path="/tasks" element={
          <Layout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
            <TaskList />
          </Layout>
        } />
        <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/projects/:projectId" element={
          <Layout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
            <Project />
          </Layout>
        } />

<Route path="/task-search" element={
          <Layout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
            <TaskSearch />
          </Layout>
        } />

        {/* Add more routes as needed */}
      </Routes>
    </Router>
    </TaskProvider>
    </TeamProvider>
    </ProjectProvider>
    </UserProvider>
    </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
