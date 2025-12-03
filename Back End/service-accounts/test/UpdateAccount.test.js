jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "fake-jwt-token")
}), { virtual: true });

const AccountController = require("../controllers/AccountController");
const Account = require("../models/Account");
const ProfileBuyer = require("../models/ProfileBuyer");
const ProfileSeller = require("../models/ProfileSeller");

jest.mock("../models/Account");
jest.mock("../models/ProfileBuyer");
jest.mock("../models/ProfileSeller");

describe("AccountController.updateAccount", () => {

  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      params: { id: "ACC123" },
      body: {
        name: "Nuevo Nombre",
        phoneNumber: "555-999",
        address: "Nueva Dirección",
        password: "nuevaPass"
      }
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  test("Debe actualizar la cuenta y el perfil correctamente", async () => {

    // MOCK DE CUENTA EXISTENTE
    const fakeAccount = {
      _id: "ACC123",
      email: "test@mail.com",
      profilebuyer: "BUYER123",
      profileseller: null,
      password: "oldpass",
      save: jest.fn()
    };

    Account.findById.mockResolvedValue(fakeAccount);

    // MOCK DE PERFIL BUYER
    const fakeProfile = {
      _id: "BUYER123",
      name: "Original",
      phoneNumber: "111",
      address: "Original",
      save: jest.fn()
    };

    ProfileBuyer.findById.mockResolvedValue(fakeProfile);
    ProfileSeller.findById.mockResolvedValue(null);

    await AccountController.updateAccount(mockReq, mockRes);

    expect(fakeAccount.save).toHaveBeenCalled();
    expect(fakeProfile.save).toHaveBeenCalled();

    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Account y perfil actualizados correctamente",
      account: {
        _id: "ACC123",
        email: "test@mail.com",
        profilebuyer: "BUYER123",
        profileseller: null
      },
      profile: {
        _id: "BUYER123",
        name: "Nuevo Nombre",
        phoneNumber: "555-999",
        address: "Nueva Dirección"
      }
    });
  });

  test("Debe retornar 404 si la cuenta no existe", async () => {
    Account.findById.mockResolvedValue(null);

    await AccountController.updateAccount(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Cuenta no encontrada" });
  });

  test("Debe retornar 404 si el perfil no existe", async () => {
    const fakeAccount = {
      _id: "ACC123",
      email: "test",
      profilebuyer: "BUYER123",
      profileseller: null,
      save: jest.fn()
    };

    Account.findById.mockResolvedValue(fakeAccount);
    ProfileBuyer.findById.mockResolvedValue(null);
    ProfileSeller.findById.mockResolvedValue(null);

    await AccountController.updateAccount(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Perfil no encontrado" });
  });

  test("Debe retornar 500 si ocurre un error interno", async () => {
    Account.findById.mockRejectedValue(new Error("DB error"));

    await AccountController.updateAccount(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Error al actualizar perfil",
      detalle: "DB error"
    });
  });

});