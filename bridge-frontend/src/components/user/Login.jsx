import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Post to the login endpoint with email and password
      const response = await axios.post('http://localhost:3000/users/login', { email, password });
      // If a token is received, handle it with the onLogin prop function
      if (response.data.token) {
        onLogin(response.data.token);
        // Redirect to the dashboard
        navigate('/dashboard');
      } else {
        // If no token is received, set an error message
        setError('Login successful but no token received');
      }
    } catch (err) {
      // Set error message from the server, defaulting to 'Login failed' if not provided
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;
