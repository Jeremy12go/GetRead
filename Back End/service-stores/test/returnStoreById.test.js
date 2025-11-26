const StoreController = require('../controllers/StoreController');

describe('StoreController.getById', () => {
  let mockReq, mockRes, mockStoreModel;

  beforeEach(() => {
    // Mock del modelo Store
    mockStoreModel = {
      findById: jest.fn()
    };

    // Mock de req con base de datos inyectada
    mockReq = {
      params: { id: 'STORE123' },
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

  test('Debe retornar la tienda si existe', async () => {
    const fakeStore = {
      id: 'STORE123',
      name: 'Librería Central',
      city: 'Santiago'
    };

    mockStoreModel.findById.mockResolvedValue(fakeStore);

    await StoreController.getById(mockReq, mockRes);

    expect(mockStoreModel.findById).toHaveBeenCalledWith('STORE123');
    expect(mockRes.json).toHaveBeenCalledWith(fakeStore);
  });

  test('Debe retornar 404 si la tienda no existe', async () => {
    mockStoreModel.findById.mockResolvedValue(null);

    await StoreController.getById(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Tienda no encontrada'
    });
  });

  test('Debe retornar 500 si ocurre un error interno', async () => {
    mockStoreModel.findById.mockRejectedValue(new Error('DB error'));

    await StoreController.getById(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Error al obtener la tienda',
      detalle: 'DB error'
    });
  });
});