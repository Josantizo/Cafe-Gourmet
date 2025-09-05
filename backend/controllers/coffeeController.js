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

module.exports = { actualizarGrano, obtenerGranos };
