const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
  authId: String,
  name: String,
  email: String,
  password: String,
  role: String,
  created: Date,
  updated: Date
})
const UserTDTU = mongoose.model('UserTDTU', userSchema)
module.exports = UserTDTU