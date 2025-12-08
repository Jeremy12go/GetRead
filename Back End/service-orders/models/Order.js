const mongoose = require('mongoose');

const Status = ['Pendiente', 'Finalizado'];

const orderSchema = new mongoose.Schema({
  idBuyer: { type: mongoose.Schema.Types.ObjectId, ref: 'ProfileBuyer', required: true },
  subOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubOrder' }],
  orderDate: { type: Date, required: true, default: Date.now},
  totalPrice: {type: Number, required: true},
  status: { type: String, enum: Status}
});

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);