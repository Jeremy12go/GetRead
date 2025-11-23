const Account = require('../models/Account');
const Profilebuyer = require('../models/ProfileBuyer');
const Profileseller = require('../models/Profileseller');
const path = require('path');
const fs = require('fs');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const account = await Account.findOne({ email });

    if (!account) {
      return res.status(404).json({ error: 'Perfil no encontrado para ese correo' });
    }

    if (account.password !== password) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    if (!account.billetera) {
      account.billetera = { saldo: 0 };
      await account.save();
    }
    
    let profile = null;

    if (account.profilebuyer) {
      profile = await Profilebuyer.findById(account.profilebuyer);
    }

    if (!profile && account.profileseller) {
      profile = await Profileseller.findById(account.profileseller);
    }

    if (!profile) {
      return res.status(404).json({ error: 'Perfil asociado no encontrado' });
    }

    res.json({
      account: {
        _id: account._id,
        email: account.email,
        billetera: account.billetera,
        profilebuyer: account.profilebuyer,
        profileseller: account.profileseller,
        profileImage: account.profileImage
      },
      profile: {
        _id: profile._id,
        name: profile.name,
        phoneNumber: profile.phoneNumber,
        address: profile.address
      }
    });

  } catch (e) {
    console.error('Error en login:', e);
    res.status(500).json({
      error: 'Error al obtener perfil',
      detalle: e.message
    });
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

exports.createseller = async (req, res) => {
  try {
    const { email, password, name, phoneNumber, address } = req.body;

    const profile = await Profileseller.create({
      name: name,
      phoneNumber: phoneNumber,
      address: address,
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

exports.updateProfile = async (req, res) => {
  try {
    console.log("Fase1 - inicio updateProfile");

    const { id } = req.params;
    const { name, phoneNumber, password, address } = req.body;

    const account = await Account.findById(id);
    if (!account) return res.status(404).json({ error: 'Cuenta no encontrada' });

    console.log("Fase1 - Account encontrada:", account._id);

    if (password) {
      account.password = password;
      await account.save();
      console.log("Fase2 - Contraseña actualizada");
    }

    console.log("Fase3 - Buscando perfil asociado");
    let profile = null;

    if (account.profilebuyer) {
      profile = await Profilebuyer.findById(account.profilebuyer);
    }

    if (!profile && account.profileseller) {
      profile = await Profileseller.findById(account.profileseller);
    }

    if (!profile) {
      console.log("Fase3.5 - No se encontró perfil");
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    if (name !== undefined) profile.name = name;
    if (phoneNumber !== undefined) profile.phoneNumber = phoneNumber;
    if (address !== undefined) profile.address = address;
    
    await profile.save();
    console.log("Fase4 - Perfil actualizado:", profile._id);

    res.json({
      message: "Account y perfil actualizados correctamente",
      account: {
        _id: account._id,
        email: account.email,
        profilebuyer: account.profilebuyer,
        profileseller: account.profileseller
      },
      profile: {
        _id: profile._id,
        name: profile.name,
        phoneNumber: profile.phoneNumber,
        address: profile.address
      }
    });

  } catch (e) {
    console.error("Error en updateProfile:", e);
    res.status(500).json({ error: 'Error al actualizar perfil', detalle: e.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const account = await Account.findById(id);
    if (!account) return res.status(404).json({ error: 'Cuenta no encontrada' });

    let profile = null;

    if (account.profilebuyer) {
      profile = await Profilebuyer.findById(account.profilebuyer);
    }

    if (!profile && account.profileseller) {
      profile = await Profileseller.findById(account.profileseller);
    }

    if (!profile) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    res.json({
      account: {
        _id: account._id,
        email: account.email,
        profilebuyer: account.profilebuyer,
        profileseller: account.profileseller,
        profileImage: account.profileImage
      },
      profile: {
        _id: profile._id,
        name: profile.name,
        phoneNumber: profile.phoneNumber,
        address: profile.address
      }
    });

  } catch (e) {
    console.error("Error en getProfile:", e);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

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

exports.uploadAccountImage = async (req, res) => {
  try {
    const { id } = req.params; // ID de la Account

    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ninguna imagen' });
    }

    const account = await Account.findById(id);
    if (!account) return res.status(404).json({ error: 'Cuenta no encontrada' });

    // Eliminar imagen anterior si existe
    if (account.profileImage) {
      const oldImagePath = path.join(__dirname, '..', account.profileImage.replace(/^\//, ''));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Guardar ruta de la nueva imagen
    account.profileImage = `/uploads/profiles/${req.file.filename}`;
    await account.save();

    res.json({
      message: 'Imagen subida correctamente',
      profileImage: account.profileImage,
      account: {
        _id: account._id,
        email: account.email,
        profileImage: account.profileImage
      }
    });

  } catch (e) {
    console.error('Error al subir imagen:', e);
    res.status(500).json({ error: 'Error al subir imagen', detalle: e.message });
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

exports.getBilletera = async (req, res) => {
  try {
    const { id } = req.params;

    const account = await Account.findById(id);
    if (!account) return res.status(404).json({ error: 'Cuenta no encontrada' });

    res.json({
      saldo: account.billetera?.saldo ?? 0
    });

  } catch (e) {
    res.status(500).json({ error: 'Error al obtener billetera', detalle: e.message });
  }
};

exports.createBilletera = async (req, res) => {
  try {
    const { id } = req.params;

    const account = await Account.findById(id);
    if (!account) return res.status(404).json({ error: 'Cuenta no encontrada' });

    account.billetera = { saldo: 0 };
    await account.save();

    res.json({ message: "Billetera creada", billetera: account.billetera });

  } catch (e) {
    res.status(500).json({ error: 'Error al crear billetera', detalle: e.message });
  }
};

exports.agregarFondos = async (req, res) => {
  try {
    const { id } = req.params;
    const { monto } = req.body;

    if (monto <= 0) {
      return res.status(400).json({ error: "El monto debe ser mayor a 0" });
    }

    const account = await Account.findById(id);
    if (!account) return res.status(404).json({ error: "Cuenta no encontrada" });

    if (!account.billetera) {
      account.billetera = { saldo: 0 };
    }

    account.billetera.saldo += monto;
    await account.save();

    res.json({
      message: "Fondos agregados correctamente",
      saldo: account.billetera.saldo
    });

  } catch (e) {
    res.status(500).json({ error: "Error al agregar fondos", detalle: e.message });
  }
};

exports.restarFondos = async (req, res) => {
  try {
    const { id } = req.params;
    const { monto } = req.body;

    if (monto <= 0) {
      return res.status(400).json({ error: "El monto debe ser mayor a 0" });
    }

    const account = await Account.findById(id);
    if (!account) return res.status(404).json({ error: "Cuenta no encontrada" });

    if (!account.billetera) {
      return res.status(400).json({ error: "La cuenta no tiene billetera creada" });
    }

    if (account.billetera.saldo < monto) {
      return res.status(400).json({ error: "Fondos insuficientes" });
    }

    account.billetera.saldo -= monto;
    await account.save();

    res.json({
      message: "Fondos descontados correctamente",
      saldo: account.billetera.saldo
    });

  } catch (e) {
    res.status(500).json({ error: "Error al descontar fondos", detalle: e.message });
  }
};
