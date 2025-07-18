const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Apoderado = sequelize.define("Apoderado", {
    es_padre: {
      type: DataTypes.BOOLEAN
    },
    padre_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'madres_padres',
        key: 'id'
      }
    },
    nombres: {
      type: DataTypes.STRING
    },
    apellidos: {
      type: DataTypes.STRING
    },
    tipoDocumento: {
      type: DataTypes.STRING
    },
    numeroDocumento: {
      type: DataTypes.STRING
    },
    fechaNacimiento: {
      type: DataTypes.DATE
    },
    telefono: {
      type: DataTypes.STRING
    },
    correo: {
      type: DataTypes.STRING
    },
    direccion: {
      type: DataTypes.TEXT
    },
    parentesco: {
      type: DataTypes.STRING
    }
  }, {
    underscored: true,
    tableName: 'apoderados'
  });

  Apoderado.associate = (models) => {
    Apoderado.belongsTo(models.MadrePadre, {
      foreignKey: 'padre_id',
      as: 'padreReferente'
    });

    Apoderado.hasOne(models.Matricula, {
      foreignKey: 'apoderado_id',
      as: 'matricula'
    });
  };

  return Apoderado;
};
