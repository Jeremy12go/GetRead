const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json()); // Middleware.

const { mongoConnect } = require('./db/database');

const Routes = require('./routes/Routes'); // Routes.
app.use('/accounts', Routes);

const PORT = process.env.PORT || 3000;

mongoConnect()
  .then(() => {
    app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((e) => {
    console.error('Error al conectar a MongoDB', error.message);
  });