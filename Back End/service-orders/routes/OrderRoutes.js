const express = require('express');
const router = express.Router();
const controller = require('../controllers/OrderController');
/*
router.get('/:idProfile', controller.getByIdProfile); //no necesaria puesto orders en perfil se guardan como id
router.post('/', controller.create);
router.post('/byIds', controller.getByIds); // Usado para el historial de pedidos.
router.put('/:id', controller.update); // Cambia el estado y/o agrega productos
router.delete('/:id', controller.remove);
*/
//aunque getByIds es un GET, al pasar un arraylist de ids puede
//resultar complejo para un GET, tonces es mejor usaro POST para recibir arrays grandes
router.post('/getByIds', controller.getByIds);
router.get('/:idProfile', controller.getByIdProfile); //no he tocado este asi que puede que este obsoleto
router.get('/buyer/:buyerId', controller.getByBuyer);
router.post('/', controller.create);
router.post('/:buyerId/from-cart', controller.createOrderFromCart);
//PATCH se usa para modificar parcialmente algo, tipo en el caso de la orden
//se puede agregar un producto mas a la lista de productos
router.patch('/:id', controller.update);
router.delete('/:id', controller.remove);
module.exports = router;
