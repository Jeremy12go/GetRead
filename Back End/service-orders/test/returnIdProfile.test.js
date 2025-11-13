//Código de prueba para la obtención de órdenes por el idProfile asociado, en base a OrderController.js

const { getByIdProfile } = require('../controllers/OrderController');
const Order = require('../models/Order'); // importa tu modelo

// Mock del modelo Order
jest.mock('../models/Order');
describe("getByIdProfile controller", () => {
  let req, res;
    beforeEach(() => {
      req = {
        params: {
          idProfile: "12345"
        }
      };
      res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };
    });

    it("should return orders for given idProfile", async () => {
      // Datos falsos
      const mockOrders = [
        { productList: [], idProfile: "12345", idStore: "store1", OrderDate: new Date(), totalPrice: 100 },
        { productList: [], idProfile: "12345", idStore: "store2", OrderDate: new Date(), totalPrice: 200 }
      ];
      Order.find.mockResolvedValue(mockOrders);

      await getByIdProfile(req, res);

      expect(Order.find).toHaveBeenCalledWith({ idProfile: "12345" });
      expect(res.json).toHaveBeenCalledWith(mockOrders);
    });

    it("should return 404 if no orders found", async () => {
        Order.find.mockResolvedValue([]);
        await getByIdProfile(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Orden no encontrada' });
    });

    it("should return 500 on error", async () => {
      Order.find.mockImplementation(() => { throw new Error("DB error"); });
        await getByIdProfile(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error al obtener Ordenes', detalle: "DB error" });
    });
});