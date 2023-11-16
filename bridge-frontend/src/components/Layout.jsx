import React from 'react';
import Sidebar from './Sidebar';
import './Layout.css'; // Add this import


const Layout = ({ children }) => {
  return (
    <div className="d-flex">
      <Sidebar />
      <main className="flex-grow-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;
