// Código de prueba para la obtención de un libro por ID en base a BookController.js
const { getById } = require('../controllers/BookController');
const Book = require('../models/Book'); // importa tu modelo

// Mock del modelo Book
jest.mock('../models/Book');
describe("getById controller", () => {
  let req, res;
    beforeEach(() => {
    req = { params: { _id: "bookImaginario1" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

    it("should return book when found", async () => {
    // Fake data
    const mockBook = {
      id: "bookImaginario1",
        title: "Libro Imaginario",
        author: "Autor Imaginario",
        idStore: "storeImaginario1"
    };
    Book.findOne.mockResolvedValue(mockBook);
    await getById(req, res);
    expect(res.json).toHaveBeenCalledWith(mockBook);
    });

    it("should return 404 when book not found", async () => {
    Book.findOne.mockResolvedValue(null);
    await getById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Libro no encontrado" });
    });

    it("should return 500 on database error", async () => {
    Book.findOne.mockRejectedValue(new Error("DB Error"));
    await getById(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Error al obtener libro", detalle: "DB Error" });
  });
});