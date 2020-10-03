// const PORT = 4000;
// const io = require("socket.io")(PORT);
console.log("server up");
const path = require("path");
(bodyParser = require("body-parser")),
  (express = require("express")),
 session = require('express-session'),
 (cookieParser = require('cookie-parser'))

  (mongoose = require("mongoose")),
  (logged = false);
app = express();

const TWO_HOURS = 1000*60*60*2

const {
  PORT = 5000,
  NODE_ENV = 'development',
   SESS_NAME= 'sid',
  SESS_LIFETIME = TWO_HOURS,
  SESS_SECRET = "ChatApp_is_for_u"
} = process.env

const IN_PROD = NODE_ENV ==='production'

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

// app.use(session({
//   name : SESS_NAME,
//   cookie: {
//     maxAge : SESS_LIFETIME,
//     sameSite : true, //strict
//     secure : IN_PROD,

//   },
//   secret: SESS_SECRET,
//   resave: false,
  
//   saveUninitialized: false,
//   }
//   ))
 
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, "public")));
// responsible for reading the session and encoding the session and decoding it

app.use(authRoutes);
app.use("/chats", chatRoutes);
app.set("view engine", "jade");

//listen
app.listen(PORT, () => {
  console.log("Server is running ");

  //console.log(timestamp);
});
