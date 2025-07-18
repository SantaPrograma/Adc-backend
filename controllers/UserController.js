const sequelize = require("../config/sequelize");
const Usuario = sequelize.models.Usuario;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET || "clave_secreta_super_segura";

// Login adaptado con rol
const login = async (req, res) => {
  try {
    const { usuario, contraseña } = req.body;

    if (!usuario || !contraseña) {
      return res.status(400).json({ message: "Por favor, ingresa ambos campos: usuario y contraseña" });
    }

    const user = await Usuario.findOne({ where: { usuario } });
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const contraseñaValida = await bcrypt.compare(contraseña, user.contraseña);
    if (!contraseñaValida) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user.id, usuario: user.usuario, rol: user.rol },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      usuario: user.usuario,
      rol: user.rol,
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

// Crear usuarios con rol (cliente o admin)
const registrarUsuario = async (req, res) => {
  const { usuario, contraseña, rol } = req.body;

  const creador = req.usuario?.usuario || null;
  const rolCreador = req.usuario?.rol;

  const rolFinal = req.usuario ? rol || "cliente" : "cliente";

  if (!usuario || !contraseña) {
    return res.status(400).json({ message: "Faltan campos requeridos." });
  }

  if (rolFinal === "admin" && rolCreador !== "admin") {
    return res.status(403).json({ message: "No tienes permisos para crear usuarios con rol admin." });
  }

  try {
    const existente = await Usuario.findOne({ where: { usuario } });
    if (existente) {
      return res.status(400).json({ message: "El usuario ya existe." });
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const nuevoUsuario = await Usuario.create({
      usuario,
      contraseña: hashedPassword,
      rol: rolFinal,
      creado_por: creador
    });

    return res.status(201).json({
      message: "Usuario registrado con éxito.",
      usuario: nuevoUsuario.usuario,
      rol: nuevoUsuario.rol,
      creado_por: nuevoUsuario.creado_por,
      fecha_creacion: nuevoUsuario.fecha_creacion
    });

  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return res.status(500).json({ message: "Error al registrar el usuario." });
  }
};

// Listar todos los usuarios
const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      where: { rol: "admin" },
      attributes: ["id", "usuario", "creado_por", "fecha_creacion"]
    });
    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios." });
  }
};

// Eliminar usuario por ID
const eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const eliminado = await Usuario.destroy({ where: { id } });
    if (!eliminado) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }
    res.json({ message: "Usuario eliminado correctamente." });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ message: "Error al eliminar el usuario." });
  }
};

// Verificar usuario
const obtenerPerfil = async (req, res) => {
  try {
    const usuarioAutenticado = req.usuario;

    if (!usuarioAutenticado) {
      return res.status(401).json({ message: "No autenticado" });
    }

    return res.status(200).json({
      usuario: usuarioAutenticado.usuario,
      rol: usuarioAutenticado.rol,
    });
  } catch (error) {
    console.error("Error al obtener el perfil:", error);
    return res.status(500).json({ message: "Error al obtener perfil" });
  }
};

module.exports = {
  login,
  registrarUsuario,
  listarUsuarios,
  eliminarUsuario,
  obtenerPerfil,
};
