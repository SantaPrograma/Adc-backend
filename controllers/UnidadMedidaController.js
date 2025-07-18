const { Op } = require("sequelize");
const sequelize = require("../config/sequelize");
const UnidadMedida = sequelize.models.UnidadMedida;

// Registrar unidad de medida
const registrarUnidadMedida = async (req, res) => {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ message: "El nombre de la unidad de medida es obligatorio." });
  }

  try {
    const existente = await UnidadMedida.findOne({ where: { nombre } });
    if (existente) {
      return res.status(400).json({ message: "La unidad de medida ya existe." });
    }

    const nueva = await UnidadMedida.create({ nombre });

    return res.status(201).json({
      message: "Unidad de medida registrada con éxito.",
      datos: {
        id: nueva.id,
        nombre: nueva.nombre,
      },
    });
  } catch (error) {
    console.error("Error al registrar unidad de medida:", error);
    return res.status(500).json({ message: "Error al registrar la unidad de medida." });
  }
};

// Listar unidades de medida
const listarUnidadesMedida = async (req, res) => {
  try {
    const unidades = await UnidadMedida.findAll({
      order: [["nombre", "ASC"]],
      attributes: ["id", "nombre"],
    });
    return res.json({ unidades });
  } catch (error) {
    console.error("Error al listar unidades de medida:", error);
    return res.status(500).json({ message: "Error al obtener las unidades de medida." });
  }
};

// Editar unidad de medida
const editarUnidadMedida = async (req, res) => {
  const id = req.params.id;
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ message: "El nombre es obligatorio." });
  }

  try {
    const existe = await UnidadMedida.findOne({
      where: {
        nombre,
        id: { [Op.ne]: id }
      }
    });

    if (existe) {
      return res.status(409).json({ message: "Ya existe una unidad con ese nombre." });
    }

    const unidad = await UnidadMedida.findByPk(id);
    if (!unidad) {
      return res.status(404).json({ message: "Unidad de medida no encontrada." });
    }

    unidad.nombre = nombre;
    await unidad.save();

    return res.json({ message: "Unidad de medida actualizada correctamente." });
  } catch (error) {
    console.error("Error al editar unidad de medida:", error);
    return res.status(500).json({ message: "Error al editar la unidad de medida." });
  }
};

// Eliminar unidad de medida
const eliminarUnidadMedida = async (req, res) => {
  const { id } = req.params;
  try {
    const eliminado = await UnidadMedida.destroy({ where: { id } });

    if (!eliminado) {
      return res.status(404).json({ message: "Unidad de medida no encontrada." });
    }

    return res.json({ message: "Unidad de medida eliminada correctamente." });
  } catch (error) {
    console.error("Error al eliminar unidad de medida:", error);
    return res.status(500).json({ message: "Error al eliminar la unidad de medida." });
  }
};

module.exports = {
  registrarUnidadMedida,
  listarUnidadesMedida,
  editarUnidadMedida,
  eliminarUnidadMedida,
};
