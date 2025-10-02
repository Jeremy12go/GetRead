const mongoose = require('mongoose');
require('dotenv').config();

const mongoConnect = async () => {
  try {
    // conexión principal
    const mainConnection = await mongoose.createConnection(process.env.MONGO_URL_BASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // conexión secundaria
    const supportConnection = await mongoose.createConnection(process.env.MONGO_URL_SUPORT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch(e) {
    console.error('Error al conectar a MongoDB:', error.message);
  };
  
  console.log('Conectado a MongoDB');
  
  return { mainConnection, supportConnection };
};

module.exports = { mongoConnect };
