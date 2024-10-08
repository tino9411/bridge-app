// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const corsOptions = require('./config/corsOptions'); // Adjust the path if necessary
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const phaseRoutes = require('./routes/phaseRoutes');
const milestoneRoutes = require('./routes/milestoneRoutes');
const taskCommentRoutes = require('./routes/taskCommentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const requestRoutes = require('./routes/requestRoutes');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', // Update this with your front-end URL for production
    methods: ["GET", "POST"]
  }
});
app.use(cors(corsOptions));

// Middleware for parsing request bodies
app.use(express.json());

// Connect to MongoDB (replace `db_url` with your actual database URL)
// Database connection
const dbUri = process.env.MONGODB_URI;
mongoose.connect(dbUri)
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB.', err));

// WebSocket connection
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  // Handle user-specific rooms
  socket.on('joinRoom', (userId) => {
    socket.join(userId); // Join a room with the user's ID
    console.log(`Socket ${socket.id} joined room: ${userId}`);
  });

  // Listen for events from clients and broadcast them to specific rooms
  socket.on('sendMessage', ({ userId, message }) => {
    socket.to(userId).emit('messageReceived', message); // Send the message to the specific room
  });


  // Define more socket events as needed
});

// Simple logging middleware to log each request to the console
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  req.io = io;
  next();
});

// Use Routes
app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('/projects', taskRoutes);
app.use('/tasks', taskCommentRoutes);
app.use('/projects', phaseRoutes);
app.use('/projects', milestoneRoutes);
app.use('/notifications', notificationRoutes);
app.use('/messages', messageRoutes);
app.use('/requests', requestRoutes);

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
// At the end of server.js
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));


// Rest of your Express app setup code...
module.exports = { app, io }; // Export your Express app so that it can be required in your test files.
