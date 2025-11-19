const express = require('express');
const router = express.Router();
const controllerAccount = require('../controllers/AccountController');
const controllerProfileBuyer = require('../controllers/ProfileBuyerController');
const controllerProfileSeller = require('../controllers/ProfileSellerController');
const upload = require('../middlewares/upload');

router.post('/login', controllerAccount.login);
router.post('/', controllerAccount.create);
//cambio aqui
router.post('/createseller', controllerAccount.createseller);
router.delete('/:email', controllerAccount.remove);

router.get('/buyer/:buyerId', controllerProfileBuyer.getById);
router.put('/buyer/:id', controllerProfileBuyer.update);

router.get('/seller/:id', controllerProfileSeller.getById);
router.put('/seller/:id', controllerProfileSeller.update);

//ruta para agregar un libro al perfil vendedor
router.put('/:id/addbook',controllerProfileSeller.addBookToSeller);
//ruta para crear un perfil de comprador de parte de una cuenta existente con perfil de vendedor
router.post('/:accountId/sellercreatebuyer', controllerAccount.createBuyerFromExistentAccount);
//ruta para crear un perfil de vendedor de parte de una cuenta existente con perfil de comprador
router.post('/:accountId/buyercreateseller', controllerAccount.createSellerFromExistentAccount);
//ruta para agregar un libro al carrito del comprador
router.patch('/:buyerId/addtocart', controllerProfileBuyer.addToCart);
//ruta para vaciar un carrito
router.patch('/buyer/:buyerId/clearcart', controllerProfileBuyer.clearCart);
router.put('/buyer/:buyerId/addorder', controllerProfileBuyer.addOrder);
router.put('/buyer/:buyerId/addbooks', controllerProfileBuyer.addBooks);
router.put('/seller/:sellerId/addorder', controllerProfileSeller.addOrder);
router.patch('/seller/:idSeller/updaterating', controllerProfileSeller.updateRating);

router.get('/profile/:id', controllerAccount.getProfile);
router.put('/profile/:id', controllerAccount.updateProfile);

router.post('/:id/upload-image', upload.single('profileImage'), controllerAccount.uploadAccountImage);

module.exports = router;