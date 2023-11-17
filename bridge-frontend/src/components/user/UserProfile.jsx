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
      const response = await axios.post(
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
    <div className="container mt-5" style={{ overflow: "auto" }}>
      <h2>Profile</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card card-body">
        {isEditMode ? (
          // Edit Mode
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-3">
              {user.profileImage && (
                <img src={user.profileImage} alt="Profile" />
              )}
              <label htmlFor="profileImage" className="form-label">
                Profile Picture
              </label>
              <input
                type="file"
                className="form-control"
                id="profileImage"
                onChange={handleImageChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={user.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="phoneNumber" className="form-label">
                Phone Number
              </label>
              <input
                type="text"
                className="form-control"
                id="phoneNumber"
                name="phoneNumber"
                value={user.phoneNumber}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="secondaryEmail" className="form-label">
                Secondary Email
              </label>
              <input
                type="email"
                className="form-control"
                id="secondaryEmail"
                name="secondaryEmail"
                value={user.secondaryEmail}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="skills" className="form-label">
                Skills and Expertise
              </label>
              <div className="d-flex flex-wrap gap-2">
                {newSkills.map((skill, index) => (
                  <span key={index} className="badge bg-secondary">
                    {skill}
                    <button
                      type="button"
                      className="btn-close btn-close-white ms-2"
                      onClick={() => removeSkill(skill)}
                      aria-label="Remove"
                    ></button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                className="form-control mt-2"
                id="skills"
                placeholder="Enter skill and press Enter"
                onKeyDown={handleSkillInputChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="biography" className="form-label">
                Biography
              </label>
              <textarea
                className="form-control"
                id="biography"
                name="biography"
                value={user.biography}
                onChange={handleInputChange}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </form>
        ) : (
          // View Mode
          <>
            {user.profileImage && <img src={user.profileImage} alt="Profile" />}
            <p>
              <strong>Name:</strong> {displayValue(user.name)}
            </p>
            <p>
              <strong>Email:</strong> {displayValue(user.email)}
            </p>
            <p>
              <strong>Role:</strong> {displayValue(user.role)}
            </p>
            <p>
              <strong>Phone Number:</strong> {displayValue(user.phoneNumber)}
            </p>
            <p>
              <strong>Secondary Email:</strong>{" "}
              {displayValue(user.secondaryEmail)}
            </p>
            <p>
              <strong>Skills:</strong> {displayValue(user.skills)}
            </p>
            <p>
              <strong>Biography:</strong> {displayValue(user.biography)}
            </p>
            <button onClick={toggleEditMode} className="btn btn-secondary">
              Edit Profile
            </button>
          </>
        )}

        <hr />

        {/* Password Change Form */}
        <div>
          <form onSubmit={handlePasswordChange}>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">
                New Password
              </label>
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
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm New Password
              </label>
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
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Update Password
            </button>
          </form>
        </div>
        <div>
        <button onClick={handleLogout} className="btn btn-outline-danger">
          Logout
        </button>
        </div>
        
      </div>
    </div>
  );
};

export default UserProfile;
