jest.mock("mongoose", () => {
  const FakeSchema = function () {};
  FakeSchema.Types = { ObjectId: jest.fn() };

  return { Schema: FakeSchema, Types: { ObjectId: jest.fn() } };
});

const StoreController = require("../controllers/StoreController");

// Mock dinámico del modelo
const mockFindById = jest.fn();

jest.mock("../controllers/StoreController", () => ({
  ...jest.requireActual("../controllers/StoreController"),
}));

describe("StoreController.getById", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: "SELLER123" },
      app: {
        locals: {
          supportDB: {
            model: jest.fn(() => ({
              findById: mockFindById,
            })),
          },
        },
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockFindById.mockReset();
  });

  test("Debe retornar el vendedor correctamente por ID", async () => {
    const fakeStore = { _id: "SELLER123", name: "Store Test" };

    mockFindById.mockResolvedValue(fakeStore);

    await StoreController.getById(req, res);

    expect(mockFindById).toHaveBeenCalledWith("SELLER123");
    expect(res.json).toHaveBeenCalledWith(fakeStore);
  });

  test("Debe retornar 404 si el vendedor no existe", async () => {
    mockFindById.mockResolvedValue(null);

    await StoreController.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Vendedor no encontrado",
    });
  });

  test("Debe retornar 500 si ocurre un error interno", async () => {
    mockFindById.mockRejectedValue(new Error("DB error"));

    await StoreController.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Error al obtener el vendedor",
      detalle: "DB error",
    });
  });
});