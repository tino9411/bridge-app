import React from 'react';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = ({ children, isAuthenticated, onLogout }) => {
  return (
    <div className="d-flex">
      {isAuthenticated && <Sidebar onLogout={onLogout} />}
      <main className="flex-grow-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;
