const express = require('express');
const router = express.Router();
const controllerAccount = require('../controllers/AccountController');
const controllerProfileBuyer = require('../controllers/ProfileBuyerController');
const controllerProfileSeller = require('../controllers/ProfileSellerController');
const upload = require('../middlewares/upload');
const passport = require('passport');
const Account = require('../models/Account');
const Profilebuyer = require('../models/ProfileBuyer');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.ID_CLIENTE);

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

// Iniciar login con Google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback de Google
router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const profile = req.user;
    res.redirect(`http://localhost:3004/login?googleId=${profile.accountId}`);
  }
);

// Validar el Token
router.post("/google/tokenLogin", async (req, res) => {
  const { token } = req.body;

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const email = payload.email;

  let account = await Account.findOne({ email });

  if (!account) {
    const buyer = await Profilebuyer.create({
      name: payload.name,
      phoneNumber: "No especificado",
      address: "No especificado"
    });

    
    const provisionalPassword = buyer._id.toString() + email;

    account = await Account.create({
      email: payload.email,
      password: provisionalPassword,
      googleId: payload.sub,
      profilebuyer: buyer._id,
      profileImage: payload.picture
    });
  }

  const profile = await Profilebuyer.findById(account.profilebuyer);

  res.json({
    account,
    profile
  });
});

module.exports = router;