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
  baseName: {
    type: String
  },
  totalPageNum: {
    type: Number
  },
  mimetype: {
    type: String
  },
  size: {
    type: Number
  },
  bgAudio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Audio"
  },
  pageAudios: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Audio"
    }
  ],
  published: {
    type: Boolean,
    default: false
  },
  created: {
    type: Date,
    required: true,
    default: Date.now
  }
})

module.exports = mongoose.model('Pdf', pdfSchema)