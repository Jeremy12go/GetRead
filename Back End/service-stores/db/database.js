const mongoose = require('mongoose');
require('dotenv').config();

const mongoConnect = async () => {
  let mainConnection;
  let supportConnection;

  try {
    if (!process.env.MONGO_URL_BASE) {
      throw new Error('Falta MONGO_URL_BASE en .env');
    }
    if (!process.env.MONGO_URL_SUPORT) {
      throw new Error('Falta MONGO_URL_SUPORT en .env');
    }

    mainConnection = await mongoose.createConnection(process.env.MONGO_URL_BASE).asPromise();
    supportConnection = await mongoose.createConnection(process.env.MONGO_URL_SUPORT).asPromise();

    console.log('Conectado a MongoDB (main & support)');
    return { mainConnection, supportConnection };

  } catch (e) {
    console.error('Error al conectar a MongoDB:', e.message);
    throw e;
  }
};

module.exports = { mongoConnect };
