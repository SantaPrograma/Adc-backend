const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Matricula = sequelize.define("Matricula", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    estado: {
      type: DataTypes.ENUM('Pendiente', 'Matriculado'),
      allowNull: false,
      defaultValue: 'Pendiente'
    },
    duracion_matricula: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fecha_matricula: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'matriculas',
    timestamps: true,
    createdAt: 'fecha_registro',
    updatedAt: false,
    underscored: true
  });

  Matricula.associate = (models) => {
    Matricula.belongsTo(models.Nino, {
      foreignKey: 'nino_id',
      as: 'nino'
    });

    Matricula.belongsTo(models.MadrePadre, {
      foreignKey: 'madre_id',
      as: 'madre'
    });

    Matricula.belongsTo(models.MadrePadre, {
      foreignKey: 'padre_id',
      as: 'padre'
    });

    Matricula.belongsTo(models.Apoderado, {
      foreignKey: 'apoderado_id',
      as: 'apoderado'
    });
  };

  return Matricula;
};