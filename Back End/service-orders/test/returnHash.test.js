// ⬅️ MOCK DE AXIOS
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
}));

// Ahora sí se puede importar el controlador
const OrderController = require('../controllers/OrderController');
const Order = require('../models/Order');

// mock del modelo
jest.mock('../models/Order');

describe('OrderController.getByIds', () => {

  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = { body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('Debe retornar las órdenes cuando se envían ids válidos', async () => {
    mockReq.body = { ids: ['id1', 'id2'] };

    const fakeOrders = [
      { _id: 'id1', total: 100 },
      { _id: 'id2', total: 200 }
    ];

    Order.find.mockReturnValue({
      lean: jest.fn().mockResolvedValue(fakeOrders)
    });

    await OrderController.getByIds(mockReq, mockRes);

    expect(Order.find).toHaveBeenCalledWith({ _id: { $in: ['id1', 'id2'] } });
    expect(mockRes.json).toHaveBeenCalledWith(fakeOrders);
  });

  test('Debe retornar 400 si no se envía un array válido', async () => {
    mockReq.body = { ids: [] };

    await OrderController.getByIds(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Debes enviar un array de ids'
    });
  });

  test('Debe retornar 500 si ocurre un error en la BD', async () => {
    mockReq.body = { ids: ['id1'] };

    Order.find.mockImplementation(() => {
      throw new Error('DB error');
    });

    await OrderController.getByIds(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Error al obtener órdenes',
      detalle: 'DB error'
    });
  });
});