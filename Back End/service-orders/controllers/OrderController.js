const axios = require('axios');
const Order = require('../models/Order');

exports.getByIds = async (req, res) => {
  try {
    const { ids } = req.body; // Espera { ids: [array de ids] }.
    console.log("ids", {ids})

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Debes enviar un array de ids' });
    }

    const orders = await Order.find({ _id: { $in: ids } }).lean();
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener órdenes', detalle: e.message });
  }
};

//SIN TOCAR (Puede estar obsoleto... o non xd)
exports.getByIdProfile = async (req, res) => {
  try {
    const orders = await Order.find({ idProfile: req.params.idProfile } );
    if (orders.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    res.json(orders);
  } catch(e) {
    res.status(500).json({ error: 'Error al obtener Ordenes', detalle: e.message });
  }
};

//para tener ordenes por comprador
exports.getByBuyer = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.params.buyerId });
    if (orders.length === 0) {
      return res.status(404).json({ error: 'No se encontraron órdenes para este comprador' });
    }
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener órdenes', detalle: e.message });
  }
};


//este funciona maoma porque crea ordenes pero no actualiza el stock
//(esto lo use en postman)
exports.create = async (req, res) => {
  try {
    const { buyer, sellers, productList } = req.body;

    const order = await Order.create({
      productList,
      buyer,
      sellers,
      orderDate: new Date(),
      status: 'Pendiente'
    });

    res.status(201).json(order);
  } catch (e) {
    res.status(400).json({ error: 'Datos inválidos', detalle: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        { $push: { productList: req.body.product } },
        { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    res.json(order);
  } catch (e) {
    res.status(400).json({ error: 'Error al actualizar', detalle: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const removedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!removedOrder) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    res.status(204).end();
  } catch (e) {
    res.status(500).json({ error: 'Error al eliminar orden', detalle: e.message });
  }
};

//funcion para crear una orden a partir de un carrito
exports.createOrderFromCart = async (req, res) => {
  try {
    const { buyerId } = req.params;
    console.log('buyer id es: ', buyerId);

    //para obtener el perfil comrpador
    const buyerRes = await axios.get(`${process.env.ACCOUNTS_SERVICE_URL}/buyer/${buyerId}`);
    const buyer = buyerRes.data;

    if (!buyer || !buyer.cart || buyer.cart.length === 0) {
      return res.status(400).json({ error: 'Carrito vacío o comprador no encontrado' });
    }


    let totalPrice = 0;
    const productList = [];
    const sellersSet = new Set();

    for (const item of buyer.cart) {
      const bookRes = await axios.get(`${process.env.BOOKS_SERVICE_URL}/${item.book}`);
      const book = bookRes.data;

      if (!book) {
        return res.status(404).json({ error: `Libro ${item.book} no encontrado` });
      }

      const priceAtPurchase = book.price;
      totalPrice += priceAtPurchase * item.quantity;

      productList.push({
        book: book._id,
        quantity: item.quantity,
        priceAtPurchase
      });

      sellersSet.add(book.idseller);

      //llamamos al servicio de libros y actualizamos stock
      await axios.patch(`${process.env.BOOKS_SERVICE_URL}/${book._id}/stock`, {
        stock: book.stock - item.quantity
      }).catch(err => {
        console.error('Error al actualizar stock del libro:', err.message);
      });
    }

    const order = await Order.create({
      productList,
      idBuyer: buyer._id,
      idSellers: Array.from(sellersSet),
      totalPrice,
      status: 'Pendiente'
    });

    //llamamos el servicio de cuenta para vaciar carrito
    await axios.patch(`${process.env.ACCOUNTS_SERVICE_URL}/buyer/${buyerId}/clearcart`)
        .catch(err => {
          console.error('Error al vaciar carrito del comprador:', err.message);
        });

    //llamamos el servicio de cuenta para vincular la orden y guardarla en el array de oredenes
    await axios.put(`${process.env.ACCOUNTS_SERVICE_URL}/buyer/${buyerId}/addorder`, {
      orderId: order._id
    }).catch(err => {
      console.error('Error al vincular orden con comprador:', err.message);
    });

    //hacemos lo mismo pero con la cuenta del vendedor
    for (const sellerId of order.idSellers) {
      await axios.put(`${process.env.ACCOUNTS_SERVICE_URL}/seller/${sellerId}/addorder`, {
        orderId: order._id
      }).catch(err => {
        console.error(`Error al vincular orden con vendedor ${sellerId}:`, err.message);
      });
    }

    const librosComprados = productList.map(p => ({
      book: p.book,
      quantity: p.quantity,
    }));
    //llamamos al servicio de cuentas para actualizar los libros del comprador
    await axios.put(`${process.env.ACCOUNTS_SERVICE_URL}/buyer/${buyerId}/addbooks`, {
      books: librosComprados
    }).catch(err => {
      console.error('Error al actualizar libros del comprador:', err.message)
    });

    res.status(201).json(order);

  } catch (e) {
    console.error('Error al crear orden desde carrito:', e);
    res.status(500).json({ error: 'Error al crear orden desde carrito', detalle: e.message });
  }
};
