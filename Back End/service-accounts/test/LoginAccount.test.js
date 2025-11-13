const Account = require('../models/Account');
const { login } = require('../controllers/AccountController');

// Mock completo de Mongoose Model
jest.mock('../models/Account', () => ({
  findOne: jest.fn()
}));

// Mock de request / response
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json  = jest.fn().mockReturnValue(res);
  return res;
};

describe('AccountController.login', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Debe retornar 404 si no existe cuenta con ese correo', async () => {
    // Simula que no se encuentra usuario
    Account.findOne.mockReturnValue({
      populate: jest.fn().mockResolvedValue(null)
    });

    const req = { body: { email: 'test@test.cl', password: '1234' } };
    const res = mockResponse();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Perfil no encontrado para ese correo'
    });
  });

  test('Debe retornar 401 si la contraseña es incorrecta', async () => {
    const fakeAccount = {
      email: 'test@test.cl',
      password: 'correcto',
      profile: { name: 'User Test' }
    };

    Account.findOne.mockReturnValue({
      populate: jest.fn().mockResolvedValue(fakeAccount)
    });

    const req = { body: { email: 'test@test.cl', password: 'mala' } };
    const res = mockResponse();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Credenciales inválidas'
    });
  });

  test('Debe retornar el perfil cuando credenciales son correctas', async () => {
    const fakeAccount = {
      email: 'test@test.cl',
      password: '1234',
      profile: { id: 33, name: 'Usuario Demo' }
    };

    Account.findOne.mockReturnValue({
      populate: jest.fn().mockResolvedValue(fakeAccount)
    });

    const req = { body: { email: 'test@test.cl', password: '1234' } };
    const res = mockResponse();

    await login(req, res);

    expect(res.json).toHaveBeenCalledWith(fakeAccount.profile);
  });

  test('Debe retornar 500 si ocurre un error en el servidor', async () => {
    Account.findOne.mockReturnValue({
      populate: jest.fn().mockRejectedValue(new Error('DB error'))
    });

    const req = { body: { email: 'test@test.cl', password: '1234' } };
    const res = mockResponse();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error al obtener perfil',
      detalle: 'DB error'
    });
  });
});