const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Middleware for parsing request bodies
app.use(express.json());

// Connect to MongoDB (replace `db_url` with your actual database URL)
// Database connection
mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB.', err));

// Simple logging middleware to log each request to the console
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Use Routes
app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('tasks', taskRoutes);

// Handling 404
app.use((req, res, next) => {
  res.status(404).json({ error: "Not found" });
});

// Error handling middleware for any server errors
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message || "Internal Server Error",
    },
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Rest of your Express app setup code...
module.exports = app; // Export your Express app so that it can be required in your test files.
