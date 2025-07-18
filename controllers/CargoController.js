const { Op } = require('sequelize');
const sequelize = require("../config/sequelize");
const Cargo = sequelize.models.Cargo;

// Registrar cargo
const registrarCargo = async (req, res) => {
  const { nombre } = req.body;
  if (!nombre) {
    return res.status(400).json({ message: "El nombre del cargo es obligatorio." });
  }

  try {
    const existente = await Cargo.findOne({ where: { nombre } });
    if (existente) {
      return res.status(400).json({ message: "El cargo ya existe." });
    }

    const nuevo = await Cargo.create({ nombre });
    return res.status(201).json({
      message: "Cargo registrado con éxito.",
      datos: {
        id: nuevo.id,
        nombre: nuevo.nombre,
      },
    });
  } catch (error) {
    console.error("Error al registrar cargo:", error);
    return res.status(500).json({ message: "Error al registrar el cargo." });
  }
};

// Listar cargos
const listarCargos = async (req, res) => {
  try {
    const cargos = await Cargo.findAll({
      order: [["nombre", "ASC"]],
      attributes: ["id", "nombre"],
    });
    return res.json({ cargos });
  } catch (error) {
    console.error("Error al listar cargos:", error);
    return res.status(500).json({ message: "Error al obtener los cargos." });
  }
};

// Editar Cargo
const editarCargo = async (req, res) => {
  try {
    const id = req.params.id;
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: "El nombre es obligatorio." });
    }

    const existe = await Cargo.findOne({
      where: {
        nombre,
        id: { [Op.ne]: id }
      }
    });

    if (existe) {
      return res.status(409).json({ message: "Ya existe un cargo con ese nombre." });
    }

    const cargo = await Cargo.findByPk(id);
    if (!cargo) {
      return res.status(404).json({ message: "Cargo no encontrado." });
    }

    cargo.nombre = nombre;
    await cargo.save();

    res.json({ message: "Cargo actualizado correctamente." });
  } catch (error) {
    console.error("Error al editar cargo:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

// Eliminar cargo
const eliminarCargo = async (req, res) => {
  const { id } = req.params;
  try {
    const eliminado = await Cargo.destroy({ where: { id } });
    if (!eliminado) {
      return res.status(404).json({ message: "Cargo no encontrado." });
    }
    return res.json({ message: "Cargo eliminado correctamente." });
  } catch (error) {
    console.error("Error al eliminar cargo:", error);
    return res.status(500).json({ message: "Error al eliminar el cargo." });
  }
};

module.exports = {
  registrarCargo,
  editarCargo,
  listarCargos,
  eliminarCargo,
};
