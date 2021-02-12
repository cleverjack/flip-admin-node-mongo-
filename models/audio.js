const mongoose = require('mongoose')

const audioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  pdfId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pdf'
  },
  pageNum: {
    type: Number
  },
  type: {
    type: Number // 0: backgruond audio, 1: page audio
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

module.exports = mongoose.model('Audio', audioSchema)