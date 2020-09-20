const PORT = 4000;

const io = require("socket.io")(PORT);
console.log("server up");
const users = [];

io.sockets.on("connection", (client) => {
  const clientID = client.id;
  client.on("new-user", (name) => {
    const color = Math.floor(Math.random() * 16777215).toString(16);
    users.push({ clientId: clientID, name: name, color: color });

    //users[client.id] = name;
    client.emit("user-connected", name);
    client.broadcast.emit("user-connected", name);
  });
  client.on("send-chat-message", (message) => {
    let name = null;
    let color = null;
    users.forEach((e) => {
      if (e.clientId === clientID) {
        name = e.name;
        color = e.color;
      }
    });
    if (message.includes("blob:http://localhost:3000")) {
      client.broadcast.emit("chat-message", {
        voice: message,
        name: name,
        color: color,
      });
    } else {
      client.broadcast.emit("chat-message", {
        message: message,
        name: name,
        color: color,
      });
    }

    //client.broadcast.emit("chat-message", message);
  });
});
console.log(`Server runninh on port ${PORT}`);
