const express = require('express');
const router = express.Router();
const barberiaController = require('../controllers/barberiaController');

router.get("/saludo", barberiaController.saludo);

router.get("/", barberiaController.obtenerBarberias); 

router.get("/:id", barberiaController.obtenerBarberia); 

router.post("/insertar", barberiaController.insertar);

router.put("/actualizar/:id", barberiaController.actualizar);

router.patch("/actualizar/:id", barberiaController.actualizarDireccion);

router.delete("/eliminar/:id", barberiaController.eliminar);

module.exports = router;