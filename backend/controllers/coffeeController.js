//Aqui deben poner sus controladores de CREATE, DELETE Y READ, le pueden pedir a cursor que les
// ayude a crearlos.

const { gestorDeInventario } = require('../models/GestorDeInventario');

const actualizarGrano = async (req, res) => {
  try {
    const { id } = req.params;
    const idGranos = Number(id);
    if (!Number.isFinite(idGranos) || idGranos <= 0) {
      return res.status(400).json({ error: 'Parámetro id inválido' });
    }

    const camposParaActualizar = req.body || {};
    const resultado = await gestorDeInventario.actualizarGrano(idGranos, camposParaActualizar);

    if (!resultado || resultado.filasAfectadas === 0) {
      return res.status(404).json({ error: 'Registro no encontrado o sin cambios' });
    }

    return res.status(200).json({ message: 'Actualización exitosa', ...resultado });
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Error al actualizar' });
  }
};


// Nuevo controlador READ
const obtenerGranos = async (req, res) => {
  try {
      const { id } = req.params;
      const idGranos = id ? Number(id) : null;

      if (id && (!Number.isFinite(idGranos) || idGranos <= 0)) {
          return res.status(400).json({ error: 'Parámetro id inválido' });
      }

      const resultado = await gestorDeInventario.obtenerGranos(idGranos);

      if (!resultado || resultado.length === 0) {
          return res.status(404).json({ error: 'No se encontraron registros' });
      }

      return res.status(200).json({ data: resultado });
  } catch (error) {
      return res.status(500).json({ error: error.message || 'Error al obtener granos' });
  }
};

const crearGrano = async (req, res) => {
  try {
    const datosNuevoGrano = req.body || {};

    // Validar que req.body no esté vacío
    if (Object.keys(datosNuevoGrano).length === 0) {
      return res.status(400).json({ error: 'Datos para crear el grano requeridos' });
    }

    const resultado = await gestorDeInventario.crearGrano(datosNuevoGrano);

    if (!resultado || !resultado.idGranos) {
      return res.status(500).json({ error: 'No se pudo crear el grano' });
    }

    return res.status(201).json({
      message: 'Grano creado exitosamente',
      ...resultado
    });
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Error al crear grano' });
  }
};

const eliminarGrano = async (req, res) => {
  try {
    const { id } = req.params;
    const idGranos = Number(id);

    if (!Number.isFinite(idGranos) || idGranos <= 0) {
      return res.status(400).json({ error: 'Parámetro id inválido' });
    }

    const resultado = await gestorDeInventario.eliminarGrano(idGranos);

    if (!resultado || resultado.filasAfectadas === 0) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }

    return res.status(200).json({ message: 'Eliminación exitosa', ...resultado });
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Error al eliminar' });
  }
};

module.exports = { actualizarGrano, obtenerGranos, crearGrano, eliminarGrano };
