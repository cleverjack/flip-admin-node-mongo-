const express = require('express')
const router = express.Router()
const Pdf = require('../models/pdf')
const PdfController = require('../controllers/pdfController')
const multer = require('multer');
const path = require('path')

const pdfstorage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'uploads/');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const audiostorage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'uploads/audio/');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function(req, file, cb) {
      cb(null, 'flip.mp3');
  }
});

const videostorage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'uploads/videos/');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Getting all pdfs
router.get('/', PdfController.index);
router.post('/upload', multer({ storage: pdfstorage }).single('file'), PdfController.upload);
router.post('/upload-audio', multer({ storage: audiostorage }).single('file'), PdfController.uploadAudio);
router.post('/upload-video', multer({ storage: videostorage }).single('file'), PdfController.uploadVideo);
router.delete('/delete-pdf/:id', PdfController.deletePdf);
router.delete('/delete-video/:id', PdfController.deleteVideo);

router.get('/get-audio', PdfController.getAudio);
router.get('/videos', PdfController.getVideos);

module.exports = router 