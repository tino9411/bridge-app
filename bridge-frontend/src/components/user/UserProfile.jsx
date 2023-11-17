// UserProfile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [user, setUser] = useState({ name: '', email: '', role: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
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
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from storage
    navigate('/login'); // Redirect to login page
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container mt-5">
      <h2>User Profile</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card card-body">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <form onSubmit={handlePasswordChange}>
          <div className="mb-3">
            <label htmlFor="newPassword" className="form-label">New Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="newPassword"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button type="button" className="btn btn-outline-secondary" onClick={togglePasswordVisibility}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="confirmPassword"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="button" className="btn btn-outline-secondary" onClick={togglePasswordVisibility}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Update Password</button>
        </form>
        <button onClick={handleLogout} className="btn btn-outline-danger">Logout</button>
      </div>
    </div>
  );
};

export default UserProfile;