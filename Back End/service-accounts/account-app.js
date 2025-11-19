const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(express.json()); // Middleware.

const { mongoConnect } = require('./db/database');

const uploadsDir = path.join(__dirname, 'uploads', 'profiles');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Carpeta uploads/profiles creada');
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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