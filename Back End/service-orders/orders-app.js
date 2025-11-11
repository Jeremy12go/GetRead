const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json()); 

const { mongoConnect } = require('./db/database');

const Routes = require('./routes/OrderRoutes');
app.use('/orders', Routes);

const PORT = process.env.PORT;

mongoConnect()
  .then(() => {
    app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((e) => {
    console.error('Error al conectar a MongoDB Atlas', error.message);
  });