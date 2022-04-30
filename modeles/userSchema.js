const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
  username: { type: String, required: true },

  password: { type: String, required: true, unique: true },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
});
const users = mongoose.model("users", userSchema);
//modele export

module.exports = users;
