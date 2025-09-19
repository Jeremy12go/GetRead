const mongoose = require('mongoose');

const profileSellerSchema = new mongoose.Schema({ 
  name: { type: String, required: true},
  phoneNumber: { type: String, required: true },
  orders: [ { type: String, ref: 'Order'} ],
  books: [ { type: String, ref: 'Order' } ],
  avgRating: Double
});

module.exports = mongoose.models.ProfileSeller || mongoose.model('ProfileSeller', profileSellerSchema);