const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Producto = sequelize.define("Producto", {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cantidad_antes: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    cantidad_ahora: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    actualizado_por: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: "productos",
    timestamps: false,
  });

  // Relación con UnidadMedida
  Producto.associate = (models) => {
    Producto.belongsTo(models.UnidadMedida, {
      foreignKey: {
        name: "unidad_medida_id",
        allowNull: false,
      },
      as: "unidad_medida",
    });
  };

  return Producto;
};
