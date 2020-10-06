var express = require("express");
var router = express.Router();

var User = require("../models/Users");
const path = require("path");
const multer = require("multer");
var fileUrl = require("file-url");
const upload = multer();

const fs = require("fs");
const { promisify } = require("util");
const { log } = require("console");

const pipeline = promisify(require("stream").pipeline);

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
router.get("/", (req, res) => {
  res.send("myFirstCookielooks good");

  // if (sessions.length > 0) {
  //   sessions.forEach((session) => {
  //     if (session.email === req.session.email) {
  //       res.send(`${session.email} is logged in`);
  //     } else {
  //       res.send(`${session.email} is  not logged in`);
  //     }
  //   });
  // } else {
  //   res.send(`no user is logged in`);
  // }
  // if (!Session.id) {
  //   res.send("no session yet");
  // } else {
  //   res.send(Session.id);
  // }
});

const setUserSession = (userEmail, req) => {
  // Session.id = req.session.id;
  // Session.email = userEmail;
  // sess.email = userEmail;
  // if (sessions.length > 0) {
  //   sessions.forEach((element) => {
  //     if (element.email === sess.email) {
  //     } else {
  //       sessions.push(sess);
  //     }
  //   });
  // } else {
  //   sessions.push(sess);
  // }
};

//checks if user exists
const checkUserExist = (userEmail) => {
  return User.findOne({ email: userEmail }).exec();
};
const checkUserCredMatch = (userEmail, userPass) => {
  return User.findOne({ email: userEmail, password: userPass }).exec();
};

//adding user to db
const addUserToDB = (userName, userPass, userEmail, userImage) => {
  const user_ = {
    username: userName,
    password: userPass,
    email: userEmail,
    image: userImage,
  };
  const user = new User(user_, (err) => {
    if (err) {
      console.log("schema doesnt match");
    }
    {
    }
  });
  user.save();
};

//============
//AUTH ROUTES
//============

//regitster post route
router.post("/register", upload.single("file"), async (req, res) => {
  //const username = req.body;

  const user = req.body;
  const file = req.file;
  if (
    file.detectedFileExtension !== ".jpg" ||
    file.detectedFileExtension !== ".PNG"
  ) {
  }
  const fileName = Date.now() + user.name + file.detectedFileExtension;

  await pipeline(
    file.stream,
    fs.createWriteStream(`./public/uploads/${fileName}`)
  );

  const result = await checkUserExist(user.email);

  if (result !== null || result > 0) {
    res.send("A user with this email address already exists");
  } else {
    addUserToDB(user.name, user.password, user.email, fileName);

    res.send("user in");
  }
});

//Login route

//submitting the signin post route
router.post("/login", async (req, res) => {
  const user = req.body;

  const result = await checkUserCredMatch(user.email, user.password);
  const mama = result.id;
  const name = result._doc.username;
  const email = result._doc.email;
  const userID = result.id;

  setUserSession(user.email, req);
  //path for image
  const imagepath = result._doc.image;
  if ((result !== null) | (result > 0)) {
    //here the image path is in a file:// format what should i do instead?
    const answer = {
      answer: true,
      name: name,
      image: imagepath,

      email: email,
    };
    res.send(answer);
  } else {
    res.send("Wrong email or password");
  }
});

//logout route
router.post("/logout", (req, res) => {
  console.log("logging out");
  res.send("delete cookie");
});

module.exports = router;
