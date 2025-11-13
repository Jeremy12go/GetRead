//Código de prueba para creación de una cuenta en base a AccountController.js

const { create } = require('../controllers/AccountController');
const Account = require('../models/Account');
const Profile = require('../models/ProfileBuyer');

// Mock de los modelos Account y Profile
jest.mock('../models/Account');
jest.mock('../models/ProfileBuyer');

describe("create controller", () => {
  let req, res;
  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
        password: "securepassword",
        name: "Test User",
        phoneNumber: "1234567890",
        address: "123 Test St"
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it("should create account and profile", async () => {
    const mockProfile = { _id: "profileId123" };
    const mockAccount = { email: req.body.email, password: req.body.password, profile: mockProfile._id };
    Profile.create.mockResolvedValue(mockProfile);
    Account.create.mockResolvedValue(mockAccount);
    await create(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockAccount);
  });

  it("should return 400 if data is invalid", async () => {
    Profile.create.mockImplementation(() => { throw new Error("Invalid data"); });
    await create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Datos inválidos" , detalle: "Invalid data" });
  });
});