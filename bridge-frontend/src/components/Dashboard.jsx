import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css'; // Ensure this CSS file is well structured and professional

const Dashboard = () => {
  // Simulated API data
  const tasks = [
    { id: 1, title: 'Task 1', status: 'In Progress' },
    { id: 2, title: 'Task 2', status: 'Completed' },
    // ... other tasks
  ];

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <nav className="nav">
          <Link to="/profile">Profile</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/tasks">Tasks</Link>
          <Link to="/logout">Logout</Link>
        </nav>
      </aside>

      <main className="main-content">
        <header className="header">
          <h1>Dashboard</h1>
          <p>Welcome back, [User Name]!</p>
        </header>

        <section className="task-overview">
          <h2>Tasks Overview</h2>
          <div className="task-list">
            {tasks.map(task => (
              <div key={task.id} className={`task-card status-${task.status.toLowerCase()}`}>
                <h3>{task.title}</h3>
                <p>Status: <strong>{task.status}</strong></p>
              </div>
            ))}
          </div>
        </section>

        <section className="analytics">
          <h2>Project Analytics</h2>
          {/* Components for analytics like charts, graphs etc. */}
        </section>

        {/* Add more sections as needed */}
      </main>
    </div>
  );
};

export default Dashboard;
