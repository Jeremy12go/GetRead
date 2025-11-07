//Código de prueba para la creación de una orden en base a OrderController.js
const { create } = require('../controllers/OrderController');
const Order = require('../models/Order');

// Mock del modelo Order
jest.mock('../models/Order');
describe("create controller", () => {
  let req, res;
  beforeEach(() => {
    req = {
      body: {
        productList: [
            { productId: "prod1", quantity: 2, price: 100 },
            { productId: "prod2", quantity: 1, price: 200 }
        ],
        idProfile: "profileId123",
        idStore: "storeId456",
        totalPrice: 400
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

    it("should create order", async () => {
    const mockOrder = {
      _id: "orderId789",
      productList: req.body.productList,
      idProfile: req.body.idProfile,
      idStore: req.body.idStore,
      totalPrice: req.body.totalPrice
    };
    Order.create.mockResolvedValue(mockOrder);
    await create(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockOrder);
  });

    it("should return 400 if data is invalid", async () => {
    Order.create.mockImplementation(() => { throw new Error("Invalid data"); });
    await create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Datos inválidos", detalle: "Invalid data" });
  });
});