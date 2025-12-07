const BookController = require("../controllers/BookController");
const Book = require("../models/Book");

// Mock del modelo
jest.mock("../models/Book");

describe("BookController.getImage", () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = { params: { id: "BOOK123" } };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };

    jest.clearAllMocks();
  });

  test("Debe retornar la imagen correctamente", async () => {
    Book.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: "BOOK123",
        image: "path/test.jpg"
      })
    });

    await BookController.getImage(mockReq, mockRes);

    expect(Book.findById).toHaveBeenCalledWith("BOOK123");
    expect(mockRes.json).toHaveBeenCalledWith({ cover: undefined }); 
  });

  test("Debe retornar 404 si el libro no tiene imagen", async () => {
    Book.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: "BOOK123",
        image: null
      })
    });

    await BookController.getImage(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.send).toHaveBeenCalledWith("Imagen no encontrada");
  });

  test("Debe retornar 404 si el libro no existe", async () => {
    Book.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    });

    await BookController.getImage(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.send).toHaveBeenCalledWith("Imagen no encontrada");
  });

  test("Debe retornar 500 si ocurre un error interno", async () => {
    Book.findById.mockImplementation(() => ({
      select: jest.fn().mockRejectedValue(new Error("DB error"))
    }));

    await BookController.getImage(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Error al obtener imagen",
      detalle: "DB error"
    });
  });
});