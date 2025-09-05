//Aqui en esta clase deben implementar sus funciones de CREATE, DELETE Y READ.

const { pool } = require('../config/database');

class GestorDeInventario {
  static #instance = null;

  constructor() {
    if (GestorDeInventario.#instance) {
      return GestorDeInventario.#instance;
    }
    GestorDeInventario.#instance = this;
  }

  static getInstance() {
    if (!GestorDeInventario.#instance) {
      GestorDeInventario.#instance = new GestorDeInventario();
    }
    return GestorDeInventario.#instance;
  }

  async actualizarGrano(idGranos, camposParaActualizar) {
    if (!idGranos) {
      throw new Error('idGranos es requerido');
    }
    if (!camposParaActualizar || typeof camposParaActualizar !== 'object') {
      throw new Error('camposParaActualizar debe ser un objeto con columnas a actualizar');
    }

    const columnasPermitidas = new Set([
      'TipoGrano',
      'Fecha_Ingreso',
      'Fecha_Vencimiento',
      'Cantidad_Gramos',
      'Cantidad_Gramos_Restock',
      'Precio'
    ]);

    const setPartes = [];
    const valores = [];

    for (const [columna, valor] of Object.entries(camposParaActualizar)) {
      if (!columnasPermitidas.has(columna)) {
        continue;
      }
      setPartes.push(`${columna} = ?`);
      valores.push(valor);
    }

    if (setPartes.length === 0) {
      throw new Error('No hay columnas válidas para actualizar');
    }

    const sql = `UPDATE granos SET ${setPartes.join(', ')} WHERE idGranos = ?`;
    valores.push(idGranos);

    const connection = await pool.getConnection();
    try {
      const [resultado] = await connection.execute(sql, valores);
      return {
        idGranos,
        columnasActualizadas: setPartes.length,
        filasAfectadas: resultado.affectedRows || 0
      };
    } finally {
      connection.release();
    }
  }


  // 🔹 READ: obtener granos
  async obtenerGranos(idGranos = null) {
    try {
      let query = "SELECT * FROM granos";
      let params = [];

      if (idGranos) {
        query += " WHERE id = ?";
        params.push(idGranos);
      }

      const [rows] = await pool.execute(query, params);
      return rows;
    } catch (error) {
      throw new Error("Error al obtener los granos: " + error.message);
    }
  }
}

module.exports = {
  GestorDeInventario,
  gestorDeInventario: GestorDeInventario.getInstance()
};