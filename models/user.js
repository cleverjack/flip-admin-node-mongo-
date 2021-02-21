const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  phone: {
    type: String,
  },
  password: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  role: {
    type: Number,
    default: 1
  },
  created: {
    type: Date,
    required: true,
    default: Date.now
  }
})

module.exports = mongoose.model('User', userSchema)