const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');

router.get("/saludo", pagoController.saludo);

router.get("/", pagoController.obtenerPagos);

router.get("/:id", pagoController.obtenerPago);

router.post("/registrar", pagoController.insertar);

router.put("/actualizar/:id", pagoController.actualizar);

router.patch("/vincular-paypal/:id", pagoController.actualizarReferencia);

router.delete("/eliminar/:id", pagoController.eliminar);

module.exports = router;