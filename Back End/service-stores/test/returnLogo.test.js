const StoreController = require("../controllers/StoreController");

// Mock del modelo
const mockFindById = jest.fn();

jest.mock("mongoose", () => {
  const mockSchema = function () { return {}; };
  mockSchema.Types = { ObjectId: jest.fn() };

  return {
    Schema: mockSchema,
    model: jest.fn()
  };
});

describe("StoreController.getLogo", () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      params: { id: "STORE123" },
      app: {
        locals: {
          supportDB: {
            model: jest.fn(() => ({
              findById: mockFindById
            }))
          }
        }
      }
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      contentType: jest.fn(),
      send: jest.fn(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  test("Debe retornar el logo correctamente", async () => {
    mockFindById.mockResolvedValue({
      _id: "STORE123",
      logo: {
        contentType: "image/png",
        data: Buffer.from("1234")
      }
    });

    await StoreController.getLogo(mockReq, mockRes);

    expect(mockFindById).toHaveBeenCalledWith("STORE123");
    expect(mockRes.contentType).toHaveBeenCalledWith("image/png");
    expect(mockRes.send).toHaveBeenCalledWith(Buffer.from("1234"));
  });

  test("Debe retornar 404 si la tienda no existe", async () => {
    mockFindById.mockResolvedValue(null);

    await StoreController.getLogo(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.send).toHaveBeenCalledWith("Logo no encontrado");
  });

  test("Debe retornar 404 si la tienda no tiene logo", async () => {
    mockFindById.mockResolvedValue({
      _id: "STORE123",
      logo: null
    });

    await StoreController.getLogo(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.send).toHaveBeenCalledWith("Logo no encontrado");
  });

  test("Debe retornar 500 si ocurre un error interno", async () => {
    mockFindById.mockRejectedValue(new Error("DB error"));

    await StoreController.getLogo(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Error al obtener logo",
      detalle: "DB error"
    });
  });
});