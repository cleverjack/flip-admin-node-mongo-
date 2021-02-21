const express = require('express')
const router = express.Router()
const Pdf = require('../models/pdf')
const PdfController = require('../controllers/pdfController')
const multer = require('multer');
const path = require('path')
const jwt = require('jsonwebtoken');

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
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
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

const accessTokenSecret = 'youraccesstokensecret';
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
      const token = authHeader.split(' ')[1];

      jwt.verify(token, accessTokenSecret, (err, user) => {
          if (err) {
              return res.sendStatus(403);
          }

          req.user = user;
          next();
      });
  } else {
      res.sendStatus(401);
  }
};

// Getting all pdfs
router.get('/', authenticateJWT, PdfController.index);
router.get('/get-published-pdfs', authenticateJWT, PdfController.getPublishedPdfs);
router.post('/upload', authenticateJWT, multer({ storage: pdfstorage }).single('file'), PdfController.upload);
router.post('/upload-audio', authenticateJWT, multer({ storage: audiostorage }).single('file'), PdfController.uploadAudio);
router.post('/upload-video', authenticateJWT, multer({ storage: videostorage }).single('file'), PdfController.uploadVideo);
router.delete('/delete-pdf/:id', authenticateJWT, PdfController.deletePdf);
router.delete('/delete-video/:id', authenticateJWT, PdfController.deleteVideo);
router.delete('/delete-audio/:id', authenticateJWT, PdfController.deleteAudio);
router.get('/pdf/:id', authenticateJWT, PdfController.getPdf);
router.post('/publish-pdf/:id', authenticateJWT, PdfController.publishPdf);
router.get('/pdf-audios/:id', authenticateJWT, PdfController.getPdfAudios);
router.get('/get-audio', authenticateJWT, PdfController.getAudio);
router.get('/videos', authenticateJWT, PdfController.getVideos);

router.get('/testConvertPdf', authenticateJWT, PdfController.testConvertPdf);

module.exports = router 