const mongoose = require("mongoose");

mongoose.connect = "mongodb://127.0.0.1:27017/PaytmDatabase";

const UserScehma = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    min: 3,
    max: 10,
  },
  password: {
    type: String,
    required: true,
    min: 10,
  },
  firstName: {
    type: String,
    required: true,
    max: 20,
  },
  lastName: { type: String, required: true, max: 20 },
});

const user = mongoose.model("User", UserScehma);

module.exports = {
  user,
};
