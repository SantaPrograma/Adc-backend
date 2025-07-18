const { DataTypes } = require('sequelize');
const bcrypt = require("bcryptjs");

module.exports = (sequelize) => {
  const Usuario = sequelize.define("Usuario", {
    usuario: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'usuario'
    },
    contraseña: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'contraseña'
    },
    rol: {
      type: DataTypes.ENUM('admin', 'cliente'),
      allowNull: false,
      defaultValue: 'cliente'
    },
    creado_por: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    tableName: 'usuarios',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: false,
  });

  // Hook para crear usuarios por defecto (admin y cliente)
  Usuario.afterSync(async () => {
    const adminExists = await Usuario.findOne({ where: { usuario: "admin" } });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await Usuario.create({
        usuario: "admin",
        contraseña: hashedPassword,
        rol: "admin",
        creado_por: "system"
      });
      console.log("Usuario admin creado con éxito.");
    }

    const clienteExists = await Usuario.findOne({ where: { usuario: "cliente" } });
    if (!clienteExists) {
      const hashedPassword = await bcrypt.hash("cliente123", 10);
      await Usuario.create({
        usuario: "cliente",
        contraseña: hashedPassword,
        rol: "cliente",
        creado_por: "system"
      });
      console.log("Usuario cliente creado con éxito.");
    }
  });

  return Usuario;
};
