// Mock de axios (por si el controlador lo requiere en otras funciones)
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

describe('OrderController.getByIdProfile', () => {

  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = { params: { idProfile: 'PROFILE123' } };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  test('Debe retornar las órdenes del perfil si existen', async () => {
    const fakeOrders = [
      { _id: '1', idProfile: 'PROFILE123' },
      { _id: '2', idProfile: 'PROFILE123' }
    ];

    Order.find.mockResolvedValue(fakeOrders);

    await OrderController.getByIdProfile(mockReq, mockRes);

    expect(Order.find).toHaveBeenCalledWith({ idProfile: 'PROFILE123' });
    expect(mockRes.json).toHaveBeenCalledWith(fakeOrders);
  });

  test('Debe retornar 404 si no existen órdenes del perfil', async () => {
    Order.find.mockResolvedValue([]);

    await OrderController.getByIdProfile(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Orden no encontrada'
    });
  });

  test('Debe retornar 500 si ocurre un error en la DB', async () => {
    Order.find.mockRejectedValue(new Error('DB crash'));

    await OrderController.getByIdProfile(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Error al obtener Ordenes',
      detalle: 'DB crash'
    });
  });
});