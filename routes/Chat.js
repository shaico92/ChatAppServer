var express = require("express");
var router = express.Router();
const users = [];
const PORT = 4000;
var User = require("../models/Users");
const io = require("socket.io")(PORT);

let chatRooms = [
  { roomId: 1, roomName: "room_1", roomAdmin: "admin1" },
  { roomId: 2, roomName: "room_2", roomAdmin: "admin2" },
  { roomId: 3, roomName: "room_3", roomAdmin: "admin3" },
];

const getRoomPort = (roomNum) => {
  let roomPort = null;
  chatRooms.forEach((room) => {
    if (room.roomId === roomNum) {
      roomPort = room.port;
    }
  });
  return roomPort;
};

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
    return res.status(200).json({});
  }
  next();
});

router.post("/createRoom", async (req, res) => {
  const roomProperties = req.body;

  await chatRooms.push(roomProperties);
});

router.get("/", async (req, res) => {
  await res.send(chatRooms);
});

router.get("/:id", async (req, res) => {
  const roomNum = req.params.id;

  res.send(true);
});

io.sockets.on("connection", (client) => {
  const clientID = client.id;
  client.on("new-user", (data) => {
    client.join(data.room);

    const color = Math.floor(Math.random() * 16777215).toString(16);
    users.push({
      clientId: clientID,
      name: data.name,
      color: color,
      room: data.room,
    });

    //users[client.id] = name;
    //client.emit("user-connected", name);
    const content = { room: data.room, name: data.name };
    client.to(content.room).broadcast.emit("user-connected", content);
  });
  client.on("send-chat-message", (message) => {
    let name = null;
    let color = null;
    let room = null;
    users.forEach((e) => {
      if (e.clientId === clientID) {
        name = e.name;
        color = e.color;
        room = e.room;
      }
    });
    // if (message.content.includes("blob:http://localhost:3000")) {
    //   client.to(1).broadcast.emit("chat-message", {
    //     voice: message,
    //     name: name,
    //     color: color,
    //   });
    // }

    // else {
    client.to(room).broadcast.emit("chat-message", {
      message: message,
      name: name,
      color: color,
    });
    // }

    //client.broadcast.emit("chat-message", message);
  });
});

// io.sockets.on("connection", (client) => {
//     const clientID = client.id;
//     client.on("new-user", (name) => {
//       const color = Math.floor(Math.random() * 16777215).toString(16);
//       users.push({ clientId: clientID, name: name, color: color });

//       //users[client.id] = name;
//       //client.emit("user-connected", name);
//       client.broadcast.emit("user-connected", name);
//     });
//     client.on("send-chat-message", (message) => {
//       let name = null;
//       let color = null;
//       users.forEach((e) => {
//         if (e.clientId === clientID) {
//           name = e.name;
//           color = e.color;
//         }
//       });
//       if (message.includes("blob:http://localhost:3000")) {
//         client.broadcast.emit("chat-message", {
//           voice: message,
//           name: name,
//           color: color,
//         });
//       } else {
//         client.broadcast.emit("chat-message", {
//           message: message,
//           name: name,
//           color: color,
//         });
//       }

//       //client.broadcast.emit("chat-message", message);
//     });
//   });
//   console.log(`Chat Server Socket runninh on port ${PORT}`);

module.exports = router;
