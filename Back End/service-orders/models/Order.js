const mongoose = require('mongoose');

const Status = ['Pendiente', 'Finalizado'];

const orderSchema = new mongoose.Schema({
  //productList: [ { type: String } ],
  productList: [{
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' , required: true},
    quantity: { type: Number, required: true, default: 1 },
    //los vendedores podrian cambiar el precio de los libros (si es que lo programamos)
    //en un caso como eso, convendria tener una variable que guarde
    //el costo del momento
    priceAtPurchase: { type: Number, required: true },
  }],
  idBuyer: { type: mongoose.Schema.Types.ObjectId, ref: 'ProfileBuyer', required: true },
  idSellers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProfileSeller', required: true}],
  //idProfile: { type: String, required: true} ,
  //idStore: { type: String, required: true},
  orderDate: { type: Date, required: true, default: Date.now}, //nelson-
  totalPrice: {type: Number, required: true},
  status: { type: String, enum: Status}
});

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);