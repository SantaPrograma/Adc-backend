const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Acceso denegado. Token no proporcionado." });
  }

  try {
    const secret = process.env.JWT_SECRET || "clave_secreta_super_segura";
    const decoded = jwt.verify(token, secret);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token inválido o expirado." });
  }
};

module.exports = verificarToken;