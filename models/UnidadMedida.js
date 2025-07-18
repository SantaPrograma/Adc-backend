const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const UnidadMedida = sequelize.define("UnidadMedida", {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    tableName: "unidades_medida",
    timestamps: false,
  });

  return UnidadMedida;
};
