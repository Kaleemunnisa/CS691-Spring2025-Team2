const express = require('express');
const { uploadImage, uploadMiddleware } = require('../controllers/uploadController');

const router = express.Router();

router.post('/', uploadMiddleware, uploadImage);

module.exports = router;
