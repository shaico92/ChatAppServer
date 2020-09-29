var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/Users");
const path= require('path');
const multer  = require('multer')
var fileUrl = require('file-url');
const upload = multer()

const fs = require("fs"); 
const { promisify } = require("util");
const pipeline = promisify(require('stream').pipeline)

const fileUrlConverter=(str)=> {
  if (typeof str !== 'string') {
      throw new Error('Expected a string');
  }

  let pathName = path.resolve(str).replace(/\\/g, '/');

  // Windows drive letter must be prefixed with a slash
  if (pathName[0] !== '/') {
      pathName = '/' + pathName;
  }

  return encodeURI('file://' + pathName);
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
  const fileName = Date.now()+user.name + file.detectedFileExtension;
  // fs.mkdir(`${__dirname}/../public/uploads/${user.email}_`, function(err) {
  //   if (err) {
  //     console.log(err)
  //   } else {
  //     console.log("New directory successfully created.")
  //   }
  // })
  
  // const urlFile=fileUrlConverter(imagePath);
  
  await pipeline(file.stream, fs.createWriteStream(fileName))
  
  const result = await checkUserExist(user.email);
  

  if (result !== null || result > 0) {
    res.send("A user with this email address already exists");
  } else {
  
      addUserToDB(user.name, user.password, user.email,fileName);
    res.send("user in");
  }
    
  
});

//Login route

//submitting the signin post route
router.post("/login", async (req, res) => {
  const user = req.body;
  const result = await checkUserCredMatch(user.email, user.password);
  const name = result._doc.username;
  //path for image
  const imagepath = result._doc.image;
  if ((result !== null) | (result > 0)) {
    //here the image path is in a file:// format what should i do instead?
    const answer = { answer: true, name: name, image: imagepath};
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
