const OperacionCompuesta = require('../OperacionCompuesta');
const Tostado = require('./Tostado');
const Molido = require('./Molido');
const Envasado = require('./Envasado');

/**
 * Operación compuesta para procesos especiales de café
 * Permite configurar operaciones personalizadas según el tipo de proceso
 */
class ProcesoEspecial extends OperacionCompuesta {
  constructor(tipoProceso = 'premium') {
    super(
      `Proceso Especial - ${tipoProceso}`,
      `Proceso especializado de producción de café tipo ${tipoProceso}`
    );
    
    this.tipoProceso = tipoProceso;
    this.configuracionEspecial = this.obtenerConfiguracionEspecial(tipoProceso);
    
    // Inicializar operaciones según el tipo de proceso
    this.inicializarOperacionesEspeciales();
  }

  /**
   * Obtiene la configuración especial según el tipo de proceso
   * @param {string} tipoProceso - Tipo de proceso especial
   * @returns {Object} Configuración especial
   */
  obtenerConfiguracionEspecial(tipoProceso) {
    const configuraciones = {
      'premium': {
        descripcion: 'Proceso premium con control de calidad estricto',
        tiempoExtra: 15,
        costoExtra: 20.00,
        validacionesEstrictas: true,
        operaciones: ['tostado', 'molido', 'envasado']
      },
      'express': {
        descripcion: 'Proceso express para producción rápida',
        tiempoExtra: -10,
        costoExtra: -5.00,
        validacionesEstrictas: false,
        operaciones: ['tostado', 'molido', 'envasado']
      },
      'artesanal': {
        descripcion: 'Proceso artesanal con técnicas tradicionales',
        tiempoExtra: 30,
        costoExtra: 25.00,
        validacionesEstrictas: true,
        operaciones: ['tostado', 'molido', 'envasado']
      },
      'experimental': {
        descripcion: 'Proceso experimental con técnicas innovadoras',
        tiempoExtra: 20,
        costoExtra: 15.00,
        validacionesEstrictas: false,
        operaciones: ['tostado', 'molido', 'envasado']
      }
    };
    
    return configuraciones[tipoProceso] || configuraciones['premium'];
  }

  /**
   * Inicializa las operaciones especiales según el tipo de proceso
   */
  inicializarOperacionesEspeciales() {
    const operaciones = this.configuracionEspecial.operaciones;
    
    operaciones.forEach(tipoOperacion => {
      let operacion;
      
      switch (tipoOperacion) {
        case 'tostado':
          operacion = new Tostado();
          this.aplicarModificacionesEspeciales(operacion, 'tostado');
          break;
        case 'molido':
          operacion = new Molido();
          this.aplicarModificacionesEspeciales(operacion, 'molido');
          break;
        case 'envasado':
          operacion = new Envasado();
          this.aplicarModificacionesEspeciales(operacion, 'envasado');
          break;
      }
      
      if (operacion) {
        this.agregarOperacion(operacion);
      }
    });
  }

  /**
   * Aplica modificaciones especiales a una operación
   * @param {OperacionSimple} operacion - Operación a modificar
   * @param {string} tipoOperacion - Tipo de operación
   */
  aplicarModificacionesEspeciales(operacion, tipoOperacion) {
    switch (this.tipoProceso) {
      case 'premium':
        // Proceso premium: más tiempo y costo para mejor calidad
        operacion.tiempoEstimado += 5;
        operacion.costoEstimado += 3.00;
        operacion.nombre = `${operacion.nombre} Premium`;
        break;
        
      case 'express':
        // Proceso express: menos tiempo y costo
        operacion.tiempoEstimado = Math.max(operacion.tiempoEstimado - 3, 5);
        operacion.costoEstimado = Math.max(operacion.costoEstimado - 2.00, 1.00);
        operacion.nombre = `${operacion.nombre} Express`;
        break;
        
      case 'artesanal':
        // Proceso artesanal: más tiempo para técnicas tradicionales
        operacion.tiempoEstimado += 10;
        operacion.costoEstimado += 5.00;
        operacion.nombre = `${operacion.nombre} Artesanal`;
        break;
        
      case 'experimental':
        // Proceso experimental: tiempo variable
        operacion.tiempoEstimado += 8;
        operacion.costoEstimado += 4.00;
        operacion.nombre = `${operacion.nombre} Experimental`;
        break;
    }
  }

  /**
   * Actualiza el contexto para la siguiente operación
   * @param {Object} contextoActual - Contexto actual
   * @param {Object} resultado - Resultado de la operación anterior
   * @returns {Object} Contexto actualizado
   */
  actualizarContexto(contextoActual, resultado) {
    const contextoActualizado = { ...contextoActual };
    
    // Aplicar lógica base del lote completo
    switch (resultado.tipoOperacion) {
      case 'tostado':
        contextoActualizado.cantidadGramos = resultado.pesoFinal;
        contextoActualizado.estadoAnterior = 'tostado';
        contextoActualizado.calidadTostado = resultado.calidad;
        contextoActualizado.nivelTostado = resultado.nivelTostado;
        break;
        
      case 'molido':
        contextoActualizado.cantidadGramos = resultado.pesoFinal;
        contextoActualizado.estadoAnterior = 'molido';
        contextoActualizado.calidadMolido = resultado.calidad;
        contextoActualizado.grosorMolido = resultado.grosorMolido;
        break;
        
      case 'envasado':
        contextoActualizado.estadoAnterior = 'envasado';
        contextoActualizado.cantidadPaquetes = resultado.cantidadPaquetes;
        contextoActualizado.tipoEmpaque = resultado.tipoEmpaque;
        break;
    }
    
    // Aplicar modificaciones especiales según el tipo de proceso
    this.aplicarModificacionesEspecialesAlContexto(contextoActualizado);
    
    return contextoActualizado;
  }

  /**
   * Aplica modificaciones especiales al contexto
   * @param {Object} contexto - Contexto a modificar
   */
  aplicarModificacionesEspecialesAlContexto(contexto) {
    switch (this.tipoProceso) {
      case 'premium':
        contexto.controlCalidad = 'estricto';
        contexto.tiempoCuarentena = 24; // 24 horas de cuarentena
        break;
        
      case 'express':
        contexto.controlCalidad = 'básico';
        contexto.tiempoCuarentena = 0;
        break;
        
      case 'artesanal':
        contexto.controlCalidad = 'tradicional';
        contexto.tiempoCuarentena = 48; // 48 horas de cuarentena
        contexto.tecnicasTradicionales = true;
        break;
        
      case 'experimental':
        contexto.controlCalidad = 'experimental';
        contexto.tiempoCuarentena = 12; // 12 horas de cuarentena
        contexto.tecnicasInnovadoras = true;
        break;
    }
  }

  /**
   * Determina si debe detener la ejecución en caso de error
   * @param {OperacionProduccion} operacion - Operación que falló
   * @param {Error} error - Error ocurrido
   * @returns {boolean} True si debe detener
   */
  debeDetenerEnError(operacion, error) {
    // En procesos especiales, algunos errores pueden ser tolerados
    if (this.tipoProceso === 'express') {
      // En proceso express, solo errores críticos detienen
      const erroresCriticos = [
        'Cantidad mínima',
        'Tipo de grano no válido'
      ];
      
      return erroresCriticos.some(erroCritico => 
        error.message.includes(erroCritico)
      );
    }
    
    // Para otros procesos, cualquier error detiene
    return true;
  }

  /**
   * Valida si el proceso especial puede ejecutarse
   * @param {Object} contexto - Contexto de producción
   * @returns {Object} Resultado de validación
   */
  validar(contexto) {
    const validacionBase = super.validar(contexto);
    
    if (!validacionBase.valida) {
      return validacionBase;
    }
    
    const errores = [];
    
    // Validaciones específicas del proceso especial
    if (this.configuracionEspecial.validacionesEstrictas) {
      if (contexto.cantidadGramos < 300) {
        errores.push(`Cantidad mínima para proceso ${this.tipoProceso}: 300g`);
      }
      
      if (contexto.cantidadGramos > 2000) {
        errores.push(`Cantidad máxima para proceso ${this.tipoProceso}: 2000g`);
      }
    } else {
      if (contexto.cantidadGramos < 100) {
        errores.push(`Cantidad mínima para proceso ${this.tipoProceso}: 100g`);
      }
      
      if (contexto.cantidadGramos > 5000) {
        errores.push(`Cantidad máxima para proceso ${this.tipoProceso}: 5000g`);
      }
    }
    
    // Validar que el grano esté en estado inicial
    if (contexto.estadoAnterior && contexto.estadoAnterior !== 'cosecha') {
      errores.push('El proceso especial debe iniciarse desde granos en estado cosecha');
    }
    
    return {
      valida: errores.length === 0,
      errores: [...validacionBase.errores, ...errores]
    };
  }

  /**
   * Obtiene información detallada del proceso especial
   * @returns {Object} Información completa
   */
  obtenerInformacion() {
    const informacionBase = super.obtenerInformacion();
    
    return {
      ...informacionBase,
      tipoProceso: this.tipoProceso,
      configuracionEspecial: this.configuracionEspecial,
      operacionesIncluidas: this.configuracionEspecial.operaciones,
      descripcionDetallada: this.configuracionEspecial.descripcion
    };
  }

  /**
   * Calcula el tiempo total estimado del proceso especial
   * @returns {number} Tiempo total en minutos
   */
  obtenerTiempoEstimado() {
    const tiempoBase = super.obtenerTiempoEstimado();
    return tiempoBase + this.configuracionEspecial.tiempoExtra;
  }

  /**
   * Calcula el costo total estimado del proceso especial
   * @returns {number} Costo total en quetzales
   */
  obtenerCostoEstimado() {
    const costoBase = super.obtenerCostoEstimado();
    return costoBase + this.configuracionEspecial.costoExtra;
  }
}

module.exports = ProcesoEspecial;
