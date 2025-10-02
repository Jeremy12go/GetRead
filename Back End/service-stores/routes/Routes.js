const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const multer = require('multer');
const StoreController = require('../controllers/StoreController');
const Product = require('../models/Book');
const ProductController = require('../controllers/BookController');

const StoreSchema = new mongoose.Schema({
  name: { type: String, required: true},
  phoneNumber: { type: String, required: true },
  orders: [ { type: String, ref: 'Order'} ],
  books: [ { type: String, ref: 'Book' } ],
  avgRating: Number,
  logo: { data: Buffer, contentType: String }
});

// endpoints para Product.
router.get('/product/id/:id', ProductController.getById);
router.get('/product/store/:idStore', ProductController.getByIdStore);
router.get('/product/:id/image', ProductController.getImage);
router.put('/product/:id', ProductController.update);
router.delete('/product/:id', ProductController.remove);

router.get('/city/:city', StoreController.getByCity);
router.get('/:id/logo', StoreController.getLogo);
router.get('/:id', StoreController.getById);
router.post('/:id/addrating', StoreController.addRating);
router.put('/:id', StoreController.update);
router.delete('/:id', StoreController.remove);

const storageStore = multer.memoryStorage();
const uploadStore = multer({ storageStore });

// Crear tienda con logo.
router.post('/', uploadStore.single('logo'), async (req, res) => {
  try {
    const { name, phoneNumber, orders, books } = req.body;
    const Store = req.app.locals.supportDB.model('Store', StoreSchema);
    const store_ = await Store.create({
      name,
      phoneNumber,
      orders,
      books,
      logo: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      }
    });
    res.status(201).json({ message: 'Tienda creada', store_ });
  } catch (e) {
    res.status(500).json({ error: 'Error al guardar la tienda', detalle: e.message });
  }
});

const storageProduct = multer.memoryStorage();
const uploadProduct = multer({ storageProduct });

// Crear producto con imagen.
router.post('/product', uploadProduct.single('image'), async (req, res) => {
  try {
    const { id, idStore, name, price, description } = req.body;

    const product = await Product.create({
      id,
      idStore,
      name,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      },
      price,
      description
    });
    res.status(201).json({ message: 'Producto creado', product });
  } catch (e) {
    res.status(500).json({ error: 'Error al guardar el producto', detalle: e.message });
  }
});

module.exports = router;
