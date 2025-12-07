const StoreController = require("../controllers/StoreController");

// --- MOCK DEL MODELO --- //
const mockStoreModel = {
  findByIdAndUpdate: jest.fn()
};

// --- MOCK DE req y res --- //
const createMockReqRes = () => {
  const req = {
    params: { id: "STORE123" },
    body: { ratingId: "RATING789" },
    app: {
      locals: {
        supportDB: {
          model: jest.fn(() => mockStoreModel)
        }
      }
    }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  return { req, res };
};

// Limpia mocks antes de cada test
beforeEach(() => {
  jest.clearAllMocks();
});

describe("StoreController.addRating", () => {

  test("Debe agregar un rating correctamente", async () => {
    const { req, res } = createMockReqRes();

    const updatedStore = { _id: "STORE123", ratings: ["RATING789"] };
    mockStoreModel.findByIdAndUpdate.mockResolvedValue(updatedStore);

    await StoreController.addRating(req, res);

    expect(req.app.locals.supportDB.model).toHaveBeenCalledWith(
      "profileseller",
      expect.any(Object)
    );

    expect(mockStoreModel.findByIdAndUpdate).toHaveBeenCalledWith(
      "STORE123",
      { $push: { ratings: "RATING789" } },
      { new: true }
    );

    expect(res.json).toHaveBeenCalledWith(updatedStore);
  });

  test("Debe retornar 404 si la tienda no existe", async () => {
    const { req, res } = createMockReqRes();

    mockStoreModel.findByIdAndUpdate.mockResolvedValue(null);

    await StoreController.addRating(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Tienda no encontrada"
    });
  });

  test("Debe retornar 400 si ocurre un error de validación", async () => {
    const { req, res } = createMockReqRes();

    mockStoreModel.findByIdAndUpdate.mockRejectedValue(new Error("Validation error"));

    await StoreController.addRating(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Error al agregar rating",
      detalle: "Validation error"
    });
  });

  test("Debe retornar 500 si ocurre un error inesperado", async () => {
    const { req, res } = createMockReqRes();
    mockStoreModel.findByIdAndUpdate.mockRejectedValue(new Error("Unexpected DB error"));
    await StoreController.addRating(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Error al agregar rating",
      detalle: "Unexpected DB error"
    });
  });
});