jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "fake-token")
}), { virtual: true });

jest.mock("../models/Account");
jest.mock("../models/ProfileBuyer");
jest.mock("../models/ProfileSeller");

const Account = require("../models/Account");
const Profilebuyer = require("../models/ProfileBuyer");
const Profileseller = require("../models/ProfileSeller");

const AccountController = require("../controllers/AccountController");

describe("AccountController.getAccount", () => {

  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = { params: { id: "ACC123" } };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  test("Debe retornar la cuenta y su perfil correctamente", async () => {
    const fakeAccount = {
      _id: "ACC123",
      email: "user@test.com",
      profilebuyer: "BUYER999",
      profileseller: null,
      profileImage: "img.png",
    };

    const fakeProfile = {
      _id: "BUYER999",
      name: "Pepe",
      phoneNumber: "12345",
      address: "Calle Falsa 123",
    };

    Account.findById.mockResolvedValue(fakeAccount);
    Profilebuyer.findById.mockResolvedValue(fakeProfile);
    Profileseller.findById.mockResolvedValue(null);

    await AccountController.getAccount(mockReq, mockRes);

    expect(Account.findById).toHaveBeenCalledWith("ACC123");
    expect(Profilebuyer.findById).toHaveBeenCalledWith("BUYER999");

    expect(mockRes.json).toHaveBeenCalledWith({
      account: {
        _id: fakeAccount._id,
        email: fakeAccount.email,
        profilebuyer: fakeAccount.profilebuyer,
        profileseller: fakeAccount.profileseller,
        profileImage: fakeAccount.profileImage
      },
      profile: {
        _id: fakeProfile._id,
        name: fakeProfile.name,
        phoneNumber: fakeProfile.phoneNumber,
        address: fakeProfile.address
      }
    });
  });

  test("Debe retornar 404 si la cuenta no existe", async () => {
    Account.findById.mockResolvedValue(null);

    await AccountController.getAccount(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Cuenta no encontrada"
    });
  });

  test("Debe retornar 404 si no se encuentra un perfil asociado", async () => {
    const fakeAccount = {
      _id: "ACC123",
      email: "user@test.com",
      profilebuyer: null,
      profileseller: null,
    };

    Account.findById.mockResolvedValue(fakeAccount);
    Profilebuyer.findById.mockResolvedValue(null);
    Profileseller.findById.mockResolvedValue(null);

    await AccountController.getAccount(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Perfil no encontrado"
    });
  });

  test("Debe retornar 500 si ocurre un error", async () => {
    Account.findById.mockRejectedValue(new Error("DB error"));

    await AccountController.getAccount(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Error al obtener perfil"
    });
  });

});