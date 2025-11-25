const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const { mongoConnect } = require('./db/database');

const app = express();
app.use(express.json());

const Routes = require('./routes/Routes'); 
app.use('/accounts', Routes);

const PORT = process.env.PORT;

mongoConnect()
  .then(() => {
    app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((e) => {
    console.error('Error al conectar a MongoDB Atlas', e.message);
  });