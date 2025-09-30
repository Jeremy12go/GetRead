const express = require('express');
const router = express.Router();
const multer = require('multer');
const Store = require('../models/Store');
const StoreController = require('../controllers/StoreController');
const Product = require('../models/Product');
const ProductController = require('../controllers/ProductController');

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
    const { id, name, category, city, description } = req.body;

    const store = await Store.create({
      id,
      name,
      category,
      city,
      description,
      logo: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      }
    });
    res.status(201).json({ message: 'Tienda creada', store });
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
