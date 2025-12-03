jest.mock('axios'); // por si hubiera llamadas internas
const OrderController = require('../controllers/OrderController');
const Order = require('../models/Order');

jest.mock('../models/Order');

describe("OrderController.update", () => {

  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      params: { id: "ORDER123" },
      body: { product: { book: "BOOK1", quantity: 2 } }
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Order.findByIdAndUpdate.mockReset();
  });

  // 1️⃣ TEST ÉXITO
  test("Debe actualizar una orden y devolverla", async () => {

    const updatedOrder = {
      _id: "ORDER123",
      productList: [
        { book: "BOOK1", quantity: 2 }
      ]
    };

    Order.findByIdAndUpdate.mockResolvedValue(updatedOrder);

    await OrderController.update(mockReq, mockRes);

    expect(Order.findByIdAndUpdate).toHaveBeenCalledWith(
      "ORDER123",
      { $push: { productList: mockReq.body.product }},
      { new: true, runValidators: true }
    );

    expect(mockRes.json).toHaveBeenCalledWith(updatedOrder);
  });

  // 2️⃣ TEST 404
  test("Debe retornar 404 si la orden no existe", async () => {

    Order.findByIdAndUpdate.mockResolvedValue(null);

    await OrderController.update(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Orden no encontrada'
    });
  });

  // 3️⃣ TEST ERROR 400
  test("Debe retornar 400 si ocurre un error en la BD", async () => {

    Order.findByIdAndUpdate.mockRejectedValue(new Error("DB error"));

    await OrderController.update(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Error al actualizar',
      detalle: "DB error"
    });
  });
});