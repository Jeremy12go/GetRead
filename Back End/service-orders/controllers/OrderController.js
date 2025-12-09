const Order = require('../models/Order');
const SubOrder = require('../models/SubOrder');

exports.getOrderById = async (req, res) => {
  try {
    const id = req.params.OrderId;

    if (id === null) {
      return res.status(400).json({ error: 'ID de orden nula' });
    }

    const order = await Order.findById(id).lean();
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener la orden', detalle: e.message });
  }
};

exports.getSubOrderById = async (req, res) => {
  try {
    const id = req.params.subOrderId;

    if (!id) {
      return res.status(400).json({ error: 'ID de sub orden nula' });
    }

    const subOrder = await SubOrder.findById(id).lean();

    if (!subOrder) {
      return res.status(404).json({ error: 'Sub orden no encontrada' });
    }

    const normalized = {
      _id: subOrder._id,
      idSeller: subOrder.idSeller || subOrder.seller || subOrder.sellerId,
      productList: subOrder.productList,
      totalPrice: subOrder.totalPrice,
      status: subOrder.status
    };

    res.json(normalized);

  } catch (e) {
    console.error('Error en getSubOrderById:', e);
    res.status(500).json({ 
      error: 'Error al obtener la suborden', 
      detalle: e.message 
    });
  }
};

//para tener ordenes por comprador
exports.getByBuyer = async (req, res) => {
  try {
    const id = req.params.buyerId;
    const orders = await Order.find({ idBuyer: id }).lean();

    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: 'No se encontraron órdenes para este comprador' });
    }

    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener órdenes', detalle: e.message });
  }
};

exports.createOrderFromCart = async (req, res) => {
  try {
    const { idBuyer, productList, totalPrice } = req.body;

    if (!idBuyer || !productList || productList.length === 0) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    // Crear Order principal
    const order = await Order.create({
      idBuyer,
      totalPrice,
      status: 'Pendiente'
    });

    // Agrupar por vendedor
    const productsBySeller = {};

    for (const item of productList) {
      if (!item.idSeller) {
        return res.status(400).json({ error: 'Falta idSeller en algún producto' });
      }

      if (!productsBySeller[item.idSeller]) {
        productsBySeller[item.idSeller] = [];
      }

      productsBySeller[item.idSeller].push({
        book: item.book,
        quantity: item.quantity,
        priceAtPurchase: item.priceAtPurchase
      });
    }

    // Crear SubOrders
    const subOrdersIds = [];

    for (const sellerId of Object.keys(productsBySeller)) {
      const products = productsBySeller[sellerId];

      const subTotal = products.reduce(
        (acc, p) => acc + (p.priceAtPurchase * p.quantity),
        0
      );

      const subOrder = await SubOrder.create({
        idOrderParent: order._id,
        idSeller: sellerId,
        productList: products,
        totalPrice: subTotal,
        status: 'Pendiente'
      });

      subOrdersIds.push(subOrder._id);
    }

    // Guardar suborders en Order
    order.subOrders = subOrdersIds;
    await order.save();

    res.status(201).json({
      order,
      subOrders: subOrdersIds
    });

  } catch (e) {
    console.error('Error creando orden:', e);
    res.status(500).json({ error: 'Error al crear orden', detalle: e.message });
  }
};

exports.qualifySubOrder = async (req, res) => {
  const { rating, comment } = req.body;

  const updated = await SubOrder.findByIdAndUpdate(
    req.params.subOrderId,
    {
      rating,
      comment,
      status: "Finalizado"
    },
    { new: true }
  );

  res.json(updated);
};