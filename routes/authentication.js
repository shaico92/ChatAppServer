var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/Users");
const path= require('path');
const multer  = require('multer')

const upload = multer()

const fs = require("fs"); 
const { promisify } = require("util");
const pipeline = promisify(require('stream').pipeline)



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
router.get("/", (req, res) => {});

//checks if user exists
const checkUserExist = (userEmail) => {
  return User.findOne({ email: userEmail }).exec();
};
const checkUserCredMatch = (userEmail, userPass) => {
  return User.findOne({ email: userEmail, password: userPass }).exec();
};

//adding user to db
const addUserToDB = (userName, userPass, userEmail,userImage) => {
  const user_ = { username: userName, password: userPass, email: userEmail,image:userImage };
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
router.post("/register",upload.single('file'), async (req, res) => {
  //const username = req.body;
  
  const user = req.body;
  const file = req.file;
  if (file.detectedFileExtension!=='.jpg') next(new Error("invalid file type")) ;
  const fileName = user.name + Math.floor(Math.random*1000 )+ file.detectedFileExtension;
  const imagePath =`${__dirname}/../public/uploads/${fileName}`
  await pipeline(file.stream, fs.createWriteStream(`${__dirname}/../public/uploads/${fileName}`))
  
  const result = await checkUserExist(user.email);
  

  if (result !== null || result > 0) {
    res.send("A user with this email address already exists");
  } else {
  
      addUserToDB(user.name, user.password, user.email,imagePath);
    res.send("user in");
  }
    
  
});

//Login route
router.get("/login", (req, res) => {
  res.render("auth/login");
});

//submitting the signin post route
router.post("/login", async (req, res) => {
  const user = req.body;
  const result = await checkUserCredMatch(user.email, user.password);
  const name = result._doc.username;
  if ((result !== null) | (result > 0)) {
    const answer = { answer: true, name: name };
    res.send(answer);
  } else {
    res.send("Wrong email or password");
  }
});

//logout route
router.get("/logout", function (req, res) {
  req.logOut();

  req.flash("success", "logged you out!");
  res.redirect("/campgrounds");
});

module.exports = router;
