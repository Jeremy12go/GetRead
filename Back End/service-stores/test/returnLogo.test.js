const StoreController = require('../controllers/StoreController');

describe('StoreController.getLogo', () => {

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
      json: jest.fn(),
      send: jest.fn(),
      contentType: jest.fn()
    };

    mockRes.status.mockReturnValue(mockRes);
    jest.clearAllMocks();
  });

  test('Debe retornar 404 si la tienda no tiene logo o no existe', async () => {
    mockStoreModel.findOne.mockResolvedValue(null);

    await StoreController.getLogo(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.send).toHaveBeenCalledWith('Logo no encontrado');
  });

  test('Debe retornar 404 si la tienda existe pero no tiene logo', async () => {
    mockStoreModel.findOne.mockResolvedValue({
      id: 'STORE001',
      logo: null
    });

    await StoreController.getLogo(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.send).toHaveBeenCalledWith('Logo no encontrado');
  });

  test('Debe enviar el logo cuando existe', async () => {
    const fakeLogo = {
      contentType: 'image/png',
      data: Buffer.from('FAKE_IMAGE_DATA')
    };

    mockStoreModel.findOne.mockResolvedValue({
      id: 'STORE001',
      logo: fakeLogo
    });

    await StoreController.getLogo(mockReq, mockRes);

    expect(mockRes.contentType).toHaveBeenCalledWith('image/png');
    expect(mockRes.send).toHaveBeenCalledWith(fakeLogo.data);
  });

  test('Debe retornar 500 si ocurre error interno', async () => {
    mockStoreModel.findOne.mockRejectedValue(new Error('DB error'));

    await StoreController.getLogo(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Error al obtener logo',
      detalle: 'DB error'
    });
  });

});