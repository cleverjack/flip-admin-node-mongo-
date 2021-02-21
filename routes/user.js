const express = require('express')
const router = express.Router()
const Pdf = require('../models/pdf')
const PdfController = require('../controllers/pdfController')
const UserController = require('../controllers/userController');
const multer = require('multer');
const path = require('path')

// Getting all pdfs
router.post('/login', UserController.login);
router.post('/register', UserController.register);
router.post('/reset-password', UserController.resetPassword);
router.post('/forgot-password', UserController.forgotPassword);
router.post('/verification', UserController.verification);

module.exports = router 