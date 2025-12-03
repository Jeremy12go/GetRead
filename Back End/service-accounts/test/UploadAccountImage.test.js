// Limpia cualquier mock anterior
jest.resetModules();
jest.clearAllMocks();

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "fake-jwt-token")
}), { virtual: true });


jest.mock("mongoose", () => {
  const actual = jest.requireActual("mongoose");

  return {
    ...actual,
    Types: {
      ObjectId: jest.fn(id => id)  // devolvemos el ID directamente
    },
    isValidObjectId: jest.fn(() => true),
  };
});

// ==========================
// MOCK DE MODELOS
// ==========================
jest.mock("../models/Account", () => ({
  findById: jest.fn(),
}));

jest.mock("../models/ProfileBuyer", () => ({}));
jest.mock("../models/ProfileSeller", () => ({}));

// ==========================
// IMPORTS DEL CONTROLADOR
// ==========================
const AccountController = require("../controllers/AccountController");
const Account = require("../models/Account");

describe("AccountController.uploadAccountImage", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---------------------------
  // Caso OK: imagen subida
  // ---------------------------
  test("Debe subir una imagen correctamente", async () => {
    const fakeAccount = {
      _id: "ACC123",
      email: "test@email.com",
      profileImage: null,
      save: jest.fn().mockResolvedValue(true),
    };

    Account.findById.mockResolvedValue(fakeAccount);

    const mockReq = {
      params: { id: "ACC123" },
      file: { path: "/uploads/testfile.png" },
    };

    const mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await AccountController.uploadAccountImage(mockReq, mockRes);

    // Asegura que findById recibe el ID correcto
    expect(Account.findById).toHaveBeenCalledWith("ACC123");

    // Se debe guardar el perfil
    expect(fakeAccount.save).toHaveBeenCalled();

    // Respuesta correcta
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Imagen subida correctamente",
      profileImage: "/uploads/testfile.png",
      account: {
        _id: "ACC123",
        email: fakeAccount.email,
        profileImage: "/uploads/testfile.png",
      },
    });
  });

  // ---------------------------
  // Caso 400: no se envía archivo
  // ---------------------------
  test("Debe retornar 400 si no se envía archivo", async () => {
    const mockReq = {
      params: { id: "ACC123" },
      file: null
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await AccountController.uploadAccountImage(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "No se proporcionó ninguna imagen",
    });
  });

  // ---------------------------
  // Caso 404: cuenta no existe
  // ---------------------------
  test("Debe retornar 404 si la cuenta no existe", async () => {
    Account.findById.mockResolvedValue(null);

    const mockReq = {
      params: { id: "ACC123" },
      file: { path: "/img.png" }
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await AccountController.uploadAccountImage(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Cuenta no encontrada",
    });
  });

  // ---------------------------
  // Caso 500: error interno
  // ---------------------------
  test("Debe retornar 500 si ocurre un error interno", async () => {
    Account.findById.mockRejectedValue(new Error("DB error"));

    const mockReq = {
      params: { id: "ACC123" },
      file: { path: "/img.png" }
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await AccountController.uploadAccountImage(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Error al subir imagen",
      detalle: "DB error",
    });
  });

});