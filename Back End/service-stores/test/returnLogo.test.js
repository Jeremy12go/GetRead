const StoreController = require('../controllers/StoreController');

describe('StoreController.getLogo', () => {
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
      json: jest.fn(),
      send: jest.fn(),
      contentType: jest.fn()
    };

    jest.clearAllMocks();
  });

  test('Debe retornar la imagen del logo cuando existe', async () => {
    const fakeLogo = {
      contentType: 'image/png',
      data: Buffer.from('FAKE_IMAGE_DATA')
    };

    mockStoreModel.findById.mockResolvedValue({
      id: 'STORE123',
      logo: fakeLogo
    });

    await StoreController.getLogo(mockReq, mockRes);

    expect(mockStoreModel.findById).toHaveBeenCalledWith('STORE123');
    expect(mockRes.contentType).toHaveBeenCalledWith('image/png');
    expect(mockRes.send).toHaveBeenCalledWith(fakeLogo.data);
  });

  test('Debe retornar 404 cuando no existe tienda o no tiene logo', async () => {
    mockStoreModel.findById.mockResolvedValue(null);

    await StoreController.getLogo(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.send).toHaveBeenCalledWith('Logo no encontrado');
  });

  test('Debe retornar 404 cuando la tienda existe pero no tiene logo', async () => {
    mockStoreModel.findById.mockResolvedValue({
      id: 'STORE123',
      logo: null
    });

    await StoreController.getLogo(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.send).toHaveBeenCalledWith('Logo no encontrado');
  });

  test('Debe retornar 500 si ocurre un error interno', async () => {
    mockStoreModel.findById.mockRejectedValue(new Error('DB error'));

    await StoreController.getLogo(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Error al obtener logo',
      detalle: 'DB error'
    });
  });
});