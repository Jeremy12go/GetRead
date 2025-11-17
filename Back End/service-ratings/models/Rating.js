const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  idSeller: { type: mongoose.Schema.Types.ObjectId, ref: 'ProfileSeller'},
  idOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  idBuyer: { type: mongoose.Schema.Types.ObjectId, ref: 'ProfileBuyer'},
  stars: { type: Number, required: true} ,
  comment: { type: String },
  ratingDate: { type: Date, required: true, default: Date.now}
});

module.exports = mongoose.model('Rating', ratingSchema);
