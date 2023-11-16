// Register.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' // default role
  });
  const [error, setError] = useState('');
  const history = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/users/register', userData);
      // Redirect to login page or dashboard after successful registration
      history.push('/login');
    } catch (err) {
      setError(err.response.data.error || 'Registration failed');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={userData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={userData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={userData.password} onChange={handleChange} required />
        <select name="role" value={userData.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="projectManager">Project Manager</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Register</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Register;
