const Rating = require('../models/Rating');


exports.getByIdOrder = async (req, res) => {
  try {
    const rating = await Rating.findOne({ idOrder: req.params.idOrder });
    if (!rating) {
      return res.status(404).json({ error: `Rating de orden ${req.params.idOrder} no encontrado` });
    }
    res.json(rating);
  } catch(e) {
    res.status(500).json({error: 'Error al obtener Ratings', detalle: e.message });
  }
};

exports.getRatingsByStoreId = async (req, res) => {
  try {
    const ratings = await Rating.find({ idStore: req.params.idStore });
    if ( ratings === 0) {
      return res.status(404).json({ error: `Ratings de tienda ${req.params.idStore} no encontrados` });
    }
    res.json(ratings);
  } catch(e) {
    res.status(500).json({error: 'Error al obtener Ratings', detalle: e.message });
  }
};

//Cambios aqui
exports.create = async (req, res) => {
  try {
    const numRating = await Rating.countDocuments();
    const { idStore, idOrder, idProfile, stars, comment } = req.body;
    const newRating = await Rating.create({
            id: `rating${numRating + 1}`, 
            idStore,
            idOrder, 
            idProfile,
            stars,
            comment,
          });
    //const newRating = await Rating.create(req.body);
    res.status(201).json(newRating);
  } catch(e) {
    res.status(400).json({error: 'Datos inválidos', detalle: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updatedRating = await Rating.findOneAndUpdate(
      { idOrder: req.params.idOrder },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedRating) {
      return res.status(404).json({ error: `Rating de orden ${req.params.idOrder} no encontrado` });
    }
    res.json(updatedRating);
  } catch (e) {
    res.status(400).json({ error: 'Error al actualizar rating', detalle: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const deletedRating = await Rating.findOneAndDelete({ idOrder: req.params.idOrder });
    if (!deletedRating) {
      return res.status(404).json({ error: `Rating de orden ${req.params.idOrder} no encontrado` });
    }
    res.status(204).end();
  } catch (e) {
    res.status(500).json({ error: 'Error al eliminar rating', detalle: e.message });
  }
};
