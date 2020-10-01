// const PORT = 4000;
// const io = require("socket.io")(PORT);
console.log("server up");
const path = require("path");
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
    resave: true,
    saveUninitialized: true,
  })
);
app.use("/public", express.static(path.join(__dirname, "public")));
// responsible for reading the session and encoding the session and decoding it

app.use(authRoutes);
app.use("/chats", chatRoutes);
app.set("view engine", "jade");

//listen
app.listen(5000, () => {
  console.log("Server is running ");

  //console.log(timestamp);
});
