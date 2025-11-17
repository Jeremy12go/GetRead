const mongoose = require('mongoose');

const profileSellerSchema = new mongoose.Schema({ 
  name: { type: String, required: true},
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  orders: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Order'} ],
  books: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Book' } ],
  ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }],
  avgRating: Number,
  logo: { data: Buffer, contentType: String }
});

module.exports = mongoose.models.ProfileSeller || mongoose.model('ProfileSeller', profileSellerSchema);