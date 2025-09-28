const mongoose = require('mongoose');

const profileBuyerSchema = new mongoose.Schema({ 
  name: { type: String, required: true},
  phoneNumber: { type: String, required: true },
  orders: [ { type: String, ref: 'Order'} ],
  cart: { type: String },
  books: [ { type: String, ref: 'Book' } ]
});

module.exports = mongoose.models.ProfileBuyer || mongoose.model('ProfileBuyer', profileBuyerSchema);