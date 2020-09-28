var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/Users");
const fs = require('fs')
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
router.post("/register", async (req, res) => {
  //const username = req.body;
  
  const user = req.body;
  fs.readFile(user.image,(err,data)=>{
    if (err) {
      console.log(err);
    }else{
      const newPath = __dirname+"public/uploads/"+user.image;
    fs.writeFile(newPath,data,(err)=>{

    })
    }
    
  })
  console.log(user);
  const result = await checkUserExist(user.email);
  

  if (result !== null || result > 0) {
    res.send("A user with this email address already exists");
  } else {
    if (user.image) {
      const image = "uploads/"+user.image;    
      addUserToDB(user.name, user.password, user.email,image);
    res.send("user in");
  }else{
    addUserToDB(user.name, user.password, user.email,'image');
    res.send("user in");
  }
    
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
