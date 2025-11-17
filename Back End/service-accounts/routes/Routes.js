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

router.get('/profileB/:id', controllerProfileBuyer.getById);
router.put('/profileB/:id', controllerProfileBuyer.update);

router.get('/profileS/:id', controllerProfileSeller.getById);
router.put('/profileS/:id', controllerProfileSeller.update);

router.get('/profile/:id', controllerAccount.getProfile);
router.put('/profile/:id', controllerAccount.updateProfile);

router.post('/:id/upload-image', upload.single('profileImage'), controllerAccount.uploadAccountImage);

module.exports = router;