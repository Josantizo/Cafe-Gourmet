/**
 * Interfaz base para operaciones de producción usando el patrón Composite
 * Define la estructura común para operaciones simples y compuestas
 */
class OperacionProduccion {
  constructor(nombre, descripcion = '') {
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.tiempoEstimado = 0; // en minutos
    this.costoEstimado = 0; // en quetzales
    this.estado = 'pendiente'; // pendiente, en_progreso, completada, fallida
    this.fechaInicio = null;
    this.fechaFin = null;
    this.observaciones = '';
  }

  /**
   * Ejecuta la operación
   * @param {Object} contexto - Contexto de producción (granos, cantidad, etc.)
   * @returns {Promise<Object>} Resultado de la operación
   */
  async ejecutar(contexto) {
    throw new Error('Método ejecutar debe ser implementado por las clases hijas');
  }

  /**
   * Obtiene el tiempo total estimado de la operación
   * @returns {number} Tiempo en minutos
   */
  obtenerTiempoEstimado() {
    return this.tiempoEstimado;
  }

  /**
   * Obtiene el costo total estimado de la operación
   * @returns {number} Costo en quetzales
   */
  obtenerCostoEstimado() {
    return this.costoEstimado;
  }

  /**
   * Obtiene información detallada de la operación
   * @returns {Object} Información completa
   */
  obtenerInformacion() {
    return {
      nombre: this.nombre,
      descripcion: this.descripcion,
      tiempoEstimado: this.tiempoEstimado,
      costoEstimado: this.costoEstimado,
      estado: this.estado,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      observaciones: this.observaciones
    };
  }

  /**
   * Valida si la operación puede ejecutarse
   * @param {Object} contexto - Contexto de producción
   * @returns {Object} Resultado de validación
   */
  validar(contexto) {
    return {
      valida: true,
      errores: []
    };
  }

  /**
   * Actualiza el estado de la operación
   * @param {string} nuevoEstado - Nuevo estado
   * @param {string} observaciones - Observaciones adicionales
   */
  actualizarEstado(nuevoEstado, observaciones = '') {
    this.estado = nuevoEstado;
    this.observaciones = observaciones;
    
    if (nuevoEstado === 'en_progreso' && !this.fechaInicio) {
      this.fechaInicio = new Date();
    }
    
    if (nuevoEstado === 'completada' || nuevoEstado === 'fallida') {
      this.fechaFin = new Date();
    }
  }
}

module.exports = OperacionProduccion;
