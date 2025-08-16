const express = require("express");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http'); // Import http module
const { Server } = require("socket.io"); // Import Socket.IO Server class

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Create HTTP server from Express app
const httpServer = http.createServer(app);

// CORS Configuration
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['http://localhost:3000', 'https://devtrack-project-management.netlify.app'];


console.log('Allowed CORS origins:', allowedOrigins);

// Configure Socket.IO with CORS
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Example: Listen for a 'join_project' event
  socket.on("join_project", (projectId) => {
    socket.join(projectId);
    console.log(`User ${socket.id} joined project: ${projectId}`);
  });

  // Example: Listen for a 'send_message' event
  socket.on("send_message", (data) => {
    // Emit the message to all clients in the project room
    io.to(data.projectId).emit("receive_message", data);
    console.log(`Message sent to project ${data.projectId}: ${data.message}`);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// Middleware - CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
}));

app.use(express.json());

const {dbConnect} = require("./config/dbConnect")
const UserRouter = require("./router/authRouter");
const ProjectRouter = require("./router/projectRouter");
const ticketRouter = require("./router/ticketRouter")


// connect with database
dbConnect();

// Monitor MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
  console.log('Attempting to reconnect...');
  connectWithRetry();
});

// import all route
app.use("/api/v1", UserRouter);
app.use('/api/projects', ProjectRouter);
app.use("api/ticket", ticketRouter);


// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to DevTrack API' });
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => { // Use httpServer.listen instead of app.listen
  console.log(`Server and Socket.IO are running on port ${PORT}`);
}); 
