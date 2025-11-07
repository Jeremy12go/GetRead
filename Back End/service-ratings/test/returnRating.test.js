// Código de prueba para la obtención de una calificación en base a RatingController.js
const { getByIdOrder } = require('../controllers/RatingController');
const Rating = require('../models/Rating'); // importa tu modelo

// Mock del modelo Rating
jest.mock('../models/Rating');
describe("getByIdOrder controller", () => {
  let req, res;
    beforeEach(() => {
    req = { params: { idOrder: "orderImaginario1" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it("should return rating when found", async () => {
    // Fake data
    const mockRating = {
      id: "rating1",
      idStore: "storeImaginario1",
      idOrder: "orderImaginario1",
      idProfile: "profileImaginario1",
      stars: 5,
      comment: "Excelente servicio"
    };
    Rating.findOne.mockResolvedValue(mockRating);

    await getByIdOrder(req, res);
    expect(res.json).toHaveBeenCalledWith(mockRating);
  });
  
  it("should return 404 when rating not found", async () => {
    Rating.findOne.mockResolvedValue(null);

    await getByIdOrder(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: `Rating de orden ${req.params.idOrder} no encontrado` });
    });

  it("should return 500 on error", async () => {
    Rating.findOne.mockRejectedValue(new Error("DB error"));
    await getByIdOrder(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Error al obtener Ratings", detalle: "DB error" });
  });
});