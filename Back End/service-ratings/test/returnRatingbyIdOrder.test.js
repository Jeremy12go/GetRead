const Rating = require('../models/Rating');
const RatingController = require('../controllers/RatingController');

// Mock del modelo Rating
jest.mock('../models/Rating');

describe('RatingController.getByIdOrder', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      params: { idOrder: 'ORDER123' }
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  test('Debe retornar el rating si existe', async () => {
    const fakeRating = {
      idOrder: 'ORDER123',
      stars: 5,
      comment: 'Muy bueno'
    };

    Rating.findOne.mockResolvedValue(fakeRating);

    await RatingController.getByIdOrder(mockReq, mockRes);

    expect(Rating.findOne).toHaveBeenCalledWith({ idOrder: 'ORDER123' });
    expect(mockRes.json).toHaveBeenCalledWith(fakeRating);
  });

  test('Debe retornar 404 si no existe rating para esa orden', async () => {
    Rating.findOne.mockResolvedValue(null);

    await RatingController.getByIdOrder(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: `Rating de orden ORDER123 no encontrado`
    });
  });

  test('Debe retornar 500 si ocurre un error interno', async () => {
    Rating.findOne.mockRejectedValue(new Error('DB error'));

    await RatingController.getByIdOrder(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Error al obtener Ratings',
      detalle: 'DB error'
    });
  });
});