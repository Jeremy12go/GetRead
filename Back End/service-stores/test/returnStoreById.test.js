const StoreController = require('../controllers/StoreController');

describe('StoreController.getById', () => {

  let mockReq, mockRes, mockStoreModel;

  beforeEach(() => {
    mockStoreModel = {
      findOne: jest.fn()
    };

    mockReq = {
      params: { id: 'STORE001' },
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

  test('Debe retornar la tienda cuando existe', async () => {
    const fakeStore = {
      id: 'STORE001',
      name: 'Librería Central',
      phoneNumber: '987654321'
    };

    mockStoreModel.findOne.mockResolvedValue(fakeStore);

    await StoreController.getById(mockReq, mockRes);

    expect(mockStoreModel.findOne).toHaveBeenCalledWith({ id: 'STORE001' });
    expect(mockRes.json).toHaveBeenCalledWith(fakeStore);
  });

  test('Debe retornar 404 si la tienda no existe', async () => {
    mockStoreModel.findOne.mockResolvedValue(null);

    await StoreController.getById(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Tienda no encontrada'
    });
  });

  test('Debe retornar 500 si ocurre un error interno', async () => {
    mockStoreModel.findOne.mockRejectedValue(new Error('DB error'));

    await StoreController.getById(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Error al obtener la tienda',
      detalle: 'DB error'
    });
  });

});