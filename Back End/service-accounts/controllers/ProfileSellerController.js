const Profile = require('../models/ProfileSeller');

exports.getById = async (req, res) => {
  try {
    const profile = await Profile.findOne({ id: req.params._id });
    if(!profile)
      return res.status(404).json({ error: 'Perfil no encontrado' })
    res.json(profile);
  } catch(e) {
    res.status(500).json({error: 'Error al obtener perfil', detalle: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updatedProfile = await Profile.findOneAndUpdate(
      { id: req.params._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProfile) 
      return res.status(404).json({ error: `Perfil ${req.params.name} no encontrado` });
    
    res.json(updatedProfile);
  } catch (e) {
    res.status(400).json({ error: 'Error al actualizar profile', detalle: e.message });
  }
};

//Export para añadir un libro al vendedor
exports.addBookToSeller = async (req, res) => {
  const { bookId } = req.body;

  try{
    const seller = await Profile.findByIdAndUpdate(
        req.params.id,
        { $push: { books : bookId} },
        { new: true }
    );
    if (!seller) {
      return res.status(404).json({ error: 'Vendedor no encontrado'});
    }

    res.status(200).json({ message: 'Libro añadido al perfil', seller })
  } catch(e) {
    res.status(500).json({ error: 'Error al actualizar perfil', detalle: e.message });
  }
}