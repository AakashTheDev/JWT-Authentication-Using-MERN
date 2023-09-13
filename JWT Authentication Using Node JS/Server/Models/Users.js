const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  Name: String,
  Email: {
    type: String,
    unique: true,
  },
  Password: String,
  Role: {
    type: String,
    default: "User",
  },
});

const userModel = mongoose.model("Users", userSchema);

module.exports = userModel;
