const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Personal = sequelize.define("Personal", {
    nombres: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apellidos: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sexo: {
      type: DataTypes.ENUM("Masculino", "Femenino"),
      allowNull: false,
    },
    dni: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    telefono: {
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
    direccion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Activo",
    },
  }, {
    tableName: "personal",
    timestamps: true,
    createdAt: "fecha_registro",
    updatedAt: false,
  });

  // Relación con cargo
  Personal.associate = (models) => {
    Personal.belongsTo(models.Cargo, {
      foreignKey: {
        name: "cargo_id",
        allowNull: false,
      },
      as: "cargo",
    });
  };

  return Personal;
};