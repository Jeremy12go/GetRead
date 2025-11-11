const mongoose = require('mongoose');
const Rating = require('../models/Rating');
const data = require('./rating_db.json');

mongoose.connect(process.env.MONGO_URL).then(async () => {
    try {
        const count = await Rating.countDocuments();
        if (count === 0) {
            await Rating.insertMany(data);
            console.log('Datos de ratings insertados');
        } else {
            console.log('Datos ya existen');
        }
    } catch(e) {
        console.error('Error al insertar datos:', err.message);
    } finally {
        mongoose.disconnect();
    }
  
});