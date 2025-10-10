const OperacionProduccion = require('./OperacionProduccion');

/**
 * Operación simple de producción - hoja del patrón Composite
 * Representa una operación individual que no puede dividirse
 */
class OperacionSimple extends OperacionProduccion {
  constructor(nombre, descripcion, tiempoEstimado, costoEstimado) {
    super(nombre, descripcion);
    this.tiempoEstimado = tiempoEstimado;
    this.costoEstimado = costoEstimado;
    this.tipoOperacion = 'simple';
  }

  /**
   * Ejecuta la operación simple
   * @param {Object} contexto - Contexto de producción
   * @returns {Promise<Object>} Resultado de la operación
   */
  async ejecutar(contexto) {
    try {
      this.actualizarEstado('en_progreso', 'Iniciando operación simple');
      
      // Simular tiempo de procesamiento
      await this.simularProcesamiento();
      
      // Ejecutar la lógica específica de la operación
      const resultado = await this.ejecutarOperacionEspecifica(contexto);
      
      this.actualizarEstado('completada', 'Operación simple completada exitosamente');
      
      return {
        exito: true,
        operacion: this.nombre,
        resultado: resultado,
        tiempoTranscurrido: this.calcularTiempoTranscurrido(),
        costoReal: this.calcularCostoReal(contexto)
      };
    } catch (error) {
      this.actualizarEstado('fallida', `Error en operación simple: ${error.message}`);
      throw error;
    }
  }

  /**
   * Ejecuta la lógica específica de cada operación simple
   * Debe ser implementado por las clases hijas
   * @param {Object} contexto - Contexto de producción
   * @returns {Promise<Object>} Resultado específico
   */
  async ejecutarOperacionEspecifica(contexto) {
    throw new Error('Método ejecutarOperacionEspecifica debe ser implementado por las clases hijas');
  }

  /**
   * Simula el tiempo de procesamiento de la operación
   * @returns {Promise<void>}
   */
  async simularProcesamiento() {
    const tiempoMs = this.tiempoEstimado * 1000; // Convertir minutos a milisegundos
    return new Promise(resolve => setTimeout(resolve, tiempoMs));
  }

  /**
   * Calcula el tiempo transcurrido en la operación
   * @returns {number} Tiempo en minutos
   */
  calcularTiempoTranscurrido() {
    if (!this.fechaInicio) return 0;
    
    const fechaFin = this.fechaFin || new Date();
    const diferenciaMs = fechaFin - this.fechaInicio;
    return Math.round(diferenciaMs / (1000 * 60)); // Convertir a minutos
  }

  /**
   * Calcula el costo real de la operación
   * @param {Object} contexto - Contexto de producción
   * @returns {number} Costo real en quetzales
   */
  calcularCostoReal(contexto) {
    // El costo real puede variar según la cantidad procesada
    const factorCantidad = contexto.cantidadGramos / 1000; // Factor por cada 1000g
    return this.costoEstimado * factorCantidad;
  }

  /**
   * Valida si la operación simple puede ejecutarse
   * @param {Object} contexto - Contexto de producción
   * @returns {Object} Resultado de validación
   */
  validar(contexto) {
    const errores = [];
    
    if (!contexto.cantidadGramos || contexto.cantidadGramos <= 0) {
      errores.push('Cantidad de gramos debe ser mayor a 0');
    }
    
    if (!contexto.tipoGrano) {
      errores.push('Tipo de grano es requerido');
    }
    
    if (this.estado === 'en_progreso') {
      errores.push('La operación ya está en progreso');
    }
    
    if (this.estado === 'completada') {
      errores.push('La operación ya fue completada');
    }
    
    return {
      valida: errores.length === 0,
      errores
    };
  }

  /**
   * Obtiene información detallada de la operación simple
   * @returns {Object} Información completa
   */
  obtenerInformacion() {
    return {
      ...super.obtenerInformacion(),
      tipoOperacion: this.tipoOperacion,
      tiempoTranscurrido: this.calcularTiempoTranscurrido(),
      esOperacionSimple: true
    };
  }
}

module.exports = OperacionSimple;
