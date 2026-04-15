const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');

router.get("/saludo", usuarioController.saludo);

router.get("/", verificarToken, esAdmin, usuarioController.obtenerUsuarios);

router.get("/:id", verificarToken, usuarioController.obtenerUsuario);

router.post("/registrar", usuarioController.insertar);

router.put("/actualizar/:id", verificarToken, usuarioController.actualizar);

router.patch("/cambiar-rol/:id", verificarToken, esAdmin, usuarioController.actualizarRol);

router.delete("/eliminar/:id", verificarToken, usuarioController.eliminar);

router.delete("/admin/reset-database", verificarToken, esAdmin, usuarioController.resetearBD);

module.exports = router;