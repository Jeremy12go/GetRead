const mongoose = require('mongoose');

const Genre = ['Novela', 'Cuento', 'Fabula', 'Poesia', 'Comedia', 'Drama', 'Filosofico', 'Cientifico',
   'Fantasia', 'Ciencia Ficción', 'Terror', 'Misterio', 'Suspenso', 'Romance', 'Aventura', 'Bigrafia',
   'Historia', 'Ciencia', 'Filosofia', 'Psicologia', 'Autoayuda', 'Politica', 'Economia', 'Educación',
   'Arte', 'Musica', 'Cine', 'Tecnologia', 'Turismo', 'Gastronomia', 'Espiritualidad', 'Religión'];

const Public_Range = ['Infantil', 'Juvenil', 'Adulto', 'Todo Publico'];

const productSchema = new mongoose.Schema({
  idStore: { type: String, required: true },
  isbn: { type: String, required: true },
  name: { type: String, required: true },
  image: { data: Buffer, contentType: String },
  price: { type: mongoose.Schema.Types.Double, required: true },
  description: { type: String, required: true },
  genre: { type: String, enum: Genre},
  public_range: { type: String, enum: Public_Range }
});

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
