const mongoose = require('mongoose')

const pdfSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  mimetype: {
    type: String
  },
  size: {
    type: Number
  },
  created: {
    type: Date,
    required: true,
    default: Date.now
  }
})

module.exports = mongoose.model('Pdf', pdfSchema)