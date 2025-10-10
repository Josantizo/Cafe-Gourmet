const LoteCompleto = require('./operaciones/LoteCompleto');
const ProcesoEspecial = require('./operaciones/ProcesoEspecial');
const Tostado = require('./operaciones/Tostado');
const Molido = require('./operaciones/Molido');
const Envasado = require('./operaciones/Envasado');

/**
 * Gestor de operaciones usando el patrón Composite
 * Integra con el sistema de producción existente
 */
class GestorOperacionesComposite {
  constructor() {
    this.operacionesDisponibles = {
      'lote_completo': LoteCompleto,
      'proceso_especial': ProcesoEspecial,
      'tostado': Tostado,
      'molido': Molido,
      'envasado': Envasado
    };
    
    this.operacionesEnEjecucion = new Map();
    this.historialOperaciones = [];
  }

  /**
   * Crea una nueva operación
   * @param {string} tipoOperacion - Tipo de operación
   * @param {Object} configuracion - Configuración específica
   * @returns {OperacionProduccion} Instancia de la operación
   */
  crearOperacion(tipoOperacion, configuracion = {}) {
    const OperacionClase = this.operacionesDisponibles[tipoOperacion];
    
    if (!OperacionClase) {
      throw new Error(`Tipo de operación no válido: ${tipoOperacion}`);
    }
    
    let operacion;
    
    if (tipoOperacion === 'proceso_especial') {
      operacion = new OperacionClase(configuracion.tipoProceso || 'premium');
    } else {
      operacion = new OperacionClase();
    }
    
    // Agregar ID único
    operacion.id = this.generarIdUnico();
    operacion.fechaCreacion = new Date();
    
    return operacion;
  }

  /**
   * Ejecuta una operación
   * @param {string} idOperacion - ID de la operación
   * @param {Object} contexto - Contexto de producción
   * @returns {Promise<Object>} Resultado de la operación
   */
  async ejecutarOperacion(idOperacion, contexto) {
    const operacion = this.operacionesEnEjecucion.get(idOperacion);
    
    if (!operacion) {
      throw new Error(`Operación no encontrada: ${idOperacion}`);
    }
    
    try {
      // Validar operación antes de ejecutar
      const validacion = operacion.validar(contexto);
      if (!validacion.valida) {
        throw new Error(`Validación fallida: ${validacion.errores.join(', ')}`);
      }
      
      // Ejecutar operación
      const resultado = await operacion.ejecutar(contexto);
      
      // Registrar en historial
      this.registrarEnHistorial(operacion, contexto, resultado);
      
      return resultado;
    } catch (error) {
      // Registrar error en historial
      this.registrarErrorEnHistorial(operacion, contexto, error);
      throw error;
    }
  }

  /**
   * Programa una operación para ejecución
   * @param {OperacionProduccion} operacion - Operación a programar
   * @param {Object} contexto - Contexto de producción
   * @returns {string} ID de la operación programada
   */
  programarOperacion(operacion, contexto) {
    const idOperacion = operacion.id;
    
    // Validar operación
    const validacion = operacion.validar(contexto);
    if (!validacion.valida) {
      throw new Error(`Validación fallida: ${validacion.errores.join(', ')}`);
    }
    
    // Agregar a operaciones en ejecución
    this.operacionesEnEjecucion.set(idOperacion, {
      operacion,
      contexto,
      estado: 'programada',
      fechaProgramacion: new Date()
    });
    
    return idOperacion;
  }

  /**
   * Obtiene el estado de una operación
   * @param {string} idOperacion - ID de la operación
   * @returns {Object} Estado de la operación
   */
  obtenerEstadoOperacion(idOperacion) {
    const operacionProgramada = this.operacionesEnEjecucion.get(idOperacion);
    
    if (!operacionProgramada) {
      throw new Error(`Operación no encontrada: ${idOperacion}`);
    }
    
    const { operacion, contexto, estado, fechaProgramacion } = operacionProgramada;
    
    return {
      id: idOperacion,
      nombre: operacion.nombre,
      estado: estado,
      fechaProgramacion: fechaProgramacion,
      fechaInicio: operacion.fechaInicio,
      fechaFin: operacion.fechaFin,
      tiempoEstimado: operacion.obtenerTiempoEstimado(),
      costoEstimado: operacion.obtenerCostoEstimado(),
      progreso: operacion.obtenerProgreso ? operacion.obtenerProgreso() : null,
      informacion: operacion.obtenerInformacion()
    };
  }

  /**
   * Obtiene todas las operaciones programadas
   * @returns {Array<Object>} Lista de operaciones programadas
   */
  obtenerOperacionesProgramadas() {
    const operaciones = [];
    
    this.operacionesEnEjecucion.forEach((operacionProgramada, id) => {
      operaciones.push(this.obtenerEstadoOperacion(id));
    });
    
    return operaciones;
  }

  /**
   * Cancela una operación programada
   * @param {string} idOperacion - ID de la operación
   * @returns {boolean} True si se canceló exitosamente
   */
  cancelarOperacion(idOperacion) {
    const operacionProgramada = this.operacionesEnEjecucion.get(idOperacion);
    
    if (!operacionProgramada) {
      return false;
    }
    
    const { operacion } = operacionProgramada;
    
    // Solo se puede cancelar si no está en progreso
    if (operacion.estado === 'en_progreso') {
      throw new Error('No se puede cancelar una operación en progreso');
    }
    
    // Remover de operaciones en ejecución
    this.operacionesEnEjecucion.delete(idOperacion);
    
    // Registrar cancelación en historial
    this.registrarCancelacionEnHistorial(operacion);
    
    return true;
  }

  /**
   * Obtiene el historial de operaciones
   * @param {Object} filtros - Filtros para el historial
   * @returns {Array<Object>} Historial filtrado
   */
  obtenerHistorial(filtros = {}) {
    let historial = [...this.historialOperaciones];
    
    // Aplicar filtros
    if (filtros.tipoOperacion) {
      historial = historial.filter(h => h.tipoOperacion === filtros.tipoOperacion);
    }
    
    if (filtros.fechaInicio) {
      historial = historial.filter(h => h.fecha >= filtros.fechaInicio);
    }
    
    if (filtros.fechaFin) {
      historial = historial.filter(h => h.fecha <= filtros.fechaFin);
    }
    
    if (filtros.estado) {
      historial = historial.filter(h => h.estado === filtros.estado);
    }
    
    // Ordenar por fecha descendente
    historial.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    return historial;
  }

  /**
   * Obtiene estadísticas de operaciones
   * @returns {Object} Estadísticas
   */
  obtenerEstadisticas() {
    const totalOperaciones = this.historialOperaciones.length;
    const operacionesExitosas = this.historialOperaciones.filter(h => h.estado === 'completada').length;
    const operacionesFallidas = this.historialOperaciones.filter(h => h.estado === 'fallida').length;
    const operacionesCanceladas = this.historialOperaciones.filter(h => h.estado === 'cancelada').length;
    
    // Estadísticas por tipo de operación
    const estadisticasPorTipo = {};
    this.historialOperaciones.forEach(h => {
      if (!estadisticasPorTipo[h.tipoOperacion]) {
        estadisticasPorTipo[h.tipoOperacion] = {
          total: 0,
          exitosas: 0,
          fallidas: 0,
          canceladas: 0
        };
      }
      
      estadisticasPorTipo[h.tipoOperacion].total++;
      estadisticasPorTipo[h.tipoOperacion][h.estado === 'completada' ? 'exitosas' : 
        h.estado === 'fallida' ? 'fallidas' : 'canceladas']++;
    });
    
    return {
      totalOperaciones,
      operacionesExitosas,
      operacionesFallidas,
      operacionesCanceladas,
      tasaExito: totalOperaciones > 0 ? (operacionesExitosas / totalOperaciones * 100).toFixed(2) : 0,
      estadisticasPorTipo
    };
  }

  /**
   * Genera un ID único para operaciones
   * @returns {string} ID único
   */
  generarIdUnico() {
    return `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Registra una operación en el historial
   * @param {OperacionProduccion} operacion - Operación ejecutada
   * @param {Object} contexto - Contexto de producción
   * @param {Object} resultado - Resultado de la operación
   */
  registrarEnHistorial(operacion, contexto, resultado) {
    const registro = {
      id: operacion.id,
      nombre: operacion.nombre,
      tipoOperacion: operacion.tipoOperacion || 'simple',
      estado: resultado.exito ? 'completada' : 'fallida',
      fecha: new Date(),
      contexto: contexto,
      resultado: resultado,
      tiempoTranscurrido: resultado.tiempoTranscurrido,
      costoReal: resultado.costoReal
    };
    
    this.historialOperaciones.push(registro);
  }

  /**
   * Registra un error en el historial
   * @param {OperacionProduccion} operacion - Operación que falló
   * @param {Object} contexto - Contexto de producción
   * @param {Error} error - Error ocurrido
   */
  registrarErrorEnHistorial(operacion, contexto, error) {
    const registro = {
      id: operacion.id,
      nombre: operacion.nombre,
      tipoOperacion: operacion.tipoOperacion || 'simple',
      estado: 'fallida',
      fecha: new Date(),
      contexto: contexto,
      error: error.message,
      tiempoTranscurrido: operacion.calcularTiempoTranscurrido ? operacion.calcularTiempoTranscurrido() : 0
    };
    
    this.historialOperaciones.push(registro);
  }

  /**
   * Registra una cancelación en el historial
   * @param {OperacionProduccion} operacion - Operación cancelada
   */
  registrarCancelacionEnHistorial(operacion) {
    const registro = {
      id: operacion.id,
      nombre: operacion.nombre,
      tipoOperacion: operacion.tipoOperacion || 'simple',
      estado: 'cancelada',
      fecha: new Date(),
      tiempoTranscurrido: operacion.calcularTiempoTranscurrido ? operacion.calcularTiempoTranscurrido() : 0
    };
    
    this.historialOperaciones.push(registro);
  }

  /**
   * Obtiene los tipos de operaciones disponibles
   * @returns {Array<string>} Tipos de operaciones
   */
  obtenerTiposOperacionesDisponibles() {
    return Object.keys(this.operacionesDisponibles);
  }

  /**
   * Obtiene información detallada de un tipo de operación
   * @param {string} tipoOperacion - Tipo de operación
   * @returns {Object} Información del tipo
   */
  obtenerInformacionTipoOperacion(tipoOperacion) {
    const OperacionClase = this.operacionesDisponibles[tipoOperacion];
    
    if (!OperacionClase) {
      throw new Error(`Tipo de operación no válido: ${tipoOperacion}`);
    }
    
    // Crear instancia temporal para obtener información
    const instanciaTemporal = new OperacionClase();
    
    return {
      tipo: tipoOperacion,
      nombre: instanciaTemporal.nombre,
      descripcion: instanciaTemporal.descripcion,
      tiempoEstimado: instanciaTemporal.obtenerTiempoEstimado(),
      costoEstimado: instanciaTemporal.obtenerCostoEstimado(),
      esCompuesta: instanciaTemporal.tipoOperacion === 'compuesta',
      operacionesHijas: instanciaTemporal.obtenerOperaciones ? 
        instanciaTemporal.obtenerOperaciones().map(op => op.nombre) : null
    };
  }
}

module.exports = GestorOperacionesComposite;
