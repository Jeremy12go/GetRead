const express = require('express');
const router = express.Router();
const controller = require('../controllers/OrderController');

// Obtener una orden por su ID
router.get('/:OrderId', controller.getOrderById);

// Obtener una sub orden por su ID
router.get('/suborder/:subOrderId', controller.getSubOrderById); 

// Obtener ordenes de un comprador
router.get('/buyer/:buyerId', controller.getByBuyer);

// Crear orden en base al carrito
router.post('/', controller.createOrderFromCart);

router.put('/suborder/:subOrderId/qualify', controller.qualifySubOrder);

module.exports = router;
