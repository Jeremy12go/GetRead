const express = require('express');
const router = express.Router();
const controllerAccount = require('../controllers/AccountController');
const controllerProfileBuyer = require('../controllers/ProfileBuyerController');
const controllerProfileSeller = require('../controllers/ProfileSellerController');
const upload = require('../db/cloudinary.js');
const passport = require('passport');
const Account = require('../models/Account');
const Profilebuyer = require('../models/ProfileBuyer');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.ID_CLIENTE);
const { sendPasswordResetEmail } = require('../utils/sendMail');
const verifyToken = require("../config/verifyToken");

// ----------------------------Account----------------------------
router.post('/login', controllerAccount.login);

router.post('/', controllerAccount.create);

router.post('/createseller', controllerAccount.createseller);

router.delete('/:email', controllerAccount.remove);

// Crear un perfil de comprador de parte de una cuenta existente con perfil de vendedor
router.post('/:accountId/sellercreatebuyer', controllerAccount.createBuyerFromExistentAccount);

// Crear un perfil de vendedor de parte de una cuenta existente con perfil de comprador
router.post('/:accountId/buyercreateseller', controllerAccount.createSellerFromExistentAccount);

router.get('/:id', controllerAccount.getAccount);

router.put('/account/:id', controllerAccount.updateAccount);

router.post('/:id/billetera', controllerAccount.createBilletera);

router.get('/:id/billetera', controllerAccount.getBilletera);

router.put('/:id/billetera/agregar', controllerAccount.agregarFondos);

router.put('/:id/billetera/restar', controllerAccount.restarFondos);

// Cambiar imagen de perfil
router.post('/:id/upload-image', verifyToken, upload.single('profileImage'), controllerAccount.uploadAccountImage);


// ----------------------------ProfileBuyer----------------------------
router.get('/buyer/:id', controllerProfileBuyer.getById);

router.put('/buyer/:id', controllerProfileBuyer.update);

// Agregar un libro al carrito del comprador
router.patch('/:buyerId/addtocart', controllerProfileBuyer.addToCart);

// Vaciar el carrito
router.patch('/buyer/:buyerId/clearcart', controllerProfileBuyer.clearCart);

router.put('/buyer/:buyerId/addorder', controllerProfileBuyer.addOrder);

router.put('/buyer/:buyerId/addbooks', controllerProfileBuyer.addBooks);


// ----------------------------ProfileSeller----------------------------
router.get('/seller/:id', controllerProfileSeller.getById);

router.put('/seller/:id', controllerProfileSeller.update);

//Agregar un libro al perfil vendedor
router.put('/:id/addbook',controllerProfileSeller.addBookToSeller);

router.put('/seller/:sellerId/addorder', controllerProfileSeller.addOrder);

router.patch('/seller/:idSeller/updaterating', controllerProfileSeller.updateRating);


// ----------------------------Google-Elements----------------------------

// Iniciar login con Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback de Google
router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const profile = req.user;
    res.redirect(`http://localhost:3005/login?googleId=${profile.accountId}`);
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
  let resetToken = '';

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
    resetToken = buyer._id.toString();

    // Solicitar cambio de contraseña, solo la primera vez
    const resetLink = `http://localhost:3005/reset-password/${resetToken}`;
    await sendPasswordResetEmail(payload.email, payload.name, resetLink);
  }

  const profile = await Profilebuyer.findById(account.profilebuyer);
  res.json({ account, profile });
});

// Reestablecer contraseña
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { newPassword } = req.body;
    const token = req.params.token;

    const buyer = await Profilebuyer.findById(token);
    if (!buyer) {
      return res.status(404).json({ error: "Token inválido" });
    }

    const account = await Account.findOne({ profilebuyer: buyer._id });
    if (!account) {
      return res.status(404).json({ error: "Cuenta no encontrada" });
    }

    account.password = newPassword;
    await account.save();

    res.json({ ok: true, message: "Contraseña actualizada correctamente" });

  } catch (e) {
    console.error("Error cambiando contraseña:", e);
    res.status(500).json({
      error: "Error interno",
      detalle: e.message
    });
  }
});

module.exports = router;