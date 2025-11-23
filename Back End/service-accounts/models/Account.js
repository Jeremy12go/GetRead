const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  email: { type: String, required: true},
  password: { type: String, required: true },
  profileImage: { type: String, default: null },
  googleID: { type: String, default: null },
  billetera: {
    saldo: { type: Number, default: 0 },
  },
  profileseller: { type: mongoose.Schema.Types.ObjectId, ref: 'ProfileSeller' },
  profilebuyer: { type: mongoose.Schema.Types.ObjectId, ref: 'ProfileBuyer' }
});

module.exports = mongoose.model('Account', accountSchema);