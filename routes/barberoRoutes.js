const express = require('express');
const router = express.Router();
const barberoController = require('../controllers/barberoController');

router.get("/saludo", barberoController.saludo); 

router.get("/", barberoController.obtenerBarberos); 

router.get("/:id", barberoController.obtenerBarbero); 

router.post("/insertar", barberoController.insertar);

router.put("/actualizar/:id", barberoController.actualizar);

router.delete("/eliminar/:id", barberoController.eliminar);

router.get("/sucursal/:id", barberoController.obtenerPorSucursal);

module.exports = router;