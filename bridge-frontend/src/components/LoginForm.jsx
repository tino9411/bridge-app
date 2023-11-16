// LoginForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css'; // Make sure the path to your CSS file is correct

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Hook to navigate

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/users/login', { email, password });
      console.log(response.data);
      // Redirect to dashboard or perform other actions on successful login
      navigate('/');
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="card">
      <h2>Log In</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Log In</button>
        <a href="/signup" className="link">Sign Up</a>
      </form>
    </div>
  );
};

export default LoginForm;
