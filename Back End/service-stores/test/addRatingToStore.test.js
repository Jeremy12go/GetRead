const StoreController = require('../controllers/StoreController');

describe('StoreController.addRating', () => {
  let mockReq, mockRes, mockStoreModel;

  beforeEach(() => {
    // Mock del modelo Store
    mockStoreModel = {
      findByIdAndUpdate: jest.fn()
    };

    // Mock de req con DB inyectada
    mockReq = {
      params: { id: 'STORE123' },
      body: { ratingId: 'RATING001' },
      app: {
        locals: {
          supportDB: {
            model: jest.fn().mockReturnValue(mockStoreModel)
          }
        }
      }
    };

    // Mock de res
    mockRes = {
      status: jest.fn(() => mockRes),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  test('Debe agregar un rating a la tienda y devolver la tienda actualizada', async () => {
    const fakeUpdatedStore = {
      id: 'STORE123',
      name: 'Librería Central',
      ratings: ['RATING001']
    };

    mockStoreModel.findByIdAndUpdate.mockResolvedValue(fakeUpdatedStore);

    await StoreController.addRating(mockReq, mockRes);

    // Verificar que se llamó correctamente
    expect(mockStoreModel.findByIdAndUpdate).toHaveBeenCalledWith(
      'STORE123',
      { $push: { ratings: 'RATING001' } },
      { new: true }
    );

    // Respuesta correcta
    expect(mockRes.json).toHaveBeenCalledWith(fakeUpdatedStore);
  });

  test('Debe retornar 404 si la tienda no existe', async () => {
    mockStoreModel.findByIdAndUpdate.mockResolvedValue(null);

    await StoreController.addRating(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Tienda no encontrada'
    });
  });

  test('Debe retornar 400 si ocurre un error en la BD', async () => {
    mockStoreModel.findByIdAndUpdate.mockRejectedValue(new Error('DB error'));

    await StoreController.addRating(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Error al agregar rating',
      detalle: 'DB error'
    });
  });

});