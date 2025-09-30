const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.urlencoded({ extended: true })); //para que pueda leer peticiones con campos tipo form-data (postman)
app.use(express.json()); 

const { mongoConnect } = require('./db/database');

const profileRoutes = require('./routes/RatingRoutes');
app.use('/ratings', profileRoutes);

const PORT = process.env.PORT || 3003;

mongoConnect()
  .then(() => {
    app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((e) => {
    console.error('Error al conectar a MongoDB', error.message);
  });
