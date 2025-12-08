const mongoose = require('mongoose');

const Status = ['Pendiente', 'Finalizado'];

const subOrderSchema = new mongoose.Schema({
  idOrderParent: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  idSeller: { type: mongoose.Schema.Types.ObjectId, ref: 'ProfileSeller', required: true },
  productList: [{
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    quantity: { type: Number, required: true },
    priceAtPurchase: { type: Number, required: true }
  }],
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: Status, default: 'Pendiente' },
  rating: { type: Number, min: 1, max: 5 },
  review: { type: String }
});

module.exports = mongoose.models.SubOrder || mongoose.model('SubOrder', subOrderSchema);
