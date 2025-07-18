const sequelize = require("../config/sequelize");
const Contactanos = sequelize.models.Contactanos;

// Registrar mensaje de contactanos
const registrarMensaje = async (req, res) => {
  const { nombre, email, telefono, mensaje } = req.body;
  if (!nombre || !email || !telefono || !mensaje) {
    return res.status(400).json({ message: "Todos los campos son obligatorios." });
  }
  try {
    const nuevo = await Contactanos.create({ nombre, email, telefono, mensaje });
    return res.status(201).json({
      message: "Mensaje enviado con éxito.",
      datos: {
        id: nuevo.id,
        nombre: nuevo.nombre,
        email: nuevo.email,
        telefono: nuevo.telefono,
        mensaje: nuevo.mensaje,
        estado: nuevo.estado,
        atendido_por: nuevo.atendido_por,
        fecha_emision: nuevo.fecha_emision,
      },
    });
  } catch (error) {
    console.error("Error al guardar el mensaje:", error);
    return res.status(500).json({ message: "Error al guardar el mensaje." });
  }
};

// Listar mensajes
const listarMensajes = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 10;
  const offset = (page - 1) * size;

  try {
    const { rows, count } = await Contactanos.findAndCountAll({
      order: [["id", "DESC"]],
      limit: size,
      offset,
      attributes: [
        "id", "nombre", "email", "telefono", "mensaje",
        "estado", "atendido_por", "fecha_emision", "fecha_atencion"
      ]
    });
    return res.json({
      totalItems: count,
      totalPages: Math.ceil(count / size),
      currentPage: page,
      mensajes: rows
    });
  } catch (error) {
    console.error("Error al obtener mensajes:", error);
    return res.status(500).json({ message: "Error al obtener mensajes." });
  }
};

// Alternar estado del mensaje
const alternarEstadoMensaje = async (req, res) => {
  const { id } = req.params;
  const atendidoPor = req.usuario?.usuario || "system";

  try {
    const msg = await Contactanos.findByPk(id);
    if (!msg) {
      return res.status(404).json({ message: "Mensaje no encontrado." });
    }

    const nuevoEstado = msg.estado === "Pendiente" ? "Atendido" : "Pendiente";

    const datosActualizados = {
      estado: nuevoEstado,
      atendido_por: nuevoEstado === "Atendido" ? atendidoPor : null,
      fecha_atencion: nuevoEstado === "Atendido" ? new Date() : null,
    };

    await msg.update(datosActualizados);

    return res.json({ message: `Mensaje marcado como ${nuevoEstado}.` });
  } catch (error) {
    console.error("Error al alternar estado:", error);
    return res.status(500).json({ message: "Error al alternar el estado del mensaje." });
  }
};

// Eliminación física
const eliminarFisico = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Contactanos.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ message: "Mensaje no encontrado." });
    }
    return res.json({ message: "Mensaje eliminado físicamente." });
  } catch (error) {
    console.error("Error en eliminación física:", error);
    return res.status(500).json({ message: "Error al eliminar el mensaje." });
  }
};

module.exports = {
  registrarMensaje,
  listarMensajes,
  alternarEstadoMensaje,
  eliminarFisico,
};
