const Account = require('../models/Account');
const Profilebuyer = require('../models/ProfileBuyer');
//Cambios
const Profileseller = require('../models/Profileseller');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const account = await Account.findOne({ email }).populate('profile');
    if ( !account ) {
      return res.status(404).json({ error: 'Perfil no encontrado para ese correo' });
    }

    if (account.password !== password ) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    res.json(account.profile);
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener perfil', detalle: e.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { email, password, name, phoneNumber, address } = req.body;

    const profile = await Profilebuyer.create({
      name: name,  
      phoneNumber: phoneNumber,
      address: address
    });
    
    const account = await Account.create({
      email: email,
      password: password,
      profilebuyer: profile._id
    });
    res.status(201).json(account);
  } catch(e) {
    res.status(400).json({error: 'Datos inválidos', detalle: e.message });
  }
};
//cambio en este metodo
exports.createseller = async (req, res) => {
  try {
    const { email, password, name, phoneNumber, address } = req.body;

    const profile = await Profileseller.create({
      name: name,
      phoneNumber: phoneNumber,
      address: address,
      //cambio aqui
      avgRating: 0
    });

    const account = await Account.create({
      email: email,
      password: password,
      profileseller: profile._id
    });
    res.status(201).json(account);
  } catch(e) {
    res.status(400).json({error: 'Datos inválidos', detalle: e.message });
  }
}

exports.remove = async (req, res) => {
  try {
    const deletedAccount = await Account.findOneAndDelete({ email: req.params.email });
    if (!deletedAccount) {
       return res.status(404).json({ error: `Cuenta de correo ${req.params.email} no encontrada` });
    }
    res.status(204).end();
  } catch (e) {
    res.status(500).json({ error: 'Error al eliminar cuenta', detalle: e.message });
  }
};

//haran falta la creacion de perfiles nuevos en bases a cuentas ya creadas? tipo que pasa
//si alguien que ya tiene una cuenta y perfil de vendedor ahora quiere comprar cosas?
exports.createBuyerFromExistentAccount = async (req, res) => {
  try {
    const {name, phoneNumber, address } = req.body;
    const accountId = req.params.accountId ;
    const account = await Account.findById(accountId);
    console.log('Vamos a encontrar la cuenta:', accountId);
    if (!account) {
      return res.status(404).json({ error: 'Cuenta no encontrada' });
    }

    if (account.profilebuyer) {
      return res.status(409).json({ error: 'La cuenta ya tiene un perfil de comprador' });
    }


    const profile = await Profilebuyer.create({
      name,
      phoneNumber,
      address,
    });

    account.profilebuyer = profile._id;
    await account.save();


    res.status(201).json({
      message: 'Perfil de comprador creado y asociado a la cuenta',
      account
    });

  } catch (e) {
    res.status(400).json({ error: 'Datos inválidos', detalle: e.message });
  }
};

//hacemos lo mismo pero para el caso contrario
exports.createSellerFromExistentAccount = async (req, res) => {
  try {
    const {name, phoneNumber, address } = req.body;
    const accountId = req.params.accountId ;
    const account = await Account.findById(accountId);
    console.log('Vamos a encontrar la cuenta:', accountId);
    if (!account) {
      return res.status(404).json({ error: 'Cuenta no encontrada' });
    }

    if (account.profilebuyer) {
      return res.status(409).json({ error: 'La cuenta ya tiene un perfil de vendedor' });
    }


    const profile = await Profileseller.create({
      name,
      phoneNumber,
      address,
    });

    account.profileseller = profile._id;
    await account.save();


    res.status(201).json({
      message: 'Perfil de vendedor creado y asociado a la cuenta',
      account
    });

  } catch (e) {
    res.status(400).json({ error: 'Datos inválidos', detalle: e.message });
  }
};
