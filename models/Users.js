const mongoose = require("mongoose");
const passportlocalmongoose = require("passport-local-mongoose");

//sets how the obj will be in the DB
var UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
});

//This users the passportlocalmongoose libs to implement on the user mode
UserSchema.plugin(passportlocalmongoose);
//must be declared after plugin
var User = mongoose.model("User", UserSchema);
//exports the user model to use in other files
module.exports = User;
