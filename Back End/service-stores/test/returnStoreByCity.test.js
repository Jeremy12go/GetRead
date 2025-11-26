const StoreController = require('../controllers/StoreController');

describe('StoreController.getByCity', () => {
  let mockReq, mockRes, mockStoreModel;

  beforeEach(() => {
    // Mock del modelo Store
    mockStoreModel = {
      find: jest.fn()
    };

    // Mock de req con DB inyectada
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

    // Mock de res
    mockRes = {
      status: jest.fn(() => mockRes),
      json: jest.fn(),
      send: jest.fn()
    };

    jest.clearAllMocks();
  });

  test('Debe devolver lista de tiendas cuando existen', async () => {
    const fakeStores = [
      { id: '1', name: 'Librería Central', city: 'Santiago' },
      { id: '2', name: 'Books House', city: 'Santiago' }
    ];

    mockStoreModel.find.mockResolvedValue(fakeStores);

    await StoreController.getByCity(mockReq, mockRes);

    expect(mockStoreModel.find).toHaveBeenCalledWith({
      city: { $regex: new RegExp('Santiago', 'i') }
    });

    expect(mockRes.json).toHaveBeenCalledWith(fakeStores);
  });

  test('Debe retornar 404 si no existen tiendas en esa ciudad', async () => {
    mockStoreModel.find.mockResolvedValue([]);

    await StoreController.getByCity(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Tienda no encontrada'
    });
  });

  test('Debe retornar 500 si ocurre un error en la base de datos', async () => {
    mockStoreModel.find.mockRejectedValue(new Error('DB error'));

    await StoreController.getByCity(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Error al obtener tienda',
      detalle: 'DB error'
    });
  });
});