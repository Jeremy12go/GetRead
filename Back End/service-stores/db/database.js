const mongoose = require('mongoose');
require('dotenv').config();

const mongoConnect = async () => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error('Falta MONGO_URL en .env');
    }

    mainConnection = await mongoose.createConnection(process.env.MONGO_URL_BASE);

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
