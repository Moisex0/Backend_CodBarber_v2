const express = require('express');
const router = express.Router();
const servicioController = require('../controllers/servicioController');

router.get("/saludo", servicioController.saludo);

router.get("/todos", servicioController.obtenerServicios);

router.get("/buscar/:id", servicioController.obtenerServicio);

router.post("/insertar", servicioController.insertar);

router.put("/actualizar/:id", servicioController.actualizar);

router.patch("/actualizar-precio/:id", servicioController.actualizarPrecio);

router.delete("/eliminar/:id", servicioController.eliminar);

router.get("/sucursal/:id", servicioController.obtenerPorSucursal);

module.exports = router;