// test/returnBookByID.test.js
jest.mock("../models/Book");
jest.mock("axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
}));

const Book = require("../models/Book");
const BookController = require("../controllers/BookController");

describe("BookController.getById", () => {

  let mockReq;
  let mockRes;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = { params: { id: "BOOK123" } };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("Debe retornar un libro correctamente", async () => {
    const fakeBook = { _id: "BOOK123", name: "Harry Potter" };

    Book.findById.mockResolvedValue(fakeBook);

    await BookController.getById(mockReq, mockRes);

    expect(Book.findById).toHaveBeenCalledWith("BOOK123");
    expect(mockRes.json).toHaveBeenCalledWith(fakeBook);
  });

  test("Debe retornar 404 si el libro no existe", async () => {
    Book.findById.mockResolvedValue(null);

    await BookController.getById(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Libro no encontrado",
    });
  });

  test("Debe retornar 500 si ocurre un error interno", async () => {
    Book.findById.mockRejectedValue(new Error("DB error"));

    await BookController.getById(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Error al obtener libro",
      detalle: "DB error",
    });
  });
});