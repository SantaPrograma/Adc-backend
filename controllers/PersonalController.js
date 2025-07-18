const sequelize = require("../config/sequelize");
const Personal = sequelize.models.Personal;
const Cargo = sequelize.models.Cargo;

// Registrar nuevo personal
const registrarPersonal = async (req, res) => {
  const { nombres, apellidos, sexo, dni, telefono, email, direccion, cargo_id } = req.body;
  if (!nombres || !apellidos || !sexo || !dni || !telefono || !email || !direccion || !cargo_id) {
    return res.status(400).json({ message: "Todos los campos son obligatorios." });
  }

  try {
    const existente = await Personal.findOne({ where: { dni } });
    if (existente) {
      return res
        .status(400)
        .json({ message: "Ya existe un personal con ese DNI." });
    }

    const nuevo = await Personal.create({
      nombres,
      apellidos,
      sexo,
      dni,
      telefono,
      email,
      direccion,
      cargo_id
    });

    return res.status(201).json({
      message: "Personal registrado con éxito.",
      datos: {
        id: nuevo.id,
        nombres: nuevo.nombres,
        apellidos: nuevo.apellidos,
        sexo: nuevo.sexo,
        dni: nuevo.dni,
        telefono: nuevo.telefono,
        email: nuevo.email,
        direccion: nuevo.direccion,
        cargo_id: nuevo.cargo_id,
        estado: nuevo.estado,
        fecha_registro: nuevo.fecha_registro
      }
    });
  } catch (error) {
    console.error("Error al registrar personal:", error);
    return res
      .status(500)
      .json({ message: "Error al registrar el personal." });
  }
};

// Listar personal con paginación de 10
const listarPersonal = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const size = 10;
  const offset = (page - 1) * size;

  try {
    const { rows, count } = await Personal.findAndCountAll({
      order: [["id", "ASC"]],
      limit: size,
      offset,
      attributes: [
        "id",
        "nombres",
        "apellidos",
        "sexo",
        "dni",
        "telefono",
        "email",
        "direccion",
        "cargo_id",
        "estado",
        "fecha_registro"
      ],
      include: [
        {
          model: Cargo,
          as: "cargo",
          attributes: ["id", "nombre"]
        }
      ]
    });

    return res.json({
      totalItems: count,
      totalPages: Math.ceil(count / size),
      currentPage: page,
      personal: rows
    });
  } catch (error) {
    console.error("Error al listar personal:", error);
    return res
      .status(500)
      .json({ message: "Error al obtener el listado de personal." });
  }
};

// Obtener un personal por id
const obtenerPersonalPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const p = await Personal.findByPk(id, {
      attributes: [
        "id",
        "nombres",
        "apellidos",
        "sexo",
        "dni",
        "telefono",
        "email",
        "direccion",
        "cargo_id",
        "estado",
        "fecha_registro"
      ],
      include: [
        {
          model: Cargo,
          as: "cargo",
          attributes: ["id", "nombre"]
        }
      ]
    });

    if (!p) {
      return res.status(404).json({ message: "Personal no encontrado." });
    }

    return res.json({ datos: p });
  } catch (error) {
    console.error("Error al obtener personal por ID:", error);
    return res.status(500).json({ message: "Error al obtener personal." });
  }
};

// Editar datos de un personal
const editarPersonal = async (req, res) => {
  const { id } = req.params;
  const {
    nombres,
    apellidos,
    sexo,
    dni,
    telefono,
    email,
    direccion,
    cargo_id
  } = req.body;

  if (
    !nombres ||
    !apellidos ||
    !sexo ||
    !dni ||
    !telefono ||
    !email ||
    !direccion ||
    !cargo_id
  ) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios." });
  }

  try {
    const p = await Personal.findByPk(id);
    if (!p) {
      return res.status(404).json({ message: "Personal no encontrado." });
    }

    await p.update({
      nombres,
      apellidos,
      sexo,
      dni,
      telefono,
      email,
      direccion,
      cargo_id
    });

    return res.json({
      message: "Datos de personal actualizados.",
      datos: p
    });
  } catch (error) {
    console.error("Error al editar personal:", error);
    return res
      .status(500)
      .json({ message: "Error al actualizar datos de personal." });
  }
};

// Alternar estado
const cambiarEstado = async (req, res) => {
  const { id } = req.params;

  try {
    const p = await Personal.findByPk(id);
    if (!p) {
      return res.status(404).json({ message: "Personal no encontrado." });
    }

    const nuevoEstado = p.estado === "Activo" ? "Inactivo" : "Activo";
    await p.update({ estado: nuevoEstado });

    return res.json({
      message: `Estado cambiado a ${nuevoEstado}.`,
      estado: nuevoEstado
    });
  } catch (error) {
    console.error("Error al cambiar estado:", error);
    return res
      .status(500)
      .json({ message: "Error al cambiar el estado de personal." });
  }
};

// Eliminar personal
const eliminarPersonal = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Personal.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ message: "Personal no encontrado." });
    }
    return res.json({ message: "Personal eliminado correctamente." });
  } catch (error) {
    console.error("Error al eliminar personal:", error);
    return res
      .status(500)
      .json({ message: "Error al eliminar el personal." });
  }
};

module.exports = {
  registrarPersonal,
  listarPersonal,
  obtenerPersonalPorId,
  editarPersonal,
  cambiarEstado,
  eliminarPersonal,
};