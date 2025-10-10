const OperacionSimple = require('../OperacionSimple');

/**
 * Operación de tostado de granos de café
 */
class Tostado extends OperacionSimple {
  constructor() {
    super(
      'Tostado',
      'Proceso de tostado de granos de café para desarrollar sabor y aroma',
      30, // 30 minutos
      15.00 // 15 quetzales
    );
  }

  /**
   * Ejecuta la operación específica de tostado
   * @param {Object} contexto - Contexto de producción
   * @returns {Promise<Object>} Resultado del tostado
   */
  async ejecutarOperacionEspecifica(contexto) {
    const { cantidadGramos, tipoGrano } = contexto;
    
    // Simular proceso de tostado
    console.log(`🔥 Iniciando tostado de ${cantidadGramos}g de ${tipoGrano}`);
    
    // Calcular parámetros de tostado según el tipo de grano
    const parametrosTostado = this.calcularParametrosTostado(tipoGrano);
    
    // Simular tiempo de tostado
    await this.simularTostado(parametrosTostado);
    
    // Calcular pérdida de peso durante el tostado
    const perdidaPeso = this.calcularPerdidaPeso(cantidadGramos, parametrosTostado);
    const pesoFinal = cantidadGramos - perdidaPeso;
    
    // Generar resultado
    const resultado = {
      tipoOperacion: 'tostado',
      pesoInicial: cantidadGramos,
      pesoFinal: pesoFinal,
      perdidaPeso: perdidaPeso,
      porcentajePerdida: (perdidaPeso / cantidadGramos * 100).toFixed(2),
      temperaturaMaxima: parametrosTostado.temperaturaMaxima,
      tiempoTostado: parametrosTostado.tiempoTostado,
      nivelTostado: parametrosTostado.nivelTostado,
      calidad: this.evaluarCalidadTostado(parametrosTostado, perdidaPeso)
    };
    
    console.log(`✅ Tostado completado: ${pesoFinal}g (${resultado.porcentajePerdida}% pérdida)`);
    
    return resultado;
  }

  /**
   * Calcula los parámetros de tostado según el tipo de grano
   * @param {string} tipoGrano - Tipo de grano
   * @returns {Object} Parámetros de tostado
   */
  calcularParametrosTostado(tipoGrano) {
    const parametros = {
      'Arabico': {
        temperaturaMaxima: 205,
        tiempoTostado: 12,
        nivelTostado: 'medio'
      },
      'Bourbon': {
        temperaturaMaxima: 200,
        tiempoTostado: 10,
        nivelTostado: 'medio-claro'
      },
      'Catuai': {
        temperaturaMaxima: 210,
        tiempoTostado: 14,
        nivelTostado: 'medio-oscuro'
      }
    };
    
    return parametros[tipoGrano] || parametros['Arabico'];
  }

  /**
   * Simula el proceso de tostado
   * @param {Object} parametros - Parámetros de tostado
   * @returns {Promise<void>}
   */
  async simularTostado(parametros) {
    const tiempoSimulacion = Math.min(parametros.tiempoTostado * 1000, 5000); // Máximo 5 segundos
    return new Promise(resolve => setTimeout(resolve, tiempoSimulacion));
  }

  /**
   * Calcula la pérdida de peso durante el tostado
   * @param {number} pesoInicial - Peso inicial en gramos
   * @param {Object} parametros - Parámetros de tostado
   * @returns {number} Pérdida de peso en gramos
   */
  calcularPerdidaPeso(pesoInicial, parametros) {
    // La pérdida de peso varía según el nivel de tostado
    const factoresPerdida = {
      'claro': 0.12,
      'medio-claro': 0.15,
      'medio': 0.18,
      'medio-oscuro': 0.21,
      'oscuro': 0.24
    };
    
    const factorPerdida = factoresPerdida[parametros.nivelTostado] || 0.18;
    return Math.round(pesoInicial * factorPerdida);
  }

  /**
   * Evalúa la calidad del tostado
   * @param {Object} parametros - Parámetros de tostado
   * @param {number} perdidaPeso - Pérdida de peso
   * @returns {string} Calidad del tostado
   */
  evaluarCalidadTostado(parametros, perdidaPeso) {
    // Evaluar calidad basada en parámetros y pérdida de peso
    const perdidaPorcentaje = perdidaPeso / 1000 * 100; // Asumiendo 1000g base
    
    if (perdidaPorcentaje >= 15 && perdidaPorcentaje <= 25) {
      return 'excelente';
    } else if (perdidaPorcentaje >= 10 && perdidaPorcentaje <= 30) {
      return 'buena';
    } else {
      return 'regular';
    }
  }

  /**
   * Valida si el tostado puede ejecutarse
   * @param {Object} contexto - Contexto de producción
   * @returns {Object} Resultado de validación
   */
  validar(contexto) {
    const validacionBase = super.validar(contexto);
    
    if (!validacionBase.valida) {
      return validacionBase;
    }
    
    const errores = [];
    
    // Validaciones específicas del tostado
    if (contexto.cantidadGramos < 100) {
      errores.push('Cantidad mínima para tostado: 100g');
    }
    
    if (contexto.cantidadGramos > 5000) {
      errores.push('Cantidad máxima para tostado: 5000g');
    }
    
    const tiposValidos = ['Arabico', 'Bourbon', 'Catuai'];
    if (!tiposValidos.includes(contexto.tipoGrano)) {
      errores.push(`Tipo de grano no válido. Tipos válidos: ${tiposValidos.join(', ')}`);
    }
    
    return {
      valida: errores.length === 0,
      errores: [...validacionBase.errores, ...errores]
    };
  }
}

module.exports = Tostado;
