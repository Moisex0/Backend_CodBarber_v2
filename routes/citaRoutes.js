const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citaController');

const { verificarToken } = require('../middlewares/authMiddleware');

router.get("/saludo", citaController.saludo);

router.get("/todas", verificarToken, citaController.obtenerCitas);

router.get("/buscar/:id", verificarToken, citaController.obtenerCita);

router.post("/insertar", verificarToken, citaController.insertar);

router.put("/actualizar/:id", verificarToken, citaController.actualizar);

router.patch("/estado/:id", verificarToken, citaController.actualizarEstado);

router.delete("/eliminar/:id", verificarToken, citaController.eliminar);

module.exports = router;