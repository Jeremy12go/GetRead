const Rating = require('../models/Rating');
const axios = require('axios');
const mongoose = require('mongoose');

//para obtener ratings por id de orden
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

//para obtener ratings por vendedor
exports.getRatingsBySellerId = async (req, res) => {
  console.log('estamos en getRatingsBySellerId, idSeller:', req.params.idSeller);
  try {
    const sellerId = new mongoose.Types.ObjectId(req.params.idSeller); // convertir a ObjectId
    const ratings = await Rating.find({ idSeller: sellerId });
    if (ratings.length === 0) {
      return res.status(404).json({ error: `Ratings de vendedor ${req.params.idSeller} no encontrados` });
    }
    res.json(ratings);
  } catch(e) {
    console.error('Error en getRatingsBySellerId:', e);
    res.status(500).json({ error: 'Error al obtener Ratings', detalle: e.message });
  }
};


//para crear un rating
exports.create = async (req, res) => {
  try {
    const { idSeller, idOrder, idBuyer, stars, comment } = req.body;
    const newRating = await Rating.create({
            idSeller,
            idOrder, 
            idBuyer,
            stars,
            comment,
          });
    res.status(201).json(newRating);
  } catch(e) {
    res.status(400).json({error: 'Datos inválidos', detalle: e.message });
  }
};
//para actualizar rating por orden
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
//para eliminar rating por orden
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

exports.neoCreate = async (req, res) => {
  try {
    const { idSeller, idOrder, idBuyer, stars, comment } = req.body;

    const newRating = await Rating.create({
      idSeller,
      idOrder,
      idBuyer,
      stars,
      comment
    });

    //llamamos al servicio de vendedores para actualizar su promedio
    await axios.patch(`${process.env.ACCOUNTS_SERVICE_URL}/seller/${idSeller}/updaterating`, {
      ratingId: newRating._id
    }).catch(err => {
      console.error('Error al actualizar rating del vendedor:', err.message);
    });

    res.status(201).json(newRating);
  } catch (e) {
    res.status(400).json({ error: 'Error al crear rating', detalle: e.message });
  }
};


exports.getRatingsByBuyerId = async (req, res) => {
  try {
    const buyerId = new mongoose.Types.ObjectId(req.params.idBuyer);
    const ratings = await Rating.find({ idBuyer: buyerId });
    if (ratings.length === 0) {
      return res.status(404).json({ error: `Ratings de comprador ${req.params.idBuyer} no encontrados` });
    }
    res.json(ratings);
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener Ratings', detalle: e.message });
  }
};
