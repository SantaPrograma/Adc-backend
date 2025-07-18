const { Sequelize } = require("sequelize");
const dbConfig = require("./db.config");

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    logging: false,
  }
);

require("../models/User")(sequelize); // usa el nombre del archivo

module.exports = sequelize;
