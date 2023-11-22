// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const corsOptions = require('./config/corsOptions'); // Adjust the path if necessary
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const taskCommentRoutes = require('./routes/taskCommentRoutes');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
app.use(cors(corsOptions));

// Middleware for parsing request bodies
app.use(express.json());

// Connect to MongoDB (replace `db_url` with your actual database URL)
// Database connection
const dbUri = process.env.MONGODB_URI;
mongoose.connect(dbUri)
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
app.use('/projects', taskRoutes);
app.use('/tasks', taskCommentRoutes);

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
// In app.js
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));
};

// Rest of your Express app setup code...
module.exports = app; // Export your Express app so that it can be required in your test files.
