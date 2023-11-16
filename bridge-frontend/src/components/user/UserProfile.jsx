// UserProfile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [user, setUser] = useState({ name: '', email: '', role: '' });
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const history = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Assumes you store the token in localStorage
          },
        });
        setUser(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching profile');
      }
    };

    fetchProfile();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      // Add your API endpoint for updating the password
      const response = await axios.post('http://localhost:3000/users/updatePassword', {
        newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Password updated successfully!');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from storage
    history.push('/login'); // Redirect to login page
  };

  return (
    <div>
      <h2>User Profile</h2>
      {error && <p className="error">{error}</p>}
      <div>
        <p>Name: {user.name}</p>
        <p>Email: {user.email} (readonly)</p>
        <p>Role: {user.role}</p>
        <form onSubmit={handlePasswordChange}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit">Update Password</button>
        </form>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default UserProfile;
