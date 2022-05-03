const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = Schema({
  username: { type: String, unique: true },
  password: { type: String },
  isAdmin: { type: Boolean, default: false },
})
const User = mongoose.model('User', userSchema)
//modele export

module.exports = User
