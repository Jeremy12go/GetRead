const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../db/cloudinaryConfig.js');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'books',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const upload = multer({ storage });

module.exports = upload;

