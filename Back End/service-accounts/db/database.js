const mongoose = require('mongoose');
require('dotenv').config();

const mongoConnect = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  console.log('Conectado a MongoDB');
};

module.exports = { mongoConnect };