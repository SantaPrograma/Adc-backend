const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Nino = sequelize.define("Nino", {
    nombres: {
      type: DataTypes.STRING,
      allowNull: false
    },
    apellidos: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fechaNacimiento: {
      type: DataTypes.DATE
    },
    edad: {
      type: DataTypes.STRING
    },
    tipoDocumento: {
      type: DataTypes.STRING
    },
    numeroDocumento: {
      type: DataTypes.STRING,
      unique: true
    },
    direccion: {
      type: DataTypes.STRING
    },
    sexo: {
      type: DataTypes.STRING
    },
    tipoSangre: {
      type: DataTypes.STRING
    },
    tomaBiberon: {
      type: DataTypes.STRING
    },
    usaPanal: {
      type: DataTypes.STRING
    },
    alergias: {
      type: DataTypes.TEXT
    },
    discapacidad: {
      type: DataTypes.STRING
    },
    seguroSalud: {
      type: DataTypes.STRING
    },
    detalleSeguro: {
      type: DataTypes.STRING,
      allowNull: true
    },
    copiaDni: {
      type: DataTypes.STRING
    },
    partidaNacimiento: {
      type: DataTypes.STRING
    }
  }, {
    underscored: true,
    tableName: 'ninos'
  });

  Nino.associate = (models) => {
    Nino.hasOne(models.Matricula, {
      foreignKey: 'nino_id',
      as: 'matricula'
    });
  };

  return Nino;
};
