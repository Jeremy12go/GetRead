const mongoose = require('mongoose');

const Genre = ['Novela', 'Cuento', 'Fabula', 'Poesia', 'Comedia', 'Drama', 'Filosofico', 'Cientifico',
   'Fantasia', 'Ciencia Ficción', 'Terror', 'Misterio', 'Suspenso', 'Romance', 'Aventura', 'Biografia',
   'Historia', 'Ciencia', 'Filosofia', 'Psicologia', 'Autoayuda', 'Politica', 'Economia', 'Educación',
   'Arte', 'Musica', 'Cine', 'Tecnologia', 'Turismo', 'Gastronomia', 'Espiritualidad', 'Religión'];

const Public_Range = ['Infantil', 'Juvenil', 'Adulto', 'Todo Publico'];
//cambios realizados en el schema que libro
const bookSchema = new mongoose.Schema({
  idseller: { type: mongoose.Schema.Types.ObjectId, ref: 'ProfileSeller' },
  isbn: { type: String, required: true },
  author: { type: String, required: true },
  name: { type: String, required: true },
  image: { data: Buffer, contentType: String },
  price: { type: Number, required: true },
  stock: { type: Number, required: true},
  description: { type: String, required: true },
  genre: { type: String, enum: Genre},
  public_range: { type: String, enum: Public_Range }
});

//indices para buscar por nombre, autor y genero
//el index({ campo: 1 }) crea un indice ascendente en el campo
//y de esta forma, mongoDB construye una estructura interna para
//buscar libros mas rapido
bookSchema.index({ name: 1 });
bookSchema.index({ author: 1 });
bookSchema.index({ genre: 1 });

module.exports = (connection) => connection.model('Book', bookSchema);
