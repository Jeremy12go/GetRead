const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  email: { type: String, required: true},
  password: { type: String, required: true },
  profile: { type: String, required: true}
});

module.exports = mongoose.model('Account', accountSchema);