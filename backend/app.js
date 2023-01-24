const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const app = express();

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log("user Id: " + socket.id + "joined room: " + data);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("recieve_message", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});
server.listen(8000, () => console.log("running on 8000"));
