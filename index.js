
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const http = require("http")
const {Server} = require('socket.io')
const ConnectDB = require("./Connect");

// Import routes
const authRoutes = require("./Routes/authRoutes")
const chatRoutes = require("./Routes/ChatRoutes")
const roomRoutes = require("./Routes/roomRoutes")
const userRoutes = require("./Routes/userRoutes")

// Middleware
const authMiddleware = require("./Middleware/authMiddlware");

const app = express();

// Connect DB


// Body parser
app.use(express.json());

// allow frontend
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173", 
  credentials: true
}));
const server = http.createServer(app)

// setup io

const io = new Server(server,{
  cors:{
    origin: "http://localhost:5173",
    methods: ["Get", "Post"]
  }
})

app.use((req,res,next)=>{
  req.io = io;
  next()
})

// Routes
app.use("/api/auth", authRoutes); // signup/login
app.use("/api/chats", authMiddleware, chatRoutes); // protected
app.use("/api/rooms", authMiddleware, roomRoutes); // protected
app.use("/api/users", authMiddleware, userRoutes); // protected

const PORT = process.env.PORT || 3030;

// socket listenres

io.on("connection", (socket)=>{
  console.log("New clicent connected", socket.id)
  socket.on("joinRoom", (roomId)=>{
    socket.join(roomId)
    console.log(`User ${socket.id} joined room ${roomId}`)
  })
  socket.on("disconnect", ()=>{
    console.log('Client is disconnected', socket.id)
  })
})




ConnectDB()


server.listen(PORT , ()=>{
    console.log(`My Server is listening port localhost${PORT}`)
})

