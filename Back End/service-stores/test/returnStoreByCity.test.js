// test/returnStoreByCity.test.js

// ---- Mock de mongoose ----
jest.mock("mongoose", () => {
  const mockSchema = function () { return {}; };
  mockSchema.Types = { ObjectId: jest.fn() };

  return {
    Schema: mockSchema,
    model: jest.fn()
  };
});

// Importamos el controlador DESPUÉS de mockear mongoose
const StoreController = require("../controllers/StoreController");

// Mock del modelo dinámico con supportDB
const mockFind = jest.fn();

const mockSupportDB = {
  model: jest.fn(() => ({
    find: mockFind
  }))
};

describe("StoreController.getByCity", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      params: { city: "Santiago" },
      app: {
        locals: {
          supportDB: mockSupportDB
        }
      }
    };

    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  test("Debe retornar las tiendas de la ciudad correctamente", async () => {
    const fakeStores = [
      { _id: "1", name: "Librería Central", city: "Santiago" },
      { _id: "2", name: "BookStore Chile", city: "Santiago" }
    ];

    mockFind.mockResolvedValue(fakeStores);

    await StoreController.getByCity(req, res);

    expect(mockSupportDB.model).toHaveBeenCalledWith("profileseller", expect.any(Object));

    expect(mockFind).toHaveBeenCalledWith({
      city: { $regex: expect.any(RegExp) }
    });

    expect(res.json).toHaveBeenCalledWith(fakeStores);
  });

  test("Debe retornar 404 si no hay vendedores en esa ciudad", async () => {
    mockFind.mockResolvedValue([]);

    await StoreController.getByCity(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Vendedor no encontrado"
    });
  });

  test("Debe retornar 500 si ocurre un error interno", async () => {
    mockFind.mockRejectedValue(new Error("DB error"));

    await StoreController.getByCity(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Error al obtener el vendedor",
      detalle: "DB error"
    });
  });
});