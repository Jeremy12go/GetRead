const Book = require('../models/Book');

exports.getById = async (req, res) => {
  try {
    const book = await Book.findOne({ id: req.params._id });
    if (!book) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    res.json(book);
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener libro', detalle: e.message });
  }
};

exports.getByIdStore = async (req, res) => {
  try {
    const books = await Book.find({ idStore: req.params.idStore });
    if ( books.length === 0 ) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    res.json(books);
  } catch(e){
    res.status(500).json({error: 'Error al obtener libro', detalle: e.message });
  }
};

exports.getImage = async (req, res) => {
  try {
    const book = await Book.findOne({ id: req.params._id });

    if (!book || !book.image) {
      return res.status(404).send('Imagen no encontrado');
    }

    res.contentType(book.image.contentType);
    res.send(book.image.data);
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener imagen', detalle: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if(!book)
      return res.status(404).json({error: 'Libro no encontrado', detalle: e.message } );

    res.json(book);
  } catch(e) {
    res.status(400).json({ error: 'Error al actualizar', detalle: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const removedBook = await Book.findByIdAndDelete({id: req.params._id});
    if (!removedBook)
      return res.status(404).json({ error: 'Libro no encontrado' });

    res.status(204).end();
  } catch (e) {
    res.status(500).json({ error: 'Error al eliminar libro', detalle: e.message });
  }
};