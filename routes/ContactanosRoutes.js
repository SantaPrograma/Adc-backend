const express = require("express");
const router = express.Router();

const {
  registrarMensaje,
  listarMensajes,
  alternarEstadoMensaje,
  eliminarFisico,
} = require("../controllers/ContactanosController");

const verifyToken = require("../middlewares/AuthMiddleware");

// Ruta pública
router.post("/contactanos/registrar", registrarMensaje);

// Rutas protegidas
router.get("/contactanos/listar", verifyToken, listarMensajes);
router.patch("/contactanos/alternar/:id", verifyToken, alternarEstadoMensaje);
router.delete("/contactanos/eliminar/:id", verifyToken, eliminarFisico);

module.exports = router;
