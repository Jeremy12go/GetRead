const express = require('express');
const router = express.Router();
const controller = require('../controllers/OrderController');

router.get('/:idProfile', controller.getByIdProfile); //no necesaria puesto orders en perfil se guardan como id
router.post('/', controller.create);
router.post('/byIds', controller.getByIds); //faltaba para encontrar order por id propia
router.put('/:id', controller.update); // Cambia el estado y/o agrega productos
router.delete('/:id', controller.remove);

module.exports = router;
