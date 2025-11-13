const StoreController = require('../controllers/StoreController');
const mongoose = require('mongoose');

describe('StoreController.addRating', () => {
  let mockReq, mockRes, mockStoreModel;

  beforeEach(() => {
    mockStoreModel = {
      findOneAndUpdate: jest.fn()
    };

    mockReq = {
      params: { id: '123' },
      body: { ratingId: 'R001' },
      app: {
        locals: {
          supportDB: {
            model: jest.fn().mockReturnValue(mockStoreModel)
          }
        }
      }
    };

    mockRes = {
      status: jest.fn(),
      json: jest.fn()
    };

    mockRes.status.mockReturnValue(mockRes);

    jest.clearAllMocks();
  });

  test('Debe agregar un rating correctamente y retornar la tienda actualizada', async () => {
    const fakeStore = {
      id: '123',
      name: 'Librería Central',
      ratings: ['R001']
    };

    mockStoreModel.findOneAndUpdate.mockResolvedValue(fakeStore);

    await StoreController.addRating(mockReq, mockRes);

    expect(mockStoreModel.findOneAndUpdate).toHaveBeenCalledWith(
      { id: '123' },
      { $push: { ratings: 'R001' } },
      { new: true }
    );

    expect(mockRes.json).toHaveBeenCalledWith(fakeStore);
  });

  test('Debe retornar 404 cuando la tienda no existe', async () => {
    mockStoreModel.findOneAndUpdate.mockResolvedValue(null);

    await StoreController.addRating(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Tienda no encontrada'
    });
  });

  test('Debe retornar 400 cuando ocurre un error', async () => {
    mockStoreModel.findOneAndUpdate.mockRejectedValue(new Error('DB error'));

    await StoreController.addRating(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Error al agregar rating',
      detalle: 'DB error'
    });
  });
});
