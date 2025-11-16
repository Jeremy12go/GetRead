const mongoose = require('mongoose');

const profileBuyerSchema = new mongoose.Schema({ 
  name: { type: String, required: true},
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  orders: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Order'} ],
  //cambiar esto porque el carrito tiene que recibir mas que solo una cosa
  //cart: { type: String },
  cart: [{
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    quantity: { type: Number, required: true, default: 1 }
  }],
  //books: [ { type: String, ref: 'Book' } ]
  books: [{
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    quantity: { type: Number, required: true, default: 1 }
  }]
});

module.exports = mongoose.models.ProfileBuyer || mongoose.model('ProfileBuyer', profileBuyerSchema);