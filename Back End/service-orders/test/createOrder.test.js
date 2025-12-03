// Mock axios (aunque esta función no usa axios, OrderController lo importa)
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
}));

// Mock del modelo Order
jest.mock('../models/Order');

const Order = require('../models/Order');
const OrderController = require('../controllers/OrderController');

describe("OrderController.create", () => {

  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      body: {
        buyer: "BUYER123",
        sellers: ["SELLER1", "SELLER2"],
        productList: [
          { book: "BOOK1", quantity: 1, priceAtPurchase: 10 }
        ]
      }
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  test("Debe crear una orden correctamente y retornar 201", async () => {
    const fakeOrder = {
      _id: "ORDER123",
      ...mockReq.body,
      orderDate: new Date(),
      status: "Pendiente"
    };

    Order.create.mockResolvedValue(fakeOrder);

    await OrderController.create(mockReq, mockRes);

    expect(Order.create).toHaveBeenCalledWith(expect.objectContaining({
      buyer: "BUYER123",
      sellers: ["SELLER1", "SELLER2"],
      productList: mockReq.body.productList,
      status: "Pendiente"
    }));

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(fakeOrder);
  });

  test("Debe retornar 400 si ocurre un error al crear la orden", async () => {
    Order.create.mockRejectedValue(new Error("Invalid data"));

    await OrderController.create(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Datos inválidos",
      detalle: "Invalid data"
    });
  });

});