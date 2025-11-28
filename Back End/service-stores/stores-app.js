//aqui creo que habran cambios, pero mejor hacerlo en casa que aqui me puedo equivocar
/*
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error de conexión:', err));

app.listen(PORT, () => {
  console.log(`Service-books corriendo en puerto ${PORT}`);
});
*/
const express = require('express');
require('dotenv').config();

const app = express();
// Aumentar la capacidad limite de data en el json
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

const routes = require('./routes/Routes');
app.use('/stores', routes);

const { mongoConnect } = require('./db/database');

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