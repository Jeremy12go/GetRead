const mongoose = require('mongoose');
const Book = require('../models/Book')(mongoose);
const axios = require('axios');

//version antigua//
/*
exports.getById = async (req, res) => {
  try {
    const book = await Book.findOne({ id: req.params.id });
    if (!book) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    res.json(book);
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener libro', detalle: e.message });
  }
};

exports.getByIdSeller = async (req, res) => {
  try {
    const books = await Book.find({ idseller: req.params.idseller });
    if ( books.length === 0 ) {
      return res.status(404).json({ error: 'Libros no encontrados' });
    }
    res.json(books);
  } catch(e){
    res.status(500).json({error: 'Error al obtener libros', detalle: e.message });
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
    const removedBook = await Book.findByIdAndDelete(req.params.id);
    if (!removedBook)
      return res.status(404).json({ error: 'Libro no encontrado' });

    res.status(204).end();
  } catch (e) {
    res.status(500).json({ error: 'Error al eliminar libro', detalle: e.message });
  }
};

//export para crear libro (SOLO CON POSTMAN, mas adelante hay que hacer
// otro para poder usarlo desde el frontend)
exports.createbook = async (req, res) => {
  try{
    const { idseller, isbn, author, name, image, price, description, genre, public_range } = req.body;

    const book = await Book.create({
      //ME QUEDE AQUI
      idseller: idseller,
      isbn: isbn,
      author: author,
      name: name,
      image: image,
      price: price,
      description: description,
      genre: genre,
      public_range: public_range
    });

    //esto es pa comunicarse con service-accounts (en mi caso el port de service account es 3000
    //pero si ustedes llegan a ponerle otro puerto debe cambiarse aqui tambien
    await axios.put(`http://localhost:3000/accounts/${idseller}/addbook`,{
      //esto pasa el id del libro recien creado para ponerlo en el arryalist de id de libros
      //del perfil vendedor (medio confuso pero ojala funcione)
      bookId: book._id
    });

    res.status(201).json(book);
  } catch (e){
    res.status(400).json({error: 'El libro no tiene datos validos', detalle: e.message()})
  }
};

 */

//version nueva

exports.getById = async (req, res) => {
  try {
    const Book = require('../models/Book')(req.app.locals.mainDB);
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    res.json(book);
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener libro', detalle: e.message });
  }
};

exports.getByIdSeller = async (req, res) => {
  try {
    const books = await Book.find({ idseller: req.params.idseller });
    if (books.length === 0) {
      return res.status(404).json({ error: 'Libros no encontrados' });
    }
    res.json(books);
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener libros', detalle: e.message });
  }
};

exports.getImage = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book || !book.image) {
      return res.status(404).send('Imagen no encontrada');
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
    if (!book) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    res.json(book);
  } catch (e) {
    res.status(400).json({ error: 'Error al actualizar', detalle: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const removedBook = await Book.findByIdAndDelete(req.params.id);
    if (!removedBook) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    res.status(204).end();
  } catch (e) {
    res.status(500).json({ error: 'Error al eliminar libro', detalle: e.message });
  }
};

exports.createbook = async (req, res) => {
  try {
    const Book = require('../models/Book')(req.app.locals.mainDB);

    const { idseller, isbn, author, name, price, stock, description, genre, public_range } = req.body;

    const image = req.file
        ? { data: req.file.buffer, contentType: req.file.mimetype }
        : undefined;

    const parsedGenre = typeof genre === 'string'
      ? JSON.parse(genre)
        : genre;


    const book = await Book.create({
      idseller,
      isbn,
      author,
      name,
      price: Number(price),
      stock: Number(stock),
      description,
      genre: parsedGenre,
      public_range,
      image
    });

    res.status(201).json(book);

    //se usa axios para vincular con el servicio de cuentas para añadir el libro al vendedor :D
    axios.put(`${process.env.ACCOUNTS_SERVICE_URL}/${idseller}/addbook`, {
      bookId: book._id
    }).catch(err => {
      console.error('Error al vincular libro con vendedor:', err.message);
    });

  } catch (e) {
    console.error('Error al crear libro:', e);
    res.status(400).json({ error: 'El libro no tiene datos válidos', detalle: e.message });
  }
};

exports.modifystock = async(req, res) =>{
  try {
    const Book = require('../models/Book')(req.app.locals.mainDB);
    const book = await Book.findByIdAndUpdate(
        req.params.id,
        { stock: req.body.stock },
        { new: true }
    );
    if (!book) return res.status(404).json({ error: 'Libro no encontrado' });
    res.json(book);
  } catch (e) {
    res.status(500).json({ error: 'Error al actualizar stock', detalle: e.message });
  }
};
