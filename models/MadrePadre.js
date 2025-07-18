const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MadrePadre = sequelize.define("MadrePadre", {
    tipo: {
      type: DataTypes.STRING,
      allowNull: false
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
    }
  }, {
    underscored: true,
    tableName: "madres_padres"
  });

  MadrePadre.associate = (models) => {
    MadrePadre.hasMany(models.Matricula, {
      foreignKey: 'madre_id',
      as: 'matriculasComoMadre'
    });

    MadrePadre.hasMany(models.Matricula, {
      foreignKey: 'padre_id',
      as: 'matriculasComoPadre'
    });

    MadrePadre.hasMany(models.Apoderado, {
      foreignKey: 'padre_id',
      as: 'apoderadoReferente'
    });
  };

  return MadrePadre;
};
