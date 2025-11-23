const express = require('express');
const router = express.Router();
const BookController = require('../controllers/BookController');
const multer = require('multer');
const upload = require('../db/cloudinary.js');

router.get('/', BookController.getAllBooks);
router.post('/', upload.single('image'), BookController.createbook);
router.get('/:id', BookController.getById);
router.get('/seller/:idseller', BookController.getByIdSeller);
router.get('/:id/image', BookController.getImage);
router.put('/:id', BookController.update);
router.delete('/:id', BookController.remove);
router.patch('/:id/stock', BookController.modifystock);

module.exports = router;
