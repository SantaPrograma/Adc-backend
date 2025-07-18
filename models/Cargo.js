const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Cargo = sequelize.define("Cargo", {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    tableName: "cargos",
    timestamps: false,
  });

  return Cargo;
};
