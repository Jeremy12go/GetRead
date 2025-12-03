const Rating = require('../models/Rating');
const RatingController = require('../controllers/RatingController');

jest.mock('../models/Rating');

describe('RatingController.create', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      body: {
        idSeller: 'SELLER123',
        idOrder: 'ORDER123',
        idBuyer: 'BUYER123',
        stars: 5,
        comment: 'Excelente'
      }
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  test('Debe crear un rating y retornar 201', async () => {
    const fakeRating = { _id: 'ABC', ...mockReq.body };

    Rating.create.mockResolvedValue(fakeRating);

    await RatingController.create(mockReq, mockRes);

    expect(Rating.create).toHaveBeenCalledWith({
      idSeller: 'SELLER123',
      idOrder: 'ORDER123',
      idBuyer: 'BUYER123',
      stars: 5,
      comment: 'Excelente'
    });

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(fakeRating);
  });

  test('Debe retornar 400 si ocurre un error al guardar', async () => {
    Rating.create.mockRejectedValue(new Error('Validation failed'));

    await RatingController.create(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Datos inválidos',
      detalle: 'Validation failed'
    });
  });
});
