const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Contactanos = sequelize.define("Contactanos", {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Pendiente",
    },
    atendido_por: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fecha_atencion: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: "contactanos",
    timestamps: true,
    createdAt: "fecha_emision",
    updatedAt: false,
  });

  return Contactanos;
};
