const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  user: {
    type: String,
    require: true,
  },
  userTag: {
    type: String,
    require: true,
  },
  score: {
    type: Number,
    require: true,
  },
});

module.exports = mongoose.model("Users", UserSchema);
