const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

router.get("/saludo", clienteController.saludo);

router.get("/", clienteController.obtenerClientes);

router.get("/:id", clienteController.obtenerCliente);

router.post("/insertar", clienteController.insertar);

router.put("/actualizar/:id", clienteController.actualizar);

router.patch("/actualizar-correo/:id", clienteController.actualizarCorreo);

router.delete("/eliminar/:id", clienteController.eliminar);

module.exports = router;