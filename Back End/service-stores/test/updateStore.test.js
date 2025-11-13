const StoreController = require('../controllers/StoreController');

describe('StoreController.update', () => {

  let mockReq, mockRes, mockStoreModel;

  beforeEach(() => {
    mockStoreModel = {
      findOneAndUpdate: jest.fn()
    };

    mockReq = {
      params: { id: 'STORE123' },
      body: { name: 'Nueva Librería', phoneNumber: '123456789' },
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

  test('Debe actualizar y retornar la tienda cuando existe', async () => {
    const fakeStore = {
      id: 'STORE123',
      name: 'Nueva Librería',
      phoneNumber: '123456789'
    };

    mockStoreModel.findOneAndUpdate.mockResolvedValue(fakeStore);

    await StoreController.update(mockReq, mockRes);

    expect(mockStoreModel.findOneAndUpdate).toHaveBeenCalledWith(
      { id: 'STORE123' },
      { name: 'Nueva Librería', phoneNumber: '123456789' },
      { new: true, runValidators: true }
    );

    expect(mockRes.json).toHaveBeenCalledWith(fakeStore);
  });

  test('Debe retornar 404 si la tienda no existe', async () => {
    mockStoreModel.findOneAndUpdate.mockResolvedValue(null);

    await StoreController.update(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Tienda no encontrada'
    });
  });

  test('Debe retornar 400 si hay error al actualizar', async () => {
    mockStoreModel.findOneAndUpdate.mockRejectedValue(new Error('DB error'));

    await StoreController.update(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Error al actualizar',
      detalle: 'DB error'
    });
  });

});