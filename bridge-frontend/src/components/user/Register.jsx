// Import necessary components and icons
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  Grid,
  Avatar,
  CssBaseline,
  FormControlLabel,
  Checkbox,
  Link,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import skillsList from "./skills.json";

const Register = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "user",
    skills: [],
  });
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  // Predefined list of skills

  const skillsOptions = skillsList.reduce((acc, current) => {
    const skills = current.skills.map((skill) => ({
      title: skill,
      category: current.category,
    }));
    return [...acc, ...skills];
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    if (e.target.name === "username") {
      // Reset username error
      setUsernameError("");
      // TODO: Implement logic to check if username is unique
      checkUniqueUsername(e.target.value);
    } else if (e.target.name === "confirmPassword") {
      // Check for password match
      if (userData.password && userData.password !== e.target.value) {
        setPasswordError("Passwords do not match");
      } else {
        setPasswordError("");
      }
    }
  };

  const checkUniqueUsername = async (username) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/users/check-username/${username}`
      );
      const isUniqueUsername = response.data.isUnique;
      if (!isUniqueUsername) {
        setUsernameError("Username is already taken");
      }
    } catch (err) {
      console.error(err);
      setUsernameError("Error checking username");
    }
  };

  const handleSkillChange = (event, value) => {
    setUserData({ ...userData, skills: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check password match
    if (userData.password !== userData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/users/register",
        userData
      );
      // Redirect to login page or dashboard after successful registration
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={12}
        elevation={6}
        square
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Card sx={{ margin: 2, padding: 3, maxWidth: 450 }}>
          {" "}
          {/* Increased maxWidth here */}
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <form onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                name="firstName"
                label="First Name"
                fullWidth
                margin="normal"
                variant="outlined"
                value={userData.firstName}
                onChange={handleChange}
                required
              />
              <TextField
                name="lastName"
                label="Last Name"
                fullWidth
                margin="normal"
                variant="outlined"
                value={userData.lastName}
                onChange={handleChange}
                required
              />
              <TextField
                name="username"
                label="Username"
                fullWidth
                margin="normal"
                variant="outlined"
                value={userData.username}
                onChange={handleChange}
                required
                error={!!usernameError}
                helperText={usernameError}
              />
              <TextField
                name="email"
                label="Email Address"
                fullWidth
                margin="normal"
                variant="outlined"
                value={userData.email}
                onChange={handleChange}
                required
              />
              <TextField
                name="password"
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                variant="outlined"
                value={userData.password}
                onChange={handleChange}
                required
              />
              <TextField
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                fullWidth
                margin="normal"
                variant="outlined"
                value={userData.confirmPassword}
                onChange={handleChange}
                required
                error={!!passwordError}
                helperText={passwordError}
              />
              <Autocomplete
                multiple
                id="skills"
                options={skillsOptions}
                groupBy={(option) => option.category}
                getOptionLabel={(option) => option.title}
                value={userData.skills}
                onChange={handleSkillChange}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option.title}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Skills"
                    placeholder="Add skills"
                    margin="normal"
                    fullWidth
                  />
                )}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              {error && <Alert severity="error">{error}</Alert>}
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/login" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Register;
