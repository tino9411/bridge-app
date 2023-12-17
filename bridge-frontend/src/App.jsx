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
import Notification from './components/notification/Notification';
import JoinRequests from './components/request/JoinRequests'; // Import JoinRequests component
import { ProjectProvider } from './contexts/ProjectContext';
import { TeamProvider } from './contexts/TeamContext';
import { TaskProvider } from './contexts/TaskContext';
import { CommentProvider } from './contexts/CommentContext';
import TaskSearch from './components/task/TaskSearch';
import { SocketProvider } from './contexts/SocketContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { RequestProvider } from './contexts/RequestContext';
import { MessageProvider } from './contexts/MessageContext';


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
    <SocketProvider>
    <ThemeProvider theme={theme}>
    <NotificationProvider>
    <RequestProvider>
    <ProjectProvider>
    <TeamProvider>
    <TaskProvider>
    <CommentProvider>
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
        } 
        />
        <Route path="/notifications" element={
          <Layout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
            <Notification />
          </Layout>
        } />

<Route path="/join-requests" element={
                          <Layout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
                            <JoinRequests />
                          </Layout>
                        } />

        {/* Add more routes as needed */}
      </Routes>
    </Router>
    </CommentProvider>
    </TaskProvider>
    </TeamProvider>
    </ProjectProvider>
    </RequestProvider>
     </NotificationProvider>
    </ThemeProvider>
   
    </SocketProvider>
  );
};

export default App;
