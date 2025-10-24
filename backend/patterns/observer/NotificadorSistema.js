/**
 * Patrón Observer: Observador Concreto - NotificadorSistema
 * Registra eventos del sistema en logs y bases de datos
 * Principio SOLID: Single Responsibility Principle (SRP)
 */

const Observer = require('./Observer');

class NotificadorSistema extends Observer {
  constructor(nombre = 'Sistema') {
    super();
    this.nombre = nombre;
    this.logs = [];
    this.eventosRegistrados = 0;
  }

  /**
   * Recibe y registra notificaciones del sistema
   * @param {Object} data - Datos del evento
   */
  actualizar(data) {
    const { tipo, grano, cantidadActual, umbralRestock, fecha } = data;

    const log = {
      timestamp: fecha || new Date(),
      tipo,
      idGrano: grano.idGranos,
      tipoGrano: grano.TipoGrano,
      cantidadActual,
      umbralRestock,
      porcentajeStock: ((cantidadActual / umbralRestock) * 100).toFixed(2),
      severidad: this.determinarSeveridad(cantidadActual, umbralRestock)
    };

    this.logs.push(log);
    this.eventosRegistrados++;

    console.log(`
📝 [SISTEMA] Log registrado:
   Tipo: ${log.tipo}
   Grano: ${log.tipoGrano} (ID: ${log.idGrano})
   Stock: ${log.cantidadActual}g / ${log.umbralRestock}g (${log.porcentajeStock}%)
   Severidad: ${log.severidad}
   Timestamp: ${log.timestamp.toISOString()}
    `);

    // Guardar en archivo de logs (simulado)
    this.guardarEnArchivo(log);
  }

  /**
   * Determina la severidad del evento
   * @param {number} cantidadActual
   * @param {number} umbralRestock
   * @returns {string}
   */
  determinarSeveridad(cantidadActual, umbralRestock) {
    const porcentaje = (cantidadActual / umbralRestock) * 100;

    if (porcentaje <= 10) return 'CRITICAL';
    if (porcentaje <= 30) return 'WARNING';
    if (porcentaje <= 50) return 'INFO';
    return 'DEBUG';
  }

  /**
   * Simula guardar log en archivo
   * @param {Object} log
   */
  guardarEnArchivo(log) {
    // En producción, esto escribiría en un archivo real o base de datos
    console.log(`💾 Log guardado en archivo del sistema`);
  }

  /**
   * Obtiene el nombre del observador
   * @returns {string}
   */
  obtenerNombre() {
    return `NotificadorSistema: ${this.nombre}`;
  }

  /**
   * Obtiene los logs registrados
   * @param {string} severidad - Filtrar por severidad (opcional)
   * @returns {Array}
   */
  obtenerLogs(severidad = null) {
    if (severidad) {
      return this.logs.filter(log => log.severidad === severidad);
    }
    return [...this.logs];
  }

  /**
   * Obtiene estadísticas de eventos
   * @returns {Object}
   */
  obtenerEstadisticas() {
    const porSeveridad = this.logs.reduce((acc, log) => {
      acc[log.severidad] = (acc[log.severidad] || 0) + 1;
      return acc;
    }, {});

    return {
      totalEventos: this.eventosRegistrados,
      porSeveridad,
      ultimoEvento: this.logs[this.logs.length - 1] || null
    };
  }

  /**
   * Limpia logs antiguos
   * @param {number} dias - Mantener logs de los últimos X días
   */
  limpiarLogsAntiguos(dias = 30) {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - dias);

    const logsOriginales = this.logs.length;
    this.logs = this.logs.filter(log => new Date(log.timestamp) >= fechaLimite);
    const logsEliminados = logsOriginales - this.logs.length;

    console.log(`🗑️ Logs limpiados: ${logsEliminados} registros eliminados`);
    return logsEliminados;
  }
}

module.exports = NotificadorSistema;

