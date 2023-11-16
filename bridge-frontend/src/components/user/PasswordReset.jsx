// PasswordReset.jsx
import React, { useState } from 'react';
import axios from 'axios';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/users/requestPasswordReset', { email });
      setMessage(response.data.message || 'Password reset email sent');
    } catch (err) {
      setError(err.response.data.error || 'Password reset request failed');
    }
  };

  return (
    <div>
      <h2>Password Reset</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit">Send Password Reset Email</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default PasswordReset;
