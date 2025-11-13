//Código de prueba para retornar una tienda por ciudad en base a StoreController.js

const mongoose = require('mongoose');
const StoreController = require('../controllers/StoreController');

describe('StoreController.getByCity', () => {

  let mockReq, mockRes, mockStoreModel;

  beforeEach(() => {
    mockStoreModel = {
      find: jest.fn()
    };

    mockReq = {
      params: { city: 'Santiago' },
      app: {
        locals: {
          supportDB: {
            model: jest.fn().mockReturnValue(mockStoreModel)
          }
        }
      }
    };

    mockRes = {
      status: jest.fn().mockReturnValueThis?.() || jest.fn().mockReturnValue({}),
      json: jest.fn(),
      send: jest.fn()
    };

    // Fix for res.status() chaining in Jest
    mockRes.status.mockReturnValue(mockRes);
  });

  test('Debe devolver 404 si no hay tiendas', async () => {
    mockStoreModel.find.mockResolvedValue([]);

    await StoreController.getByCity(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Tienda no encontrada'
    });
  });

  test('Debe devolver lista de tiendas si existen', async () => {
    const fakeStores = [
      { name: 'Librería Central', city: 'Santiago' },
      { name: 'Books House', city: 'Santiago' }
    ];

    mockStoreModel.find.mockResolvedValue(fakeStores);

    await StoreController.getByCity(mockReq, mockRes);

    expect(mockStoreModel.find).toHaveBeenCalledWith({
      city: { $regex: new RegExp('Santiago', 'i') }
    });

    expect(mockRes.json).toHaveBeenCalledWith(fakeStores);
  });

  test('Debe devolver 500 si ocurre un error', async () => {
    mockStoreModel.find.mockRejectedValue(new Error('DB error'));

    await StoreController.getByCity(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Error al obtener tienda',
      detalle: 'DB error'
    });
  });
});