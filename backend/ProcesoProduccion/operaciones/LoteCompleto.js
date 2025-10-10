const OperacionCompuesta = require('../OperacionCompuesta');
const Tostado = require('./Tostado');
const Molido = require('./Molido');
const Envasado = require('./Envasado');

/**
 * Operación compuesta que representa el proceso completo de un lote de café
 * Incluye: Tostado → Molido → Envasado
 */
class LoteCompleto extends OperacionCompuesta {
  constructor() {
    super(
      'Lote Completo',
      'Proceso completo de producción de café: tostado, molido y envasado'
    );
    
    // Crear e inicializar las operaciones del lote
    this.inicializarOperaciones();
  }

  /**
   * Inicializa las operaciones que componen el lote completo
   */
  inicializarOperaciones() {
    // Crear instancias de las operaciones
    const tostado = new Tostado();
    const molido = new Molido();
    const envasado = new Envasado();
    
    // Agregar las operaciones en orden secuencial
    this.agregarOperacion(tostado);
    this.agregarOperacion(molido);
    this.agregarOperacion(envasado);
  }

  /**
   * Actualiza el contexto para la siguiente operación
   * @param {Object} contextoActual - Contexto actual
   * @param {Object} resultado - Resultado de la operación anterior
   * @returns {Object} Contexto actualizado
   */
  actualizarContexto(contextoActual, resultado) {
    const contextoActualizado = { ...contextoActual };
    
    // Actualizar según el tipo de operación anterior
    switch (resultado.tipoOperacion) {
      case 'tostado':
        // Después del tostado, actualizar peso y agregar estado
        contextoActualizado.cantidadGramos = resultado.pesoFinal;
        contextoActualizado.estadoAnterior = 'tostado';
        contextoActualizado.calidadTostado = resultado.calidad;
        contextoActualizado.nivelTostado = resultado.nivelTostado;
        break;
        
      case 'molido':
        // Después del molido, actualizar peso y agregar estado
        contextoActualizado.cantidadGramos = resultado.pesoFinal;
        contextoActualizado.estadoAnterior = 'molido';
        contextoActualizado.calidadMolido = resultado.calidad;
        contextoActualizado.grosorMolido = resultado.grosorMolido;
        break;
        
      case 'envasado':
        // Después del envasado, agregar estado final
        contextoActualizado.estadoAnterior = 'envasado';
        contextoActualizado.cantidadPaquetes = resultado.cantidadPaquetes;
        contextoActualizado.tipoEmpaque = resultado.tipoEmpaque;
        break;
    }
    
    return contextoActualizado;
  }

  /**
   * Determina si debe detener la ejecución en caso de error
   * @param {OperacionProduccion} operacion - Operación que falló
   * @param {Error} error - Error ocurrido
   * @returns {boolean} True si debe detener
   */
  debeDetenerEnError(operacion, error) {
    // En un lote completo, cualquier error crítico debe detener el proceso
    const erroresCriticos = [
      'Cantidad mínima',
      'Tipo de grano no válido',
      'Validación fallida'
    ];
    
    return erroresCriticos.some(erroCritico => 
      error.message.includes(erroCritico)
    );
  }

  /**
   * Valida si el lote completo puede ejecutarse
   * @param {Object} contexto - Contexto de producción
   * @returns {Object} Resultado de validación
   */
  validar(contexto) {
    const validacionBase = super.validar(contexto);
    
    if (!validacionBase.valida) {
      return validacionBase;
    }
    
    const errores = [];
    
    // Validaciones específicas del lote completo
    if (contexto.cantidadGramos < 200) {
      errores.push('Cantidad mínima para lote completo: 200g');
    }
    
    if (contexto.cantidadGramos > 3000) {
      errores.push('Cantidad máxima para lote completo: 3000g');
    }
    
    // Validar que el grano esté en estado inicial
    if (contexto.estadoAnterior && contexto.estadoAnterior !== 'cosecha') {
      errores.push('El lote completo debe iniciarse desde granos en estado cosecha');
    }
    
    // Validar tipo de preparación si se especifica
    if (contexto.tipoPreparacion) {
      const tiposValidos = ['espresso', 'filtro', 'francesa', 'chemex', 'v60'];
      if (!tiposValidos.includes(contexto.tipoPreparacion)) {
        errores.push(`Tipo de preparación no válido. Tipos válidos: ${tiposValidos.join(', ')}`);
      }
    }
    
    return {
      valida: errores.length === 0,
      errores: [...validacionBase.errores, ...errores]
    };
  }

  /**
   * Obtiene información detallada del lote completo
   * @returns {Object} Información completa
   */
  obtenerInformacion() {
    const informacionBase = super.obtenerInformacion();
    
    return {
      ...informacionBase,
      tipoLote: 'completo',
      operacionesIncluidas: ['tostado', 'molido', 'envasado'],
      descripcionDetallada: 'Proceso completo de producción de café desde granos tostados hasta paquetes listos para venta'
    };
  }

  /**
   * Calcula el tiempo total estimado del lote completo
   * @returns {number} Tiempo total en minutos
   */
  obtenerTiempoEstimado() {
    // El tiempo total incluye las operaciones + tiempo de transición
    const tiempoOperaciones = super.obtenerTiempoEstimado();
    const tiempoTransicion = 10; // 10 minutos entre operaciones
    return tiempoOperaciones + tiempoTransicion;
  }

  /**
   * Calcula el costo total estimado del lote completo
   * @returns {number} Costo total en quetzales
   */
  obtenerCostoEstimado() {
    // El costo total incluye las operaciones + costo de materiales
    const costoOperaciones = super.obtenerCostoEstimado();
    const costoMateriales = 5.00; // 5 quetzales por materiales de empaque
    return costoOperaciones + costoMateriales;
  }
}

module.exports = LoteCompleto;
