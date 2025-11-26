const StoreController = require('../controllers/StoreController');

describe('StoreController.update', () => {
  let mockReq, mockRes, mockStoreModel;

  beforeEach(() => {
    // Mock del modelo Store
    mockStoreModel = {
      findByIdAndUpdate: jest.fn()
    };

    // Mock de req con la DB inyectada
    mockReq = {
      params: { id: 'STORE123' },
      body: { name: 'Nueva Librería', phoneNumber: '987654321' },
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

  test('Debe actualizar y retornar la tienda cuando existe', async () => {
    const fakeStore = {
      id: 'STORE123',
      name: 'Nueva Librería',
      phoneNumber: '987654321'
    };

    mockStoreModel.findByIdAndUpdate.mockResolvedValue(fakeStore);

    await StoreController.update(mockReq, mockRes);

    // Verificar que se llamó correctamente
    expect(mockStoreModel.findByIdAndUpdate).toHaveBeenCalledWith(
      'STORE123',
      { name: 'Nueva Librería', phoneNumber: '987654321' },
      { new: true, runValidators: true }
    );

    // Respuesta esperada
    expect(mockRes.json).toHaveBeenCalledWith(fakeStore);
  });

  test('Debe retornar 404 cuando la tienda no existe', async () => {
    mockStoreModel.findByIdAndUpdate.mockResolvedValue(null);

    await StoreController.update(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Tienda no encontrada'
    });
  });

  test('Debe retornar 400 cuando ocurre un error en la actualización', async () => {
    mockStoreModel.findByIdAndUpdate.mockRejectedValue(new Error('DB error'));

    await StoreController.update(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Error al actualizar',
      detalle: 'DB error'
    });
  });
});