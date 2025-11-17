const mongoose = require('mongoose');
require('dotenv').config();

const mongoConnect = async () => {
<<<<<<< HEAD
  try {
    if (!process.env.MONGO_URL) {
      throw new Error('Falta MONGO_URL en .env');
    }

    mainConnection = await mongoose.createConnection(process.env.MONGO_URL);
=======
  // mainConnection es la base principal para libros
  // supportConnection es la base secundaria para datos auxiliares o historicos
  let mainConnection;
  let supportConnection;

  try {
    if (!process.env.MONGO_URL_BASE) {
      throw new Error('Falta MONGO_URL_BASE en .env');
    }
    if (!process.env.MONGO_URL_SUPPORT) {
      throw new Error('Falta MONGO_URL_SUPPORT en .env');
    }

    mainConnection = await mongoose.createConnection(process.env.MONGO_URL_BASE).asPromise();
    supportConnection = await mongoose.createConnection(process.env.MONGO_URL_SUPPORT).asPromise();
>>>>>>> origin/dbtest

    const storesDB = mainConnection.useDb('stores_db');
    const accountsDB = mainConnection.useDb('account_db');

    console.log('Conectado a MongoDB Atlas');  
    return { storesDB, accountsDB };

  } catch (e) {
    console.error('Error al conectar a MongoDB Atlas:', e.message);
    throw e;
  }
};

module.exports = { mongoConnect };
