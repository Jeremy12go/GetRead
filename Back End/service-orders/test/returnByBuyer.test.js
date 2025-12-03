jest.mock('axios'); // por si otros métodos usan axios
const OrderController = require('../controllers/OrderController');
const Order = require('../models/Order');

jest.mock('../models/Order');

describe("OrderController.getByBuyer", () => {

  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      params: { buyerId: "BUYER123" },
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Order.find.mockReset();
  });

  // 1️⃣ TEST: ÓRDENES ENCONTRADAS
  test("Debe retornar 200 y la lista de órdenes del comprador", async () => {

    const fakeOrders = [
      { _id: "ORDER1", buyer: "BUYER123" },
      { _id: "ORDER2", buyer: "BUYER123" }
    ];

    Order.find.mockResolvedValue(fakeOrders);

    await OrderController.getByBuyer(mockReq, mockRes);

    expect(Order.find).toHaveBeenCalledWith({ buyer: "BUYER123" });
    expect(mockRes.json).toHaveBeenCalledWith(fakeOrders);
  });

  // 2️⃣ TEST: NO HAY ÓRDENES
  test("Debe retornar 404 cuando el comprador no tiene órdenes", async () => {

    Order.find.mockResolvedValue([]);

    await OrderController.getByBuyer(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'No se encontraron órdenes para este comprador'
    });
  });

  // 3️⃣ TEST: ERROR EN BD
  test("Debe retornar 500 si ocurre un error en la BD", async () => {

    Order.find.mockRejectedValue(new Error("DB error"));

    await OrderController.getByBuyer(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Error al obtener órdenes',
      detalle: "DB error"
    });
  });
});