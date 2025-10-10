const OperacionSimple = require('../OperacionSimple');

/**
 * Operación de envasado de café molido
 */
class Envasado extends OperacionSimple {
  constructor() {
    super(
      'Envasado',
      'Proceso de envasado de café molido en paquetes para venta',
      20, // 20 minutos
      12.00 // 12 quetzales
    );
  }

  /**
   * Ejecuta la operación específica de envasado
   * @param {Object} contexto - Contexto de producción
   * @returns {Promise<Object>} Resultado del envasado
   */
  async ejecutarOperacionEspecifica(contexto) {
    const { cantidadGramos, tipoGrano } = contexto;
    
    // Simular proceso de envasado
    console.log(`📦 Iniciando envasado de ${cantidadGramos}g de ${tipoGrano} molido`);
    
    // Determinar tipo de empaque según la cantidad
    const tipoEmpaque = this.determinarTipoEmpaque(cantidadGramos);
    
    // Simular tiempo de envasado
    await this.simularEnvasado(tipoEmpaque);
    
    // Calcular cantidad de paquetes
    const cantidadPaquetes = this.calcularCantidadPaquetes(cantidadGramos, tipoEmpaque);
    
    // Generar resultado
    const resultado = {
      tipoOperacion: 'envasado',
      pesoInicial: cantidadGramos,
      pesoFinal: cantidadGramos, // No hay pérdida en envasado
      perdidaPeso: 0,
      porcentajePerdida: 0,
      tipoEmpaque: tipoEmpaque.tipo,
      cantidadPaquetes: cantidadPaquetes,
      pesoPorPaquete: tipoEmpaque.pesoPorPaquete,
      tiempoEnvasado: tipoEmpaque.tiempoEnvasado,
      calidad: this.evaluarCalidadEnvasado(tipoEmpaque, cantidadPaquetes),
      fechaVencimiento: this.calcularFechaVencimiento(contexto.fechaVencimiento)
    };
    
    console.log(`✅ Envasado completado: ${cantidadPaquetes} paquetes de ${tipoEmpaque.pesoPorPaquete}g`);
    
    return resultado;
  }

  /**
   * Determina el tipo de empaque según la cantidad
   * @param {number} cantidadGramos - Cantidad en gramos
   * @returns {Object} Parámetros de empaque
   */
  determinarTipoEmpaque(cantidadGramos) {
    if (cantidadGramos <= 250) {
      return {
        tipo: 'bolsa_pequena',
        pesoPorPaquete: 250,
        tiempoEnvasado: 15,
        material: 'papel_aluminio'
      };
    } else if (cantidadGramos <= 500) {
      return {
        tipo: 'bolsa_mediana',
        pesoPorPaquete: 500,
        tiempoEnvasado: 20,
        material: 'papel_aluminio'
      };
    } else if (cantidadGramos <= 1000) {
      return {
        tipo: 'bolsa_grande',
        pesoPorPaquete: 1000,
        tiempoEnvasado: 25,
        material: 'papel_aluminio'
      };
    } else {
      return {
        tipo: 'caja_multiple',
        pesoPorPaquete: 500,
        tiempoEnvasado: 30,
        material: 'carton'
      };
    }
  }

  /**
   * Simula el proceso de envasado
   * @param {Object} tipoEmpaque - Parámetros de empaque
   * @returns {Promise<void>}
   */
  async simularEnvasado(tipoEmpaque) {
    const tiempoSimulacion = Math.min(tipoEmpaque.tiempoEnvasado * 1000, 4000); // Máximo 4 segundos
    return new Promise(resolve => setTimeout(resolve, tiempoSimulacion));
  }

  /**
   * Calcula la cantidad de paquetes necesarios
   * @param {number} cantidadGramos - Cantidad total en gramos
   * @param {Object} tipoEmpaque - Parámetros de empaque
   * @returns {number} Cantidad de paquetes
   */
  calcularCantidadPaquetes(cantidadGramos, tipoEmpaque) {
    return Math.ceil(cantidadGramos / tipoEmpaque.pesoPorPaquete);
  }

  /**
   * Evalúa la calidad del envasado
   * @param {Object} tipoEmpaque - Parámetros de empaque
   * @param {number} cantidadPaquetes - Cantidad de paquetes
   * @returns {string} Calidad del envasado
   */
  evaluarCalidadEnvasado(tipoEmpaque, cantidadPaquetes) {
    // La calidad depende del tipo de empaque y cantidad
    if (tipoEmpaque.material === 'papel_aluminio' && cantidadPaquetes <= 10) {
      return 'excelente';
    } else if (tipoEmpaque.material === 'papel_aluminio' && cantidadPaquetes <= 20) {
      return 'buena';
    } else {
      return 'regular';
    }
  }

  /**
   * Calcula la fecha de vencimiento
   * @param {string} fechaVencimiento - Fecha de vencimiento original
   * @returns {string} Fecha de vencimiento calculada
   */
  calcularFechaVencimiento(fechaVencimiento) {
    if (fechaVencimiento) {
      return fechaVencimiento;
    }
    
    // Por defecto, 6 meses desde hoy
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth() + 6);
    return fecha.toISOString().split('T')[0];
  }

  /**
   * Valida si el envasado puede ejecutarse
   * @param {Object} contexto - Contexto de producción
   * @returns {Object} Resultado de validación
   */
  validar(contexto) {
    const validacionBase = super.validar(contexto);
    
    if (!validacionBase.valida) {
      return validacionBase;
    }
    
    const errores = [];
    
    // Validaciones específicas del envasado
    if (contexto.cantidadGramos < 100) {
      errores.push('Cantidad mínima para envasado: 100g');
    }
    
    if (contexto.cantidadGramos > 10000) {
      errores.push('Cantidad máxima para envasado: 10000g');
    }
    
    // Validar que el café esté molido
    if (contexto.estadoAnterior !== 'molido') {
      errores.push('El café debe estar molido antes del envasado');
    }
    
    return {
      valida: errores.length === 0,
      errores: [...validacionBase.errores, ...errores]
    };
  }
}

module.exports = Envasado;
