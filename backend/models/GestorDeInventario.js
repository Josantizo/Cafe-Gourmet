//Aqui en esta clase deben implementar sus funciones de CREATE, DELETE Y READ.
// Integración con patrón Observer para notificaciones de stock bajo

const { pool } = require('../config/database');
const Subject = require('../patterns/observer/Subject');

class GestorDeInventario extends Subject {
  static #instance = null;

  constructor() {
    super(); // Inicializar Subject
    if (GestorDeInventario.#instance) {
      return GestorDeInventario.#instance;
    }
    GestorDeInventario.#instance = this;
    this.umbralStockBajo = 1000; // gramos por defecto
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
      
      // Verificar stock bajo después de actualizar
      if (camposParaActualizar.Cantidad_Gramos !== undefined) {
        await this.verificarStockBajo(idGranos);
      }
      
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
        query += " WHERE idGranos = ?";
        params.push(idGranos);
      }

      const [rows] = await pool.execute(query, params);
      return rows;
    } catch (error) {
      throw new Error("Error al obtener los granos: " + error.message);
    }
  }
  async crearGrano(datosNuevoGrano) {
    if (!datosNuevoGrano || typeof datosNuevoGrano !== 'object') {
      throw new Error('datosNuevoGrano debe ser un objeto con las columnas a insertar');
    }

    const columnasPermitidas = new Set([
      'TipoGrano',
      'Fecha_Ingreso',
      'Fecha_Vencimiento',
      'Cantidad_Gramos',
      'Cantidad_Gramos_Restock',
      'Precio'
    ]);

    const columnas = [];
    const valores = [];
    const placeholders = [];

    for (const [columna, valor] of Object.entries(datosNuevoGrano)) {
      if (!columnasPermitidas.has(columna)) {
        continue; // ignora columnas no permitidas
      }
      columnas.push(columna);
      valores.push(valor);
      placeholders.push('?');
    }

    if (columnas.length === 0) {
      throw new Error('No hay columnas válidas para insertar');
    }

    const sql = `INSERT INTO granos (${columnas.join(', ')}) VALUES (${placeholders.join(', ')})`;

    const connection = await pool.getConnection();
    try {
      const [resultado] = await connection.execute(sql, valores);
      return {
        idGranos: resultado.insertId, // devuelve el ID generado
        columnasInsertadas: columnas.length
      };
    } finally {
      connection.release();
    }
  }

  async eliminarGrano(idGranos) {
    if (!idGranos) {
      throw new Error('idGranos es requerido');
    }

    const sql = `DELETE FROM granos WHERE idGranos = ?`;

    const connection = await pool.getConnection();
    try {
      const [resultado] = await connection.execute(sql, [idGranos]);
      return {
        idGranos,
        filasAfectadas: resultado.affectedRows || 0
      };
    } finally {
      connection.release();
    }
  }

  // ===== MÉTODOS DEL PATRÓN OBSERVER =====

  /**
   * Verifica si el stock de un grano está bajo y notifica a los observadores
   * @param {number} idGranos
   */
  async verificarStockBajo(idGranos) {
    try {
      const granos = await this.obtenerGranos(idGranos);
      
      if (granos.length === 0) {
        return;
      }

      const grano = granos[0];
      const cantidadActual = grano.Cantidad_Gramos || 0;
      const umbralRestock = grano.Cantidad_Gramos_Restock || this.umbralStockBajo;

      // Si el stock actual es menor al umbral de restock, notificar
      if (cantidadActual < umbralRestock) {
        this.notificarObservadores({
          tipo: 'STOCK_BAJO',
          grano: grano,
          cantidadActual,
          umbralRestock,
          fecha: new Date()
        });
      }
    } catch (error) {
      console.error('Error verificando stock bajo:', error.message);
    }
  }

  /**
   * Verifica todos los granos y notifica los que tienen stock bajo
   */
  async verificarTodosLosStocks() {
    try {
      const todosLosGranos = await this.obtenerGranos();
      let granosConStockBajo = 0;

      for (const grano of todosLosGranos) {
        const cantidadActual = grano.Cantidad_Gramos || 0;
        const umbralRestock = grano.Cantidad_Gramos_Restock || this.umbralStockBajo;

        if (cantidadActual < umbralRestock) {
          this.notificarObservadores({
            tipo: 'STOCK_BAJO',
            grano: grano,
            cantidadActual,
            umbralRestock,
            fecha: new Date()
          });
          granosConStockBajo++;
        }
      }

      return {
        totalGranos: todosLosGranos.length,
        granosConStockBajo,
        fecha: new Date()
      };
    } catch (error) {
      throw new Error(`Error verificando todos los stocks: ${error.message}`);
    }
  }

  /**
   * Establece el umbral general de stock bajo
   * @param {number} umbral
   */
  establecerUmbralStockBajo(umbral) {
    if (umbral <= 0) {
      throw new Error('El umbral debe ser mayor a 0');
    }
    this.umbralStockBajo = umbral;
  }

  /**
   * Obtiene el umbral actual de stock bajo
   * @returns {number}
   */
  obtenerUmbralStockBajo() {
    return this.umbralStockBajo;
  }

  /**
   * Simula consumo de granos (para pruebas)
   * @param {number} idGranos
   * @param {number} cantidad
   */
  async consumirGranos(idGranos, cantidad) {
    try {
      const granos = await this.obtenerGranos(idGranos);
      
      if (granos.length === 0) {
        throw new Error('Grano no encontrado');
      }

      const grano = granos[0];
      const cantidadActual = grano.Cantidad_Gramos || 0;
      const nuevaCantidad = Math.max(0, cantidadActual - cantidad);

      await this.actualizarGrano(idGranos, {
        Cantidad_Gramos: nuevaCantidad
      });

      return {
        idGranos,
        cantidadAnterior: cantidadActual,
        cantidadConsumida: cantidad,
        cantidadActual: nuevaCantidad,
        stockBajo: nuevaCantidad < (grano.Cantidad_Gramos_Restock || this.umbralStockBajo)
      };
    } catch (error) {
      throw new Error(`Error consumiendo granos: ${error.message}`);
    }
  }
}


module.exports = {
  GestorDeInventario,
  gestorDeInventario: GestorDeInventario.getInstance()
};