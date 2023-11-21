// UserProfile.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UserProfile.css";

const UserProfile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    phoneNumber: "",
    secondaryEmail: "",
    skills: [],
    biography: "",
    profileImage: null,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [newSkills, setNewSkills] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/users/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUser({ ...response.data, skills: response.data.skills || [] });
        setNewSkills(response.data.skills || []);
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching profile");
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
      const response = await axios.post(
        "http://localhost:3000/users/updatePassword",
        {
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token from storage
    navigate("/login"); // Redirect to login page
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleImageChange = (event) => {
    setUser({ ...user, profileImage: event.target.files[0] });
  };

  const handleSkillInputChange = (e) => {
    if (e.key === "Enter" && e.target.value) {
      e.preventDefault(); // Prevent the form from submitting when Enter is pressed
      if (newSkills.length < 5 && !newSkills.includes(e.target.value)) {
        setNewSkills([...newSkills, e.target.value.trim()]);
        e.target.value = ""; // Clear the input after adding a skill
      }
    }
  };

  const removeSkill = (skillToRemove) => {
    setNewSkills(newSkills.filter((skill) => skill !== skillToRemove));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("phoneNumber", user.phoneNumber);
    formData.append("secondaryEmail", user.secondaryEmail);
    formData.append("skills", newSkills); // Sending skills as an array
    formData.append("biography", user.biography);
    if (user.profileImage) {
      formData.append("profileImage", user.profileImage);
    }

    try {
      const response = await axios.patch(
        "http://localhost:3000/users/updateProfile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUser({ ...user, skills: newSkills }); // Update skills in state
      setIsEditMode(false); // Exit edit mode after successful update
      alert("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile");
    }
  };
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const displayValue = (value) => value || "";

  return (
  <div className="container mt-5">
    <div className="row">
      <div className="col-md-4 mb-3">
        <div className="card">
        <img src={user.profileImage || 'placeholder-profile.png'} alt="Profile" className="img-fluid rounded-circle mb-3" />
            {isEditMode && (
              <div className="mb-3">
                <input type="file" className="form-control" id="profileImage" onChange={handleImageChange} />
              </div>
            )}
          <div className="card-body">
            <h5 className="card-title">{user.name}</h5>
            <p className="card-text">{user.email}</p>
            <p className="card-text"><small className="text-muted">{user.role}</small></p>
            <div className="d-grid gap-2">
              <button onClick={toggleEditMode} className="btn btn-primary">{isEditMode ? 'Save Profile' : 'Edit Profile'}</button>
              <button onClick={handleLogout} className="btn btn-outline-secondary">Logout</button>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-8">
        <div className="card">
          <div className="card-body">
            <form onSubmit={isEditMode ? handleUpdateProfile : handlePasswordChange}>
              {/* Editable fields */}
              <div className="mb-3">
                <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                <input type="tel" className="form-control" id="phoneNumber" name="phoneNumber" value={user.phoneNumber} onChange={handleInputChange} disabled={!isEditMode} />
              </div>
              <div className="mb-3">
                <label htmlFor="secondaryEmail" className="form-label">Secondary Email</label>
                <input type="email" className="form-control" id="secondaryEmail" name="secondaryEmail" value={user.secondaryEmail} onChange={handleInputChange} disabled={!isEditMode} />
              </div>
              <div className="mb-3">
                <label htmlFor="skills" className="form-label">Skills</label>
                <div className="d-flex flex-wrap gap-2">
                  {user.skills.map((skill, index) => (
                    <span key={index} className="badge bg-secondary">
                      {skill}
                      {isEditMode && <button type="button" className="btn-close ms-2" onClick={() => removeSkill(skill)} aria-label="Close"></button>}
                    </span>
                  ))}
                  {isEditMode && (
                    <input type="text" className="form-control" id="skills" placeholder="Add skill" onKeyPress={handleSkillInputChange} />
                  )}
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="biography" className="form-label">Biography</label>
                <textarea className="form-control" id="biography" name="biography" value={user.biography} onChange={handleInputChange} disabled={!isEditMode}></textarea>
              </div>
              {!isEditMode && (
                <>
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">New Password</label>
                    <input type="password" className="form-control" id="newPassword" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                    <input type="password" className="form-control" id="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                  </div>
                  <button type="submit" className="btn btn-primary">Update Password</button>
                </>
              )}
              {isEditMode && <button type="submit" className="btn btn-success">Save Changes</button>}
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
);

};

export default UserProfile;
