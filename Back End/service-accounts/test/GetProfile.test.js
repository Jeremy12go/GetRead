//Código de prueba para obtener el perfil por medio del id en base a los ProfileBuyerController.js y ProfileSellerController.js
const { getById } = require('../controllers/ProfileSellerController');
const Profile = require('../models/ProfileSeller');

// Mock del modelo Profile
jest.mock('../models/ProfileSeller');
describe("getById controller", () => {
  let req, res;
  beforeEach(() => {
    req = {
      params: {
        _id: "profileId123"
        }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it("should successfully get profile by id", async () => {
    const mockProfile = { id: req.params._id, name: "Test Seller" };
    Profile.findOne.mockResolvedValue(mockProfile);
    await getById(req, res);
    expect(res.json).toHaveBeenCalledWith(mockProfile);
    });

    it("should return 404 if profile not found", async () => {
    Profile.findOne.mockResolvedValue(null);
    await getById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Perfil no encontrado" });
  });

  it("should return 500 on server error", async () => {
    Profile.findOne.mockImplementation(() => { throw new Error("Server error"); });
    await getById(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Error al obtener perfil", detalle: "Server error" });
  });
});