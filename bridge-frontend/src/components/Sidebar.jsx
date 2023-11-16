import React from 'react';
import { Link } from 'react-router-dom';
import { House, Speedometer2, Person } from 'react-bootstrap-icons';
import './Sidebar.css'; // Import the Sidebar CSS

const Sidebar = () => {
  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{ width: '280px' }}>
      <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <svg className="bi me-2" width="40" height="32"><use xlinkHref="#bootstrap"/></svg>
        <span className="fs-4">Bridge.io</span>
      </a>
      <hr/>
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link to="/" className="nav-link active" aria-current="page">
            <House className="bi me-2" size={16} />
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/projects" className="nav-link text-white">
            <Speedometer2 className="bi me-2" size={16} />
            Projects
          </Link>
        </li>
        <li>
          <Link to="/team" className="nav-link text-white">
            <Person className="bi me-2" size={16} />
            Team
          </Link>
        </li>
        {/* ... other sidebar items ... */}
      </ul>
      <hr/>
      <div className="dropdown">
        <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
          <img src="user_avatar.png" alt="" width="32" height="32" className="rounded-circle me-2"/>
          <strong>mdo</strong>
        </a>
        <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
          <li><Link to="/profile" className="dropdown-item">Profile</Link></li>
          <li><Link to="/settings" className="dropdown-item">Settings</Link></li>
          <li><hr className="dropdown-divider"/></li>
          <li><Link to="/logout" className="dropdown-item">Sign out</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
