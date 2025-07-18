const express = require("express");
const router = express.Router();

const {
  registrarCargo,
  eliminarCargo,
  listarCargos,
  editarCargo,
} = require("../controllers/CargoController");

const verifyToken = require("../middlewares/AuthMiddleware");

// Rutas protegidas
router.post("/cargo/registrar", verifyToken, registrarCargo);
router.get("/cargo/listar", verifyToken, listarCargos)
router.put("/cargo/editar/:id", verifyToken, editarCargo)
router.delete("/cargo/eliminar/:id", verifyToken, eliminarCargo);

module.exports = router;