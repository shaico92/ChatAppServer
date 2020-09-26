var express = require("express");
var router = express.Router();

const PORT = 4000;
const io = require("socket.io")(PORT);

let chatRooms = [
  { roomName: "room_1", roomAdmin: "admin1" },
  { roomName: "room_2", roomAdmin: "admin2" },
  { roomName: "room_3", roomAdmin: "admin3" },
];
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
  console.log(roomProperties);
  await chatRooms.push(roomProperties);
});

router.get("/", async (req, res) => {
  await res.send(chatRooms);
});

router.get("/:id", async (req, res) => {
  const smth = req.params.id;
  await console.log(smth);
});

// io.sockets.on("conn ection", (client) => {
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
