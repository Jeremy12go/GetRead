const Order = require('../models/Order');
const { update } = require('../controllers/OrderController');

// mock del modelo Order
jest.mock('../models/Order', () => ({
  findOneAndUpdate: jest.fn()
}));

// helper para mockear res
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json  = jest.fn().mockReturnValue(res);
  return res;
};

describe('OrderController.update', () => {

  beforeEach(() => jest.clearAllMocks());

  test('Debe retornar 404 si la orden no existe', async () => {
    Order.findOneAndUpdate.mockResolvedValue(null);

    const req = {
      params: { id: 'A001' },
      body: { product: { title: 'Libro X', qty: 1 } }
    };

    const res = mockResponse();

    await update(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Orden no encontrada' });
  });

  test('Debe retornar la orden actualizada cuando existe', async () => {
    const updatedOrder = {
      id: 'A001',
      productList: [
        { title: 'Libro X', qty: 1 }
      ]
    };

    Order.findOneAndUpdate.mockResolvedValue(updatedOrder);

    const req = {
      params: { id: 'A001' },
      body: { product: { title: 'Libro X', qty: 1 } }
    };

    const res = mockResponse();

    await update(req, res);

    expect(res.json).toHaveBeenCalledWith(updatedOrder);
  });

  test('Debe retornar 400 si ocurre un error interno', async () => {
    Order.findOneAndUpdate.mockRejectedValue(new Error('Mongo error'));

    const req = {
      params: { id: 'A001' },
      body: { product: { title: 'Libro X', qty: 1 } }
    };

    const res = mockResponse();

    await update(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error al actualizar',
      detalle: 'Mongo error'
    });
  });

});