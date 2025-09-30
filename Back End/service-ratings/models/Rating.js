const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  id: { type: String, required: true},
  idStore: { type: String, required: true},
  idOrder: { type: String, required: true },
  idProfile: { type: String, required: true},
  stars: { type: Number, required: true} ,
  comment: { type: String, required: false},
});

module.exports = mongoose.model('Rating', ratingSchema);
