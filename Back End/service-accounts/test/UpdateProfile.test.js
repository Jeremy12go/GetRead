//Código de prueba para actualizar un perfil en base a ProfileBuyerController.js
const { update } = require('../controllers/ProfileBuyerController');
const Profile = require('../models/ProfileBuyer');

// Mock del modelo Profile
jest.mock('../models/ProfileBuyer');
describe("update controller", () => {
  let req, res;
  beforeEach(() => {
    req = {
      params: {
        _id: "profileId123",
        name: "Mish Name"
      },
      body: {
        name: "Updated Name",
        phoneNumber: "0987654321",
        address: "456 Updated St"
        }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it("should successfully update profile", async () => {
    const mockUpdatedProfile = { id: req.params._id, ...req.body };
    Profile.findOneAndUpdate.mockResolvedValue(mockUpdatedProfile);
    await update(req, res);
    expect(res.json).toHaveBeenCalledWith(mockUpdatedProfile);
  });

  it("should return 404 if profile not found", async () => {
    Profile.findOneAndUpdate.mockResolvedValue(null);
    await update(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: `Perfil ${req.params.name} no encontrado` });
  });

  it("should return 400 on server error", async () => {
    Profile.findOneAndUpdate.mockImplementation(() => { throw new Error("Server error"); });
    await update(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Error al actualizar profile", detalle: "Server error" });
  });
});