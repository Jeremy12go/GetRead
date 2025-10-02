const { getByIds } = require('../controllers/OrderController');
const Order = require('../models/Order'); // importa tu modelo

// Mock del modelo Order
jest.mock('../models/Order');

describe("getByIds controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: { ids: ["68dd24c37bb11afcebe2547f", "68dd26fc8269b3dfb9737cbc"] } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it("should return orders when ids are provided", async () => {
    // Fake data
    const mockOrders = [
      {
        "_id": "68dd24c37bb11afcebe2547f",
        "productList": [],
        "idProfile": "profileImaginario1",
        "idStore": "tiendaImaginario1",
        "orderDate": "2025-10-01T12:55:31.404Z",
        "totalPrice": 6999.9,
        "__v": 0
      },
      {
        "_id": "68dd26fc8269b3dfb9737cbc",
        "productList": [],
        "idProfile": "profileImaginario2",
        "idStore": "tiendaImaginario2",
        "orderDate": "2025-10-01T13:05:00.526Z",
        "totalPrice": 9899.9,
        "__v": 0
      }
    ];

    // Mock de Order.find().lean()
    Order.find.mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockOrders)
    });

    await getByIds(req, res);

    expect(Order.find).toHaveBeenCalledWith({ _id: { $in: req.body.ids } });
    expect(res.json).toHaveBeenCalledWith(mockOrders);
  });

  it("should return 400 if ids array is empty", async () => {
    req.body.ids = [];

    await getByIds(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Debes enviar un array de ids' });
  });

  it("should return 500 on error", async () => {
    Order.find.mockImplementation(() => { throw new Error("DB error"); });

    await getByIds(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error al obtener órdenes',
      detalle: "DB error"
    });
  });
});