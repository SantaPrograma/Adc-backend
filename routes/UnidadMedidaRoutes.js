const express = require("express");
const router = express.Router();

const {
  registrarUnidadMedida,
  listarUnidadesMedida,
  editarUnidadMedida,
  eliminarUnidadMedida,
} = require("../controllers/UnidadMedidaController");

const verifyToken = require("../middlewares/AuthMiddleware");

// Rutas protegidas
router.post("/unidad-medida/registrar", verifyToken, registrarUnidadMedida);
router.get("/unidad-medida/listar", verifyToken, listarUnidadesMedida);
router.put("/unidad-medida/editar/:id", verifyToken, editarUnidadMedida);
router.delete("/unidad-medida/eliminar/:id", verifyToken, eliminarUnidadMedida);

module.exports = router;