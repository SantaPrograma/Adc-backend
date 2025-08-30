const { Nino, MadrePadre, Apoderado, Matricula } = require("../models");
const { Op } = require("sequelize");

// Registrar Matricula
const registrarMatricula = async (req, res) => {
  try {
    const nino = JSON.parse(req.body.nino);
    const madre = JSON.parse(req.body.madre);
    const padre = JSON.parse(req.body.padre);
    const apoderado = JSON.parse(req.body.apoderado);

    const copiaDniFile = req.files?.copiaDni?.[0];
    const partidaNacimientoFile = req.files?.partidaNacimiento?.[0];

    if (copiaDniFile) nino.copiaDni = copiaDniFile.filename;
    if (partidaNacimientoFile) nino.partidaNacimiento = partidaNacimientoFile.filename;

    // Validación de selects obligatorios
    const selectsNino = ["tipoDocumento", "sexo", "tipoSangre", "tomaBiberon", "usaPanal"];
    const selectsPadres = ["tipoDocumento"];

    for (const campo of selectsNino) {
      if (!nino[campo] || nino[campo] === "Seleccione") {
        return res.status(400).json({ error: `Debe seleccionar un valor para ${campo} del niño.` });
      }
    }

    for (const campo of selectsPadres) {
      if (!madre[campo] || madre[campo] === "Seleccione") {
        return res.status(400).json({ error: `Debe seleccionar un tipo de documento para la madre.` });
      }
      if (!padre[campo] || padre[campo] === "Seleccione") {
        return res.status(400).json({ error: `Debe seleccionar un tipo de documento para el padre.` });
      }
      if (apoderado.tipoApoderado === "otro" && (!apoderado[campo] || apoderado[campo] === "Seleccione")) {
        return res.status(400).json({ error: `Debe seleccionar un tipo de documento para el apoderado.` });
      }
    }

    // Limpieza de campos opcionales
    if (!nino.alergias?.trim()) nino.alergias = "No";
    if (!nino.discapacidad?.trim()) nino.discapacidad = "No";
    if (nino.seguroSalud !== "Otro") {
      nino.detalleSeguro = null;
    } else if (!nino.detalleSeguro?.trim()) {
      nino.detalleSeguro = null;
    }

    // Buscar si el niño ya existe
    let ninoExistente = await Nino.findOne({
      where: { numeroDocumento: nino.numeroDocumento }
    });

    if (!ninoExistente) {
      ninoExistente = await Nino.create(nino);
    }

    // Verificar matrícula existente en el mismo año
    const anioActual = new Date().getFullYear();
    const inicioAnio = new Date(`${anioActual}-01-01`);
    const finAnio = new Date(`${anioActual}-12-31`);

    const matriculaExistente = await Matricula.findOne({
      where: {
        nino_id: ninoExistente.id,
        fecha_registro: {
          [Op.gte]: inicioAnio,
          [Op.lte]: finAnio
        }
      }
    });

    if (matriculaExistente) {
      return res.status(400).json({ error: `El niño ya está matriculado en el año ${anioActual}` });
    }

    // Registrar madre y padre
    const nuevaMadre = await MadrePadre.create({ ...madre, tipo: "madre" });
    const nuevoPadre = await MadrePadre.create({ ...padre, tipo: "padre" });

    // Registrar apoderado
    let nuevoApoderado;
    if (apoderado.tipoApoderado === "madre") {
      nuevoApoderado = await Apoderado.create({
        es_padre: true,
        padre_id: nuevaMadre.id,
        parentesco: apoderado.parentesco || "madre"
      });
    } else if (apoderado.tipoApoderado === "padre") {
      nuevoApoderado = await Apoderado.create({
        es_padre: true,
        padre_id: nuevoPadre.id,
        parentesco: apoderado.parentesco || "padre"
      });
    } else {
      nuevoApoderado = await Apoderado.create({
        es_padre: false,
        nombres: apoderado.nombres,
        apellidos: apoderado.apellidos,
        tipoDocumento: apoderado.tipoDocumento,
        numeroDocumento: apoderado.numeroDocumento,
        fechaNacimiento: apoderado.fechaNacimiento,
        telefono: apoderado.telefono,
        correo: apoderado.correo,
        direccion: apoderado.direccion,
        parentesco: apoderado.parentesco
      });
    }

    // Registrar matrícula con fecha actual como "fecha_registro"
    const nuevaMatricula = await Matricula.create({
      nino_id: ninoExistente.id,
      madre_id: nuevaMadre.id,
      padre_id: nuevoPadre.id,
      apoderado_id: nuevoApoderado.id,
      estado: "Pendiente",
      duracion_matricula: parseInt(req.body.duracionMatricula),
      fecha_registro: new Date(),
      fecha_matricula: null
    });

    return res.status(201).json({
      message: "Matrícula registrada con éxito",
      matriculaId: nuevaMatricula.id
    });

  } catch (error) {
    console.error("Error al registrar matrícula:", error);
    res.status(500).json({ error: "Error al registrar la matrícula" });
  }
};

// Buscar Datos por numeroDocumento para Renovacion de matricula
const buscarDatosRenovacion = async (req, res) => {
  try {
    const { numeroDocumento } = req.params;

    // 1. Buscar al niño por número de documento
    const nino = await Nino.findOne({ where: { numeroDocumento } });

    if (!nino) {
      return res.status(404).json({ error: "Niño no encontrado" });
    }

    // 2. Buscar su matrícula más reciente
    const matricula = await Matricula.findOne({
      where: { nino_id: nino.id },
      order: [["fecha_registro", "DESC"]],
      include: [
        { model: MadrePadre, as: "madre" },
        { model: MadrePadre, as: "padre" },
        { model: Apoderado, as: "apoderado" },
      ]
    });

    if (!matricula) {
      return res.status(404).json({ error: "No se encontró matrícula previa para el niño" });
    }

    // 3. Fechas normalizadas
    const fechaNacimientoNino = nino.fechaNacimiento?.toISOString().split("T")[0];
    const fechaNacimientoMadre = matricula.madre?.fechaNacimiento?.toISOString().split("T")[0];
    const fechaNacimientoPadre = matricula.padre?.fechaNacimiento?.toISOString().split("T")[0];
    const fechaNacimientoApoderado = matricula.apoderado?.fechaNacimiento?.toISOString().split("T")[0];

    // 4. Construir URLs de los archivos si existen
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const copiaDniUrl = nino.copiaDni ? `${baseUrl}/uploads/ninos/${nino.copiaDni}` : null;
    const partidaNacimientoUrl = nino.partidaNacimiento ? `${baseUrl}/uploads/ninos/${nino.partidaNacimiento}` : null;

    // 5. Retornar los datos completos
    res.json({
      nino: {
        ...nino.toJSON(),
        fechaNacimiento: fechaNacimientoNino,
        copiaDniUrl,
        partidaNacimientoUrl
      },
      madre: {
        ...matricula.madre?.toJSON(),
        fechaNacimiento: fechaNacimientoMadre
      },
      padre: {
        ...matricula.padre?.toJSON(),
        fechaNacimiento: fechaNacimientoPadre
      },
      apoderado: {
        ...matricula.apoderado?.toJSON(),
        fechaNacimiento: fechaNacimientoApoderado
      }
    });

  } catch (error) {
    console.error("Error al buscar renovación:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Listar matrículas resumidas con filtro por edad y paginación
const listarMatriculas = async (req, res) => {
  try {
    const { page = 1, size = 10 } = req.query;

    const pageNumber = parseInt(page);
    const pageSize = parseInt(size);
    const offset = (pageNumber - 1) * pageSize;

    const { count, rows } = await Matricula.findAndCountAll({
      limit: pageSize,
      offset,
      order: [["id", "DESC"]],
      include: [
        {
          model: Nino,
          as: "nino",
          attributes: ["id", "nombres", "apellidos", "sexo", "fechaNacimiento", "edad"]
        }
      ],
      attributes: ["id", "duracion_matricula", "estado", "fecha_registro", "fecha_matricula"]
    });

    const datos = rows.map((matricula) => {
      const nino = matricula.nino;

      return {
        id: matricula.id,
        nombres: nino.nombres,
        apellidos: nino.apellidos,
        sexo: nino.sexo,
        fechaNacimiento: nino.fechaNacimiento,
        edad: nino.edad,
        duracion: matricula.duracion_matricula,
        estado: matricula.estado,
        fechaRegistro: matricula.fecha_registro,
        fechaMatricula: matricula.fecha_matricula,
      };
    });

    res.json({
      total: count,
      paginaActual: pageNumber,
      totalPaginas: Math.ceil(count / pageSize),
      datos
    });
  } catch (error) {
    console.error("Error al listar matrículas:", error);
    res.status(500).json({ error: "Error al listar matrículas" });
  }
};

// Ver detalles completos de matrícula por ID
const obtenerDetalleMatricula = async (req, res) => {
  try {
    const { id } = req.params;

    const matricula = await Matricula.findOne({
      where: { id },
      include: [
        { model: Nino, as: "nino" },
        { model: MadrePadre, as: "madre" },
        { model: MadrePadre, as: "padre" },
        { model: Apoderado, as: "apoderado" }
      ]
    });

    if (!matricula) {
      return res.status(404).json({ error: "Matrícula no encontrada" });
    }

    const nino = matricula.nino; // <-- corregido
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const copiaDniUrl = nino?.copiaDni ? `${baseUrl}/uploads/ninos/${nino.copiaDni}` : null;
    const partidaNacimientoUrl = nino?.partidaNacimiento ? `${baseUrl}/uploads/ninos/${nino.partidaNacimiento}` : null;

    const formatFecha = (fecha) =>
      fecha ? new Date(fecha).toISOString().split("T")[0] : null;

    res.json({
      nino: {
        ...nino?.toJSON(),
        fechaNacimiento: formatFecha(nino?.fechaNacimiento),
        copiaDniUrl,
        partidaNacimientoUrl
      },
      madre: {
        ...matricula.madre?.toJSON(),
        fechaNacimiento: formatFecha(matricula.madre?.fechaNacimiento)
      },
      padre: {
        ...matricula.padre?.toJSON(),
        fechaNacimiento: formatFecha(matricula.padre?.fechaNacimiento)
      },
      apoderado: {
        ...matricula.apoderado?.toJSON(),
        fechaNacimiento: formatFecha(matricula.apoderado?.fechaNacimiento)
      },
      estado: matricula.estado,
      duracion: matricula.duracion_matricula,
      creadaEn: formatFecha(matricula.fecha_registro) // <-- `createdAt` renombrado como `fecha_registro`
    });
  } catch (error) {
    console.error("Error al obtener detalle de matrícula:", error);
    res.status(500).json({ error: "Error al obtener detalle de matrícula" });
  }
};

// Alternar estado de la matrícula
const alternarEstadoMatricula = async (req, res) => {
  try {
    const { id } = req.params;

    const matricula = await Matricula.findByPk(id);

    if (!matricula) {
      return res.status(404).json({ error: "Matrícula no encontrada" });
    }

    // Determinar nuevo estado y fecha
    const nuevoEstado = matricula.estado === "Matriculado" ? "Pendiente" : "Matriculado";
    const nuevaFecha = nuevoEstado === "Matriculado" ? new Date() : null;

    // Actualizar con update()
    await matricula.update({
      estado: nuevoEstado,
      fecha_matricula: nuevaFecha,
    });

    res.json({
      message: `Estado actualizado a ${nuevoEstado}`,
      nuevoEstado,
      fecha_matricula: nuevaFecha,
    });
  } catch (error) {
    console.error("Error al cambiar el estado de matrícula:", error);
    res.status(500).json({ error: "Error al cambiar el estado de matrícula" });
  }
};

module.exports = {
  registrarMatricula,
  buscarDatosRenovacion,
  listarMatriculas,
  obtenerDetalleMatricula,
  alternarEstadoMatricula
};
