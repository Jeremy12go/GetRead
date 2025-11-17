const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Book = require('../models/Book');

const StoreSchema = new mongoose.Schema({
  name: { type: String, required: true},
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  orders: [ { type: String, ref: 'Order'} ],
  books: [ { type: String, ref: 'Book' } ],
  avgRating: Number,
  logo: { data: Buffer, contentType: String }
});

const Store = mongoose.model('Store', StoreSchema);

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URL_BASE);
    console.log('Conectado a la DB Principal');

    // ---------- CARGA DE LIBROS ----------
    const booksPath = path.join(__dirname, 'stores_db-products.json');
    const booksRaw = JSON.parse(fs.readFileSync(booksPath, 'utf-8'));

    const books = booksRaw.map(p => ({
      ...p,
      _id: new mongoose.Types.ObjectId(p._id),
      image: {
        data: Buffer.from(p.image.data, 'base64'),
        contentType: p.image.contentType || 'image/jpeg'
      }
    }));

    await Book.insertMany(books);
    console.log('Libros insertados');


    await mongoose.connect(process.env.MONGO_URL_SUPPORT);
    console.log('Conectado a la DB Secundaria');

    // ---------- CARGA DE STORES ----------
    const storesPath = path.join(__dirname, 'stores_db-stores.json');
    const storesRaw = JSON.parse(fs.readFileSync(storesPath, 'utf-8'));

    const stores = storesRaw.map(s => ({
      ...s,
      _id: new mongoose.Types.ObjectId(s._id),
      logo: {
        data: Buffer.from(s.logo.data, 'base64'),
        contentType: s.logo.contentType || 'image/jpeg'
      },
      ratings: s.ratings?.map(r => new mongoose.Types.ObjectId(r.$oid)) || [],
      productsList: s.productsList?.map(p => new mongoose.Types.ObjectId(p.$oid)) || []
    }));

    await Store.insertMany(stores);
    console.log('Tiendas insertadas');
  } catch (err) {
    console.error('Error al insertar datos:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Conexión cerrada');
  }
}

seed();
