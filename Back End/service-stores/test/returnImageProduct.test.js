const BookController = require('../controllers/BookController');
require('../models/Book')(req.app.locals.mainDB)

jest.mock('../models/Book', () => {
  return jest.fn(() => mockBookModel);
});

let mockBookModel;

describe('BookController.getImage', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    // Mock del modelo Book
    mockBookModel = {
      findById: jest.fn()
    };

    // Mock del request con la BD inyectada
    mockReq = {
      params: { id: 'BOOK123' },
      app: {
        locals: {
          mainDB: {}   // la conexión no importa para el test
        }
      }
    };

    // Mock del response
    mockRes = {
      status: jest.fn(() => mockRes),
      send: jest.fn(),
      json: jest.fn(),
      contentType: jest.fn()
    };

    jest.clearAllMocks();
  });

  test('Debe enviar la imagen cuando existe', async () => {
    const fakeImage = {
      contentType: 'image/png',
      data: Buffer.from('FAKE_IMAGE_DATA')
    };

    mockBookModel.findById.mockResolvedValue({
      id: 'BOOK123',
      image: fakeImage
    });

    await BookController.getImage(mockReq, mockRes);

    expect(mockBookModel.findById).toHaveBeenCalledWith('BOOK123');
    expect(mockRes.contentType).toHaveBeenCalledWith('image/png');
    expect(mockRes.send).toHaveBeenCalledWith(fakeImage.data);
  });

  test('Debe retornar 404 si el libro no existe', async () => {
    mockBookModel.findById.mockResolvedValue(null);

    await BookController.getImage(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.send).toHaveBeenCalledWith('Imagen no encontrada');
  });

  test('Debe retornar 404 si el libro existe pero NO tiene imagen', async () => {
    mockBookModel.findById.mockResolvedValue({
      id: 'BOOK123',
      image: null
    });

    await BookController.getImage(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.send).toHaveBeenCalledWith('Imagen no encontrada');
  });

  test('Debe retornar 500 si ocurre un error interno', async () => {
    mockBookModel.findById.mockRejectedValue(new Error('DB error'));

    await BookController.getImage(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Error al obtener imagen',
      detalle: 'DB error'
    });
  });
});