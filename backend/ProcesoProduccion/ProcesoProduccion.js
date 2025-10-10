const { pool } = require('../config/database');

class ProcesoProduccion {
  constructor() {
    this.estados = {
      COSECHA: 'cosecha',
      TOSTADO: 'tostado', 
      MOLIDO: 'molido',
      EMPAQUETADO: 'empaquetado',
      VENTA: 'venta'
    };
  }

  // Crear un nuevo proceso de producción
  async crearProcesoProduccion(datosProceso) {
    const {
      idGranos,
      cantidadGramos,
      tipoGrano,
      region,
      fechaInicio = new Date()
    } = datosProceso;

    if (!idGranos || !cantidadGramos || !tipoGrano || !region) {
      throw new Error('Faltan datos requeridos para crear el proceso de producción');
    }

    const sql = `
      INSERT INTO proceso_produccion 
      (idGranos, cantidadGramos, tipoGrano, region, estadoActual, fechaInicio, fechaCreacion)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;

    const connection = await pool.getConnection();
    try {
      const [resultado] = await connection.execute(sql, [
        idGranos,
        cantidadGramos,
        tipoGrano,
        region,
        this.estados.COSECHA,
        fechaInicio
      ]);

      return {
        idProceso: resultado.insertId,
        estadoActual: this.estados.COSECHA,
        mensaje: 'Proceso de producción iniciado en estado: cosecha'
      };
    } finally {
      connection.release();
    }
  }

  // Avanzar al siguiente estado del proceso
  async avanzarEstado(idProceso, nuevoEstado, observaciones = '') {
    const estadosValidos = Object.values(this.estados);
    
    if (!estadosValidos.includes(nuevoEstado)) {
      throw new Error(`Estado inválido. Estados válidos: ${estadosValidos.join(', ')}`);
    }

    // Verificar que el proceso existe y obtener estado actual
    const procesoActual = await this.obtenerProceso(idProceso);
    if (!procesoActual) {
      throw new Error('Proceso de producción no encontrado');
    }

    // Validar transición de estados
    const estadoActual = procesoActual.estadoActual;
    const transicionesValidas = {
      [this.estados.COSECHA]: [this.estados.TOSTADO],
      [this.estados.TOSTADO]: [this.estados.MOLIDO],
      [this.estados.MOLIDO]: [this.estados.EMPAQUETADO],
      [this.estados.EMPAQUETADO]: [this.estados.VENTA]
    };

    if (!transicionesValidas[estadoActual]?.includes(nuevoEstado)) {
      throw new Error(`No se puede avanzar de ${estadoActual} a ${nuevoEstado}`);
    }

    const sql = `
      UPDATE proceso_produccion 
      SET estadoActual = ?, fechaActualizacion = NOW(), observaciones = ?
      WHERE idProceso = ?
    `;

    const connection = await pool.getConnection();
    try {
      await connection.execute(sql, [nuevoEstado, observaciones, idProceso]);
      
      return {
        idProceso,
        estadoAnterior: estadoActual,
        estadoNuevo: nuevoEstado,
        fechaActualizacion: new Date(),
        mensaje: `Proceso avanzado de ${estadoActual} a ${nuevoEstado}`
      };
    } finally {
      connection.release();
    }
  }

  // Obtener un proceso específico
  async obtenerProceso(idProceso) {
    const sql = `
      SELECT pp.*, g.TipoGrano, g.Fecha_Ingreso, g.Precio
      FROM proceso_produccion pp
      LEFT JOIN granos g ON pp.idGranos = g.idGranos
      WHERE pp.idProceso = ?
    `;

    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(sql, [idProceso]);
      return rows[0] || null;
    } finally {
      connection.release();
    }
  }

  // Obtener todos los procesos con filtros opcionales
  async obtenerProcesos(filtros = {}) {
    let sql = `
      SELECT pp.*, g.TipoGrano, g.Fecha_Ingreso, g.Precio
      FROM proceso_produccion pp
      LEFT JOIN granos g ON pp.idGranos = g.idGranos
      WHERE 1=1
    `;
    
    const params = [];

    if (filtros.estado) {
      sql += ' AND pp.estadoActual = ?';
      params.push(filtros.estado);
    }

    if (filtros.tipoGrano) {
      sql += ' AND pp.tipoGrano = ?';
      params.push(filtros.tipoGrano);
    }

    if (filtros.region) {
      sql += ' AND pp.region = ?';
      params.push(filtros.region);
    }

    if (filtros.fechaInicio) {
      sql += ' AND pp.fechaInicio >= ?';
      params.push(filtros.fechaInicio);
    }

    if (filtros.fechaFin) {
      sql += ' AND pp.fechaInicio <= ?';
      params.push(filtros.fechaFin);
    }

    sql += ' ORDER BY pp.fechaCreacion DESC';

    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(sql, params);
      return rows;
    } finally {
      connection.release();
    }
  }

  // Obtener estadísticas de producción por mes y año
  async obtenerEstadisticasProduccion(año = null) {
    let sql = `
      SELECT 
        YEAR(pp.fechaInicio) as año,
        MONTH(pp.fechaInicio) as mes,
        pp.estadoActual,
        COUNT(*) as cantidad,
        SUM(pp.cantidadGramos) as totalGramos,
        AVG(pp.cantidadGramos) as promedioGramos
      FROM proceso_produccion pp
      WHERE 1=1
    `;

    const params = [];

    if (año) {
      sql += ' AND YEAR(pp.fechaInicio) = ?';
      params.push(año);
    }

    sql += `
      GROUP BY YEAR(pp.fechaInicio), MONTH(pp.fechaInicio), pp.estadoActual
      ORDER BY año DESC, mes DESC, pp.estadoActual
    `;

    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(sql, params);
      return this.formatearEstadisticas(rows);
    } finally {
      connection.release();
    }
  }

  // Formatear estadísticas para mejor presentación
  formatearEstadisticas(datos) {
    const estadisticas = {};
    
    datos.forEach(row => {
      const año = row.año;
      const mes = row.mes;
      const estado = row.estadoActual;
      
      if (!estadisticas[año]) {
        estadisticas[año] = {};
      }
      
      if (!estadisticas[año][mes]) {
        estadisticas[año][mes] = {
          mes: mes,
          nombreMes: this.obtenerNombreMes(mes),
          estados: {}
        };
      }
      
      estadisticas[año][mes].estados[estado] = {
        cantidad: row.cantidad,
        totalGramos: row.totalGramos,
        promedioGramos: row.promedioGramos
      };
    });

    return estadisticas;
  }

  // Obtener nombre del mes
  obtenerNombreMes(numeroMes) {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[numeroMes - 1] || 'Desconocido';
  }

  // Generar informe mensual detallado
  async generarInformeMensual(año, mes) {
    const sql = `
      SELECT 
        pp.*,
        g.TipoGrano,
        g.Precio,
        DATEDIFF(NOW(), pp.fechaInicio) as diasEnProceso
      FROM proceso_produccion pp
      LEFT JOIN granos g ON pp.idGranos = g.idGranos
      WHERE YEAR(pp.fechaInicio) = ? AND MONTH(pp.fechaInicio) = ?
      ORDER BY pp.fechaInicio DESC
    `;

    const connection = await pool.getConnection();
    try {
      const [procesos] = await connection.execute(sql, [año, mes]);
      
      const resumen = {
        año,
        mes,
        nombreMes: this.obtenerNombreMes(mes),
        totalProcesos: procesos.length,
        estados: {},
        totalGramos: 0,
        valorEstimado: 0
      };

      procesos.forEach(proceso => {
        const estado = proceso.estadoActual;
        
        if (!resumen.estados[estado]) {
          resumen.estados[estado] = {
            cantidad: 0,
            gramos: 0,
            valor: 0
          };
        }
        
        resumen.estados[estado].cantidad++;
        resumen.estados[estado].gramos += proceso.cantidadGramos;
        resumen.estados[estado].valor += (proceso.cantidadGramos * proceso.Precio) / 1000;
        
        resumen.totalGramos += proceso.cantidadGramos;
        resumen.valorEstimado += (proceso.cantidadGramos * proceso.Precio) / 1000;
      });

      return {
        resumen,
        procesos: procesos.map(p => ({
          idProceso: p.idProceso,
          tipoGrano: p.tipoGrano,
          region: p.region,
          cantidadGramos: p.cantidadGramos,
          estadoActual: p.estadoActual,
          fechaInicio: p.fechaInicio,
          diasEnProceso: p.diasEnProceso,
          observaciones: p.observaciones
        }))
      };
    } finally {
      connection.release();
    }
  }

  // Obtener estados disponibles
  obtenerEstados() {
    return this.estados;
  }

  // Validar si un estado es válido
  esEstadoValido(estado) {
    return Object.values(this.estados).includes(estado);
  }
}

module.exports = ProcesoProduccion;
