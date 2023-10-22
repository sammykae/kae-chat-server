const express = require("express");
const cors = require("cors");
const socket = require("socket.io");
const userRoutes = require("./routes/userRoutes");
const messageRoute = require("./routes/messageRoutes");
const chatRoute = require("./routes/chatRoutes");
const connectDB = require("./config/dbconfig");
const { errorHandler, notFound } = require("./MiddleWare");
require("dotenv").config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);

app.get("/", (req, res) => {
  res.send("Server is running");
});
app.use(notFound);
app.use(errorHandler);

const server = app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});

// Create an instance of socket
const io = socket(server, {
  pingTimeout: 30000,
  cors: {
    origin: process.env.FRONT_END_URL,
    // credential: true,
  },
});

// Check for connection to client
io.on("connection", (socket) => {
  // Connected to socket

  // listen for a 'setup' event from client
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  // listen for a 'join chat' event from client
  socket.on("join chat", (room) => {
    // A user opened a chat
    socket.join(room);
  });

  // listen for a 'typing' event from client
  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  // listen for a 'stop typing' event from client
  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  /* listen for a 'new message' event from
   client and send to other clients in the chat */
  socket.on("new message", (newMessage) => {
    let chat = newMessage.chat;
    if (!chat.users) {
      // No user in chat defined
      return;
    }
    chat.users.forEach((user) => {
      if (user._id == newMessage.sender._id) {
        return;
      }
      socket.in(user._id).emit("message received", newMessage);
    });
  });

  socket.off("setup", () => {
    socket.leave(userData._id);
  });
});
