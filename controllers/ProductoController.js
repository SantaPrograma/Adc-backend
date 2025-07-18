const sequelize = require("../config/sequelize");
const Producto = sequelize.models.Producto;
const UnidadMedida = sequelize.models.UnidadMedida;

// Registrar un nuevo producto (solo nombre y unidad de medida)
const registrarProducto = async (req, res) => {
  const { nombre, unidad_medida_id } = req.body;

  if (!nombre || !unidad_medida_id) {
    return res.status(400).json({ message: "Nombre y unidad de medida son obligatorios." });
  }

  try {
    const nuevo = await Producto.create({ nombre, unidad_medida_id });
    return res.status(201).json({
      message: "Producto registrado con éxito.",
      datos: nuevo
    });
  } catch (error) {
    console.error("Error al registrar producto:", error);
    return res.status(500).json({ message: "Error al registrar el producto." });
  }
};

// Listar todos los productos
const listarProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      include: {
        model: UnidadMedida,
        as: "unidad_medida",
        attributes: ["id", "nombre"]
      },
      order: [["id", "ASC"]]
    });

    return res.json({ productos });
  } catch (error) {
    console.error("Error al listar productos:", error);
    return res.status(500).json({ message: "Error al obtener productos." });
  }
};

// Obtener un producto por ID
const obtenerProductoPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const producto = await Producto.findByPk(id, {
      include: {
        model: UnidadMedida,
        as: "unidad_medida",
        attributes: ["id", "nombre"]
      }
    });

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    return res.json({ datos: producto });
  } catch (error) {
    console.error("Error al obtener producto:", error);
    return res.status(500).json({ message: "Error al obtener producto." });
  }
};

// Editar nombre o unidad de medida del producto
const editarProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, unidad_medida_id } = req.body;

  if (!nombre || !unidad_medida_id) {
    return res.status(400).json({ message: "Nombre y unidad de medida son obligatorios." });
  }

  try {
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    await producto.update({ nombre, unidad_medida_id });

    return res.json({ message: "Producto actualizado correctamente.", datos: producto });
  } catch (error) {
    console.error("Error al editar producto:", error);
    return res.status(500).json({ message: "Error al actualizar producto." });
  }
};

// Eliminar un producto
const eliminarProducto = async (req, res) => {
  const { id } = req.params;

  try {
    const eliminado = await Producto.destroy({ where: { id } });
    if (!eliminado) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    return res.json({ message: "Producto eliminado correctamente." });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return res.status(500).json({ message: "Error al eliminar producto." });
  }
};

// Actualizar inventario: registrar nueva cantidad
const actualizarInventario = async (req, res) => {
  const { id } = req.params;
  const { nuevaCantidad, usuario } = req.body;

  if (nuevaCantidad === undefined || !usuario) {
    return res.status(400).json({ message: "Cantidad y usuario son obligatorios." });
  }

  try {
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    const anterior = producto.cantidad_ahora;

    await producto.update({
      cantidad_antes: anterior !== null ? anterior : null,
      cantidad_ahora: nuevaCantidad,
      fecha_actualizacion: new Date(),
      actualizado_por: usuario
    });

    return res.json({
      message: "Inventario actualizado correctamente.",
      datos: {
        cantidad_antes: producto.cantidad_antes,
        cantidad_ahora: producto.cantidad_ahora,
        fecha_actualizacion: producto.fecha_actualizacion,
        actualizado_por: producto.actualizado_por
      }
    });
  } catch (error) {
    console.error("Error al actualizar inventario:", error);
    return res.status(500).json({ message: "Error al actualizar inventario." });
  }
};

module.exports = {
  registrarProducto,
  listarProductos,
  obtenerProductoPorId,
  editarProducto,
  eliminarProducto,
  actualizarInventario
};
