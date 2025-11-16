const Account = require('../models/Account');
const Profilebuyer = require('../models/ProfileBuyer');
//Cambios
const Profileseller = require('../models/Profileseller');

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