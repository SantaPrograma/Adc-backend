const express = require("express");
const router = express.Router();

const {
  registrarPersonal,
  listarPersonal,
  editarPersonal,
  cambiarEstado,
  eliminarPersonal,
  obtenerPersonalPorId
} = require("../controllers/PersonalController");

const verifyToken = require("../middlewares/AuthMiddleware");

// Rutas protegidas
router.post("/personal/registrar", verifyToken, registrarPersonal);
router.get("/personal/listar", verifyToken, listarPersonal);
router.get("/personal/:id", verifyToken, obtenerPersonalPorId);
router.put("/personal/editar/:id", verifyToken, editarPersonal);
router.patch("/personal/alternar/:id", verifyToken, cambiarEstado);
router.delete("/personal/eliminar/:id", verifyToken, eliminarPersonal);

module.exports = router;
