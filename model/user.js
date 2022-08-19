const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/819");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  imgurl: String,
  username: String,
  password: String,
});

const User = mongoose.model("User", userSchema, "user");
module.exports = User;
