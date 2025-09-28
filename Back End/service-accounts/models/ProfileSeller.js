const mongoose = require('mongoose');

const profileSellerSchema = new mongoose.Schema({ 
  name: { type: String, required: true},
  phoneNumber: { type: String, required: true },
  orders: [ { type: String, ref: 'Order'} ],
  books: [ { type: String, ref: 'Book' } ],
  avgRating: Number
});

module.exports = mongoose.models.ProfileSeller || mongoose.model('ProfileSeller', profileSellerSchema);