const express = require("express");
const router = express.Router();

const { 
  registrarMatricula,
  buscarDatosRenovacion,
  listarMatriculas,
  obtenerDetalleMatricula,
  alternarEstadoMatricula
} = require("../controllers/MatriculaController");

const verifyToken = require("../middlewares/AuthMiddleware");
const upload = require("../middlewares/uploads");

// Rutas protegidas
router.post("/matricula/registrar", verifyToken,
  upload.fields([
    { name: "copiaDni", maxCount: 1 },
    { name: "partidaNacimiento", maxCount: 1 }
  ]),
  registrarMatricula
);
router.get('/matricula/buscar/:numeroDocumento', verifyToken, buscarDatosRenovacion);
router.get("/matricula/listar", verifyToken, listarMatriculas);
router.get("/matricula/:id", verifyToken, obtenerDetalleMatricula);
router.put("/matricula/estado/:id", verifyToken, alternarEstadoMatricula);

module.exports = router;
