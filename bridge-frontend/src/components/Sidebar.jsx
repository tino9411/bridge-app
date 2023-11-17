// Sidebar.jsx
import React from 'react';
import { House, Speedometer2, Person } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import './Sidebar.css'; // Import the Sidebar CSS

const Sidebar = ({ onLogout }) => {
    const navigate = useNavigate();
  
    const handleLogout = () => {
      // Perform logout operations like clearing the token
      onLogout();
      // Redirect to login or home page after logout
      navigate('/login');
    };
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
      <Dropdown as="ul" className="mb-3">
        <Dropdown.Toggle as="a" className="d-flex align-items-center text-white text-decoration-none">
          <img src="user_avatar.png" alt="" width="32" height="32" className="rounded-circle me-2"/>
          <strong>mdo</strong>
        </Dropdown.Toggle>

        <Dropdown.Menu className="dropdown-menu-dark text-small shadow">
          <Dropdown.Item as={Link} to="/user-profile">Profile</Dropdown.Item>
          <Dropdown.Item as={Link} to="/settings">Settings</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleLogout}>Sign out</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default Sidebar;
