const AccountController = require("../controllers/AccountController");
const Account = require("../models/Account");
const Profilebuyer = require("../models/ProfileBuyer");
const Profileseller = require("../models/ProfileSeller");
const jwt = require("jsonwebtoken");

jest.mock("../models/Account");
jest.mock("../models/ProfileBuyer");
jest.mock("../models/ProfileSeller");
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "fake-jwt-token")
}), { virtual: true });

describe("AccountController.login", () => {

  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = { body: { email: "test@email.com", password: "1234" } };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  // -------------------------------
  // 1) LOGIN EXITOSO (PROFILE BUYER)
  // -------------------------------
  test("Debe hacer login correctamente (buyer)", async () => {

    const fakeAccount = {
      _id: "ACC123",
      email: "test@email.com",
      password: "1234",
      profilebuyer: "BUY123",
      profileseller: null,
      billetera: null,
      save: jest.fn().mockResolvedValue(true)
    };

    const fakeProfileBuyer = {
      _id: "BUY123",
      name: "Juan",
      phoneNumber: "11111",
      address: "Calle 123",
      orders: [],
      cart: [],
      books: []
    };

    Account.findOne.mockResolvedValue(fakeAccount);
    Profilebuyer.findById.mockResolvedValue(fakeProfileBuyer);

    await AccountController.login(mockReq, mockRes);

    expect(Account.findOne).toHaveBeenCalledWith({ email: "test@email.com" });

    expect(fakeAccount.save).toHaveBeenCalled(); // billetera creada

    expect(mockRes.json).toHaveBeenCalledWith({
      account: expect.objectContaining({
        _id: "ACC123",
        email: "test@email.com",
        billetera: { saldo: 0 },
        profilebuyer: "BUY123",
        profileseller: null
      }),
      profile: expect.objectContaining({
        _id: "BUY123",
        name: "Juan"
      })
    });
  });

  // -------------------------------
  // 2) EMAIL NO EXISTE
  // -------------------------------
  test("Debe retornar 404 si el email no existe", async () => {
    Account.findOne.mockResolvedValue(null);

    await AccountController.login(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Perfil no encontrado para ese correo"
    });
  });

  // -------------------------------
  // 3) PASSWORD INCORRECTA
  // -------------------------------
  test("Debe retornar 401 si la contraseña es incorrecta", async () => {
    Account.findOne.mockResolvedValue({ password: "otraClave" });

    await AccountController.login(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Credenciales inválidas"
    });
  });

  // -------------------------------
  // 4) PERFIL ASOCIADO NO EXISTE
  // -------------------------------
  test("Debe retornar 404 si el perfil asociado no existe", async () => {
    const fakeAccount = {
      password: "1234",
      profilebuyer: "BUY123",
      profileseller: null,
      billetera: { saldo: 20 },
      save: jest.fn()
    };

    Account.findOne.mockResolvedValue(fakeAccount);
    Profilebuyer.findById.mockResolvedValue(null);

    await AccountController.login(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Perfil asociado no encontrado"
    });
  });

  // -------------------------------
  // 5) ERROR INTERNO
  // -------------------------------
  test("Debe retornar 500 si ocurre un error interno", async () => {
    Account.findOne.mockRejectedValue(new Error("DB error"));

    await AccountController.login(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Error al obtener perfil",
      detalle: "DB error"
    });
  });
});