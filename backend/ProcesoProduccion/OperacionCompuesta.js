const OperacionProduccion = require('./OperacionProduccion');

/**
 * Operación compuesta de producción - nodo del patrón Composite
 * Puede contener múltiples operaciones simples y otras compuestas
 */
class OperacionCompuesta extends OperacionProduccion {
  constructor(nombre, descripcion) {
    super(nombre, descripcion);
    this.operaciones = [];
    this.tipoOperacion = 'compuesta';
  }

  /**
   * Agrega una operación a la operación compuesta
   * @param {OperacionProduccion} operacion - Operación a agregar
   */
  agregarOperacion(operacion) {
    if (!(operacion instanceof OperacionProduccion)) {
      throw new Error('La operación debe ser una instancia de OperacionProduccion');
    }
    
    this.operaciones.push(operacion);
    this.recalcularEstimaciones();
  }

  /**
   * Remueve una operación de la operación compuesta
   * @param {OperacionProduccion} operacion - Operación a remover
   */
  removerOperacion(operacion) {
    const indice = this.operaciones.indexOf(operacion);
    if (indice > -1) {
      this.operaciones.splice(indice, 1);
      this.recalcularEstimaciones();
    }
  }

  /**
   * Obtiene todas las operaciones hijas
   * @returns {Array<OperacionProduccion>} Lista de operaciones
   */
  obtenerOperaciones() {
    return [...this.operaciones];
  }

  /**
   * Ejecuta todas las operaciones de forma secuencial
   * @param {Object} contexto - Contexto de producción
   * @returns {Promise<Object>} Resultado de todas las operaciones
   */
  async ejecutar(contexto) {
    try {
      this.actualizarEstado('en_progreso', 'Iniciando operación compuesta');
      
      const resultados = [];
      const errores = [];
      let contextoActual = { ...contexto };
      
      for (let i = 0; i < this.operaciones.length; i++) {
        const operacion = this.operaciones[i];
        
        try {
          // Validar operación antes de ejecutar
          const validacion = operacion.validar(contextoActual);
          if (!validacion.valida) {
            throw new Error(`Validación fallida: ${validacion.errores.join(', ')}`);
          }
          
          // Ejecutar operación
          const resultado = await operacion.ejecutar(contextoActual);
          resultados.push(resultado);
          
          // Actualizar contexto para la siguiente operación
          contextoActual = this.actualizarContexto(contextoActual, resultado);
          
        } catch (error) {
          errores.push({
            operacion: operacion.nombre,
            error: error.message,
            indice: i
          });
          
          // Decidir si continuar o detener
          if (this.debeDetenerEnError(operacion, error)) {
            break;
          }
        }
      }
      
      // Determinar estado final
      const operacionesExitosas = resultados.length;
      const operacionesFallidas = errores.length;
      const operacionesTotales = this.operaciones.length;
      
      if (operacionesFallidas === 0) {
        this.actualizarEstado('completada', 'Todas las operaciones completadas exitosamente');
      } else if (operacionesExitosas > 0) {
        this.actualizarEstado('completada_parcial', `${operacionesExitosas}/${operacionesTotales} operaciones completadas`);
      } else {
        this.actualizarEstado('fallida', 'Todas las operaciones fallaron');
      }
      
      return {
        exito: operacionesFallidas === 0,
        operacion: this.nombre,
        operacionesTotales,
        operacionesExitosas,
        operacionesFallidas,
        resultados,
        errores,
        tiempoTranscurrido: this.calcularTiempoTranscurrido(),
        costoReal: this.calcularCostoReal(contexto)
      };
      
    } catch (error) {
      this.actualizarEstado('fallida', `Error en operación compuesta: ${error.message}`);
      throw error;
    }
  }

  /**
   * Actualiza el contexto para la siguiente operación
   * @param {Object} contextoActual - Contexto actual
   * @param {Object} resultado - Resultado de la operación anterior
   * @returns {Object} Contexto actualizado
   */
  actualizarContexto(contextoActual, resultado) {
    // Por defecto, mantener el contexto igual
    // Las clases hijas pueden sobrescribir este método
    return contextoActual;
  }

  /**
   * Determina si debe detener la ejecución en caso de error
   * @param {OperacionProduccion} operacion - Operación que falló
   * @param {Error} error - Error ocurrido
   * @returns {boolean} True si debe detener
   */
  debeDetenerEnError(operacion, error) {
    // Por defecto, detener en cualquier error
    // Las clases hijas pueden sobrescribir este comportamiento
    return true;
  }

  /**
   * Recalcula las estimaciones basadas en las operaciones hijas
   */
  recalcularEstimaciones() {
    this.tiempoEstimado = this.operaciones.reduce((total, op) => total + op.obtenerTiempoEstimado(), 0);
    this.costoEstimado = this.operaciones.reduce((total, op) => total + op.obtenerCostoEstimado(), 0);
  }

  /**
   * Calcula el tiempo transcurrido total
   * @returns {number} Tiempo en minutos
   */
  calcularTiempoTranscurrido() {
    if (!this.fechaInicio) return 0;
    
    const fechaFin = this.fechaFin || new Date();
    const diferenciaMs = fechaFin - this.fechaInicio;
    return Math.round(diferenciaMs / (1000 * 60));
  }

  /**
   * Calcula el costo real total
   * @param {Object} contexto - Contexto de producción
   * @returns {number} Costo real en quetzales
   */
  calcularCostoReal(contexto) {
    return this.operaciones.reduce((total, op) => {
      if (op.calcularCostoReal) {
        return total + op.calcularCostoReal(contexto);
      }
      return total + op.obtenerCostoEstimado();
    }, 0);
  }

  /**
   * Valida si la operación compuesta puede ejecutarse
   * @param {Object} contexto - Contexto de producción
   * @returns {Object} Resultado de validación
   */
  validar(contexto) {
    const errores = [];
    
    if (this.operaciones.length === 0) {
      errores.push('La operación compuesta no tiene operaciones hijas');
    }
    
    // Validar cada operación hija
    this.operaciones.forEach((operacion, indice) => {
      const validacion = operacion.validar(contexto);
      if (!validacion.valida) {
        errores.push(`Operación ${indice + 1} (${operacion.nombre}): ${validacion.errores.join(', ')}`);
      }
    });
    
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
   * Obtiene información detallada de la operación compuesta
   * @returns {Object} Información completa
   */
  obtenerInformacion() {
    return {
      ...super.obtenerInformacion(),
      tipoOperacion: this.tipoOperacion,
      cantidadOperaciones: this.operaciones.length,
      operaciones: this.operaciones.map(op => op.obtenerInformacion()),
      tiempoTranscurrido: this.calcularTiempoTranscurrido(),
      esOperacionCompuesta: true
    };
  }

  /**
   * Obtiene el progreso de la operación compuesta
   * @returns {Object} Información del progreso
   */
  obtenerProgreso() {
    const operacionesCompletadas = this.operaciones.filter(op => op.estado === 'completada').length;
    const operacionesEnProgreso = this.operaciones.filter(op => op.estado === 'en_progreso').length;
    const operacionesFallidas = this.operaciones.filter(op => op.estado === 'fallida').length;
    
    return {
      total: this.operaciones.length,
      completadas: operacionesCompletadas,
      enProgreso: operacionesEnProgreso,
      fallidas: operacionesFallidas,
      pendientes: this.operaciones.length - operacionesCompletadas - operacionesEnProgreso - operacionesFallidas,
      porcentajeCompletado: this.operaciones.length > 0 ? 
        Math.round((operacionesCompletadas / this.operaciones.length) * 100) : 0
    };
  }
}

module.exports = OperacionCompuesta;
