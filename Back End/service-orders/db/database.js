const mongoose = require('mongoose');
require('dotenv').config();

const mongoConnect = async () => {
<<<<<<< HEAD
  await mongoose.connect(process.env.MONGO_URL);
  console.log('Conectado a MongoDB Atlas');
=======
  await mongoose.connect(process.env.MONGO_URL_BASE);
  console.log('Conectado a MongoDB');
>>>>>>> origin/dbtest
};

module.exports = { mongoConnect };