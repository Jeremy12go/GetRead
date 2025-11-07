// Código de prueba para la creación de una calificación en base a RatingController.js
const { create } = require('../controllers/RatingController');
const Rating = require('../models/Rating'); // importa tu modelo

// Mock del modelo Rating
jest.mock('../models/Rating');
describe("createRating controller", () => {
  let req, res;
    beforeEach(() => {
    req = { body: {
      idStore: "storeImaginario1",
      idOrder: "orderImaginario1",
        idProfile: "profileImaginario1",
        stars: 5,
        comment: "Excelente servicio"
    } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

    it("should create and return new rating", async () => {
    // Fake data
    const mockRating = {
      id: "rating1",
        idStore: "storeImaginario1",
        idOrder: "orderImaginario1",
        idProfile: "profileImaginario1",
        stars: 5,
        comment: "Excelente servicio"
    };
    Rating.create.mockResolvedValue(mockRating);
    Rating.countDocuments.mockResolvedValue(0);
    await create(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockRating);
    });

    //Retorna error 400 si los datos son inválidos
  it("should return 400 on invalid data", async () => {
    Rating.create.mockRejectedValue(new Error("Datos inválidos"));
    await create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Datos inválidos", detalle: "Datos inválidos" });
  });
});