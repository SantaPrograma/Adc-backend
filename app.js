const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

const db = require("./models");
const apiRoutes = require("./routes/index");

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

db.sequelize.authenticate()
  .then(() => db.sequelize.sync())
  .then(() => {

    app.use("/api", apiRoutes);

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error de conexión a la base de datos:", err);
  });