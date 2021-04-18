const mongoose = require("mongoose");

const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  name: String,
  password: String,
  numberOfConnections: {
    type: Number,
    default: 0,
  },
  role: {
    type: String,
    default: "user",
  },
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", UserSchema);

module.exports = User;
