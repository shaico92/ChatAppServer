const PORT = 4000;

const io = require("socket.io")(PORT);
console.log("server up");
const users = {};

io.on("connection", (socket) => {
  socket.on("new-user", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-connected", name);
    console.log(name);
  });

  socket.on("send-chat-message", (message) => {
    socket.broadcast.emit("chat-message", {
      message: message,
      name: users[socket.id],
    });
    //socket.broadcast.emit("chat-message", message);
  });
});

console.log(`Server runninh on port ${PORT}`);
