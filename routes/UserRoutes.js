const express = require("express");
const router = express.Router();

const {
  login,
  registrarUsuario,
  listarUsuarios,
  eliminarUsuario,
  obtenerPerfil,
} = require("../controllers/UserController");

const verifyToken = require("../middlewares/AuthMiddleware");

// Ruta pública
router.post("/login", login);
router.post("/usuario/registrar", registrarUsuario);


// Rutas protegidas
router.post("/usuario/registrar-admin", verifyToken, (req, res, next) => {
  req.body.rol = "admin";
  next();
}, registrarUsuario);
router.get("/usuario/listar", verifyToken, listarUsuarios);
router.delete("/usuario/eliminar/:id", verifyToken, eliminarUsuario);
router.get("/usuario/perfil", verifyToken, obtenerPerfil);

module.exports = router;