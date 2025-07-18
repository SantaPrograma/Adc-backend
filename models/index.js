const { Sequelize } = require("sequelize");
const sequelize = require("../config/sequelize");

// Modelos
const User = require("./User")(sequelize);
const Contactanos = require("./Contactanos")(sequelize);
const Cargo = require("./Cargo")(sequelize);
const Personal = require("./Personal")(sequelize);
const UnidadMedida = require("./UnidadMedida")(sequelize);
const Producto = require("./Producto")(sequelize);
const Nino = require("./Nino")(sequelize);
const MadrePadre = require("./MadrePadre")(sequelize);
const Apoderado = require("./Apoderado")(sequelize);
const Matricula = require("./Matricula")(sequelize);

// Agrupa los modelos en un objeto
const db = {
  sequelize,
  Sequelize,
  User,
  Contactanos,
  Cargo,
  Personal,
  UnidadMedida,
  Producto,
  Nino,
  MadrePadre,
  Apoderado,
  Matricula
};

// Ejecuta asociaciones si existen
Object.values(db).forEach((model) => {
  if (model.associate) {
    model.associate(db);
  }
});

module.exports = db;