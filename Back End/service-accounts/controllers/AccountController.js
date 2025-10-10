const Account = require('../models/Account');
const Profile = require('../models/ProfileBuyer');

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

    const profile = await Profile.create({
      name: name,  
      phoneNumber: phoneNumber,
      address: address
    });
    
    const account = await Account.create({
      email: email,
      password: password,
      profile: profile._id
    });
    res.status(201).json(account);
  } catch(e) {
    res.status(400).json({error: 'Datos inválidos', detalle: e.message });
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