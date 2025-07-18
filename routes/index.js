const express = require("express");
const router = express.Router();

const userRoutes = require("./UserRoutes");
const contactanosRoutes = require("./ContactanosRoutes");
const cargoRoutes = require("./CargoRoutes");
const personalRoutes = require("./PersonalRoutes");
const unidadMedidaRoutes = require("./UnidadMedidaRoutes");
const productoRoutes = require("./ProductoRoutes");
const matriculaRoutes = require("./MatriculaRoutes");

// Rutas hijas
router.use(userRoutes);
router.use(contactanosRoutes);
router.use(cargoRoutes);
router.use(personalRoutes);
router.use(unidadMedidaRoutes);
router.use(productoRoutes);
router.use(matriculaRoutes);

module.exports = router;