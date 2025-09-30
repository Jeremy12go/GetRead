const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json()); 

const StoreRoutes = require('./routes/Routes');;
app.use('/stores', StoreRoutes);

const { mongoConnect } = require('./db/database');


const PORT = process.env.PORT;
mongoConnect()
  .then(({ mainConnection, supportConnection }) => {
    
    app.locals.mainDB = mainConnection;
    app.locals.supportDB = supportConnection;

    app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((e) => {
    console.error('Error al conectar a MongoDB', error.message);
  });