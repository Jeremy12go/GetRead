const mongoose = require('mongoose');

const profileBuyerSchema = new mongoose.Schema({ 
  name: { type: String, required: true},
  phoneNumber: { type: String, required: true },
  orders: [ { type: String, ref: 'Order'} ],
  cart: Order,
  books: [ { type: String, ref: 'Order' } ]
});

module.exports = mongoose.models.ProfileBuyer || mongoose.model('ProfileBuyer', profileBuyerSchema);