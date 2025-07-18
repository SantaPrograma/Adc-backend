const express = require("express");
const router = express.Router();

const {
  registrarProducto,
  listarProductos,
  obtenerProductoPorId,
  editarProducto,
  eliminarProducto,
  actualizarInventario
} = require("../controllers/ProductoController");

const verifyToken = require("../middlewares/AuthMiddleware");

// Rutas protegidas
router.post("/producto/registrar", verifyToken, registrarProducto);
router.get("/producto/listar", verifyToken, listarProductos);
router.get("/producto/:id", verifyToken, obtenerProductoPorId);
router.put("/producto/editar/:id", verifyToken, editarProducto);
router.put("/producto/inventario/:id", verifyToken, actualizarInventario);
router.delete("/producto/eliminar/:id", verifyToken, eliminarProducto);

module.exports = router;
