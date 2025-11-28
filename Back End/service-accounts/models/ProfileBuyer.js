const mongoose = require('mongoose');

const profileBuyerSchema = new mongoose.Schema({ 
  name: { type: String, required: true},
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  orders: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Order'} ],
  cart: [{
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    quantity: { type: Number, required: true, default: 1 }
  }],
  books: [{
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    quantity: { type: Number, required: true, default: 1 }
  }]
});

module.exports = mongoose.models.ProfileBuyer || mongoose.model('ProfileBuyer', profileBuyerSchema);