// =========================
//  MOCK COMPLETO DE MONGOOSE
// =========================

// 👉 Nombre permitido por Jest (comienza con "mock")
const mockObjectId = jest.fn(id => id);

jest.mock('mongoose', () => {
  const Schema = function () {};

  Schema.Types = { ObjectId: mockObjectId };

  return {
    Schema,
    model: jest.fn(),
    Types: { ObjectId: mockObjectId },
  };
});

// =========================
//  MOCK DEL MODELO RATING
// =========================
jest.mock('../models/Rating', () => ({
  find: jest.fn(),
}));

// =========================
//  IMPORTS (DESPUÉS DE MOCKS)
// =========================
const RatingController = require('../controllers/RatingController');
const Rating = require('../models/Rating');
const mongoose = require('mongoose');

// =========================
//   TESTS
// =========================
describe("RatingController.getRatingsBySellerId", () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = { params: { idSeller: "SELLER123" } };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  // -----------------------------------------
  test("Debe retornar la lista de ratings cuando existen", async () => {
    const fakeRatings = [
      { idSeller: "SELLER123", stars: 5 },
      { idSeller: "SELLER123", stars: 4 },
    ];

    Rating.find.mockResolvedValue(fakeRatings);

    await RatingController.getRatingsBySellerId(mockReq, mockRes);

    const expectedObjectId = mockObjectId.mock.results[0].value;

    expect(Rating.find).toHaveBeenCalledWith({ idSeller: expectedObjectId });
    expect(mockRes.json).toHaveBeenCalledWith(fakeRatings);
  });

  // -----------------------------------------
  test("Debe retornar 404 cuando no existan ratings", async () => {
    Rating.find.mockResolvedValue([]);

    await RatingController.getRatingsBySellerId(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: `Ratings de vendedor SELLER123 no encontrados`,
    });
  });

  // -----------------------------------------
  test("Debe retornar 500 si ocurre un error", async () => {
    Rating.find.mockRejectedValue(new Error("DB error"));

    await RatingController.getRatingsBySellerId(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Error al obtener Ratings",
      detalle: "DB error",
    });
  });

});