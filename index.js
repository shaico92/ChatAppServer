// const PORT = 4000;
// const io = require("socket.io")(PORT);
console.log("server up");
const users = [];
(bodyParser = require("body-parser")),
  (express = require("express")),
  (mongoose = require("mongoose")),
  (logged = false);
app = express();
//dependencies for passport
var passport = require("passport");
var LocalStrategy = require("passport-local");

//initialize DB
mongoose.connect(
  "mongodb://localhost:27017/ChatApp",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("mongo server connected");
  }
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//inside modules

const User = require("./models/Users");
//routes dependencies
// var commentRoutes = require("./routes/comments");
// var campgroundRoutes = require("./routes/campgrounds");
const authRoutes = require("./routes/authentication");
const chatRoutes = require("./routes/Chat");
//passport configuration
/******************************** */
app.use(
  require("express-session")({
    secret: "ChatApp is for u",
    resave: false,
    saveUninitialized: false,
  })
);
// responsible for reading the session and encoding the session and decoding it

app.use(authRoutes);
app.use("/chats", chatRoutes);
app.set("view engine", "jade");

// io.sockets.on("conn ection", (client) => {
//   const clientID = client.id;
//   client.on("new-user", (name) => {
//     const color = Math.floor(Math.random() * 16777215).toString(16);
//     users.push({ clientId: clientID, name: name, color: color });

//     //users[client.id] = name;
//     //client.emit("user-connected", name);
//     client.broadcast.emit("user-connected", name);
//   });
//   client.on("send-chat-message", (message) => {
//     let name = null;
//     let color = null;
//     users.forEach((e) => {
//       if (e.clientId === clientID) {
//         name = e.name;
//         color = e.color;
//       }
//     });
//     if (message.includes("blob:http://localhost:3000")) {
//       client.broadcast.emit("chat-message", {
//         voice: message,
//         name: name,
//         color: color,
//       });
//     } else {
//       client.broadcast.emit("chat-message", {
//         message: message,
//         name: name,
//         color: color,
//       });
//     }

//     //client.broadcast.emit("chat-message", message);
//   });
// });
// console.log(`Chat Server Socket runninh on port ${PORT}`);

//listen
app.listen(5000, () => {
  console.log("Server is running ");

  //console.log(timestamp);
});
