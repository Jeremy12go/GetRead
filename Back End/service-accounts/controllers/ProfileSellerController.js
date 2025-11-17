const Profile = require('../models/ProfileSeller');
const axios = require('axios');

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

// Vincular orden al vendedor
exports.addOrder = async (req, res) => {
  try {
    const seller = await Profile.findByIdAndUpdate(
        req.params.sellerId,
        { $push: { orders: req.body.orderId } },
        { new: true }
    );
    if (!seller) return res.status(404).json({ error: 'Vendedor no encontrado' });
    res.json(seller);
  } catch (e) {
    console.error('Error en addOrder:', e);
    res.status(500).json({ error: 'Error al vincular orden', detalle: e.message });
  }
};


// Actualizar rating del vendedor
exports.updateRating = async (req, res) => {
  console.log('llegamos a update rating');
  try {
    const { ratingId } = req.body;
    const seller = await Profile.findById(req.params.idSeller); // usar idSeller
    if (!seller) return res.status(404).json({ error: 'Vendedor no encontrado' });

    if (!seller.ratings) seller.ratings = [];
    if (!seller.ratings.includes(ratingId)) seller.ratings.push(ratingId);

    const url = `${process.env.RATINGS_SERVICE_URL}/seller/${req.params.idSeller}`;
    console.log('llamando a:', url);

    const ratingsRes = await axios.get(url);
    const ratings = ratingsRes.data;

    const sumStars = ratings.reduce((sum, r) => sum + r.stars, 0);
    const avgStars = ratings.length > 0 ? sumStars / ratings.length : 0;

    seller.avgRating = avgStars;
    await seller.save();

    res.json(seller);
  } catch (e) {
    console.error('Error en updateRating:', e);
    res.status(500).json({ error: 'Error al actualizar rating del vendedor', detalle: e.message });
  }
};
