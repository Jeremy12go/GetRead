const ProfileBuyer = require('../models/ProfileBuyer');

exports.getById = async (req, res) => {
  try {
    const profile = await ProfileBuyer.findById(req.params.id); // Es el buyerId
    if (!profile) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }
    res.json(profile);
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener perfil', detalle: e.message });
  }
};


exports.update = async (req, res) => {
  console.log("Backend Recibe:", req.body);
  try {
    const updatedProfile = await ProfileBuyer.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!updatedProfile) {
      return res.status(404).json({ error: `Perfil no encontrado` });
    }
    res.json(updatedProfile);
  } catch (e) {
    res.status(400).json({ error: 'Error al actualizar profile', detalle: e.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { buyerId } = req.params;
    const { bookId, quantity } = req.body;

    const buyer = await ProfileBuyer.findById(buyerId);
    if (!buyer) {
      return res.status(404).json({ error: 'Comprador no encontrado' });
    }

    const existingItem = buyer.cart.find(item => item.book.toString() === bookId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      buyer.cart.push({ book: bookId, quantity });
    }

    await buyer.save();
    res.json(buyer.cart);
  } catch (e) {
    res.status(500).json({ error: 'Error al añadir al carrito', detalle: e.message });
  }
};

// Vaciar carrito del comprador
exports.clearCart = async (req, res) => {
  try {
    const buyer = await ProfileBuyer.findByIdAndUpdate(
        req.params.buyerId,
        { cart: [] },
        { new: true }
    );
    if (!buyer) return res.status(404).json({ error: 'Comprador no encontrado' });
    res.json(buyer);
  } catch (e) {
    console.error('Error en clearCart:', e);
    res.status(500).json({ error: 'Error al vaciar carrito', detalle: e.message });
  }
};


// Vincular orden al comprador
exports.addOrder = async (req, res) => {
  try {
    const buyer = await ProfileBuyer.findByIdAndUpdate(
        req.params.buyerId,
        { $push: { orders: req.body.orderId } },
        { new: true }
    );
    if (!buyer) return res.status(404).json({ error: 'Comprador no encontrado' });
    res.json(buyer);
  } catch (e) {
    console.error('Error en addOrder:', e);
    res.status(500).json({ error: 'Error al vincular orden', detalle: e.message });
  }
};

//para añadie libros al array de libros del comprador
exports.addBooks = async (req, res) => {
  try {
    const { books } = req.body;

    const buyer = await ProfileBuyer.findById(req.params.buyerId);
    if (!buyer) return res.status(404).json({ error: 'Comprador no encontrado' });

    books.forEach(nuevoLibro => {
      const yaExiste = buyer.books.some(l => l.book.toString() === nuevoLibro.book.toString());
      if (!yaExiste) {
        buyer.books.push(nuevoLibro);
      }
    });

    await buyer.save();
    res.json(buyer);
  } catch (e) {
    console.error('Error en addBooks:', e);
    res.status(500).json({ error: 'Error al actualizar libros', detalle: e.message });
  }
};

