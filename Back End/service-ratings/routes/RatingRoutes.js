const express = require('express');
const router = express.Router();
const controller = require('../controllers/RatingController');
const Rating = require('../models/Rating');

router.get('/:idOrder', controller.getByIdOrder);
router.get('/stores/:idStore', controller.getRatingsByStoreId);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

//este es un endpoint que me va a devolver los ratings
//de una tienda, y luego desde service-stores pedire estos
//datos con axios
router.get('/stores/:idStore', async (req, res) => {
    try {
        const ratings = await Rating.find({ idStore: req.params.storeId });
        const ratingIds = ratings.map(r => r._id);
        res.status(200).json(ratingIds);
    } catch (err) {
        res.status(500).json({ message: "Error al buscar ratings", error: err.message });
    }
});

module.exports = router;
