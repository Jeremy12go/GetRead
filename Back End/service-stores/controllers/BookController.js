const mongoose = require('mongoose');
const axios = require('axios');

exports.getAllBooks = async (req, res) => {
  try {
    const Book = require('../models/Book');
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.getById = async (req, res) => {
  try {
    const Book = require('../models/Book');
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
    const Book = require('../models/Book');
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
    const Book = require('../models/Book');
    const book = await Book.findById(req.params.id).select("image");
    if (!book || !book.image) {
      return res.status(404).send('Imagen no encontrada');
    }
    res.json({ cover: book.cover });
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener imagen', detalle: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const Book = require('../models/Book');
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
    const Book = require('../models/Book');
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
    const Book = require('../models/Book');

    const { idseller, isbn, author, name, price, stock, description, genre, public_range } = req.body;

    const image = req.file.path;

    const parsedGenre = typeof genre === 'string' ? JSON.parse(genre) : genre;

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

    axios.put(`${process.env.ACCOUNTS_SERVICE_URL}/accounts/${idseller}/addbook`, {
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
    const Book = require('../models/Book');
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
