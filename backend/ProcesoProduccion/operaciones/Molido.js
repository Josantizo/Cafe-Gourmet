const OperacionSimple = require('../OperacionSimple');

/**
 * Operación de molido de granos de café tostados
 */
class Molido extends OperacionSimple {
  constructor() {
    super(
      'Molido',
      'Proceso de molido de granos tostados para preparar café molido',
      15, // 15 minutos
      8.00 // 8 quetzales
    );
  }

  /**
   * Ejecuta la operación específica de molido
   * @param {Object} contexto - Contexto de producción
   * @returns {Promise<Object>} Resultado del molido
   */
  async ejecutarOperacionEspecifica(contexto) {
    const { cantidadGramos, tipoGrano } = contexto;
    
    // Simular proceso de molido
    console.log(`⚙️ Iniciando molido de ${cantidadGramos}g de ${tipoGrano} tostado`);
    
    // Determinar grosor de molido según el tipo de preparación
    const grosorMolido = this.determinarGrosorMolido(contexto.tipoPreparacion || 'filtro');
    
    // Simular tiempo de molido
    await this.simularMolido(grosorMolido);
    
    // Calcular pérdida de peso durante el molido
    const perdidaPeso = this.calcularPerdidaPeso(cantidadGramos, grosorMolido);
    const pesoFinal = cantidadGramos - perdidaPeso;
    
    // Generar resultado
    const resultado = {
      tipoOperacion: 'molido',
      pesoInicial: cantidadGramos,
      pesoFinal: pesoFinal,
      perdidaPeso: perdidaPeso,
      porcentajePerdida: (perdidaPeso / cantidadGramos * 100).toFixed(2),
      grosorMolido: grosorMolido.grosor,
      tiempoMolido: grosorMolido.tiempoMolido,
      tipoPreparacion: contexto.tipoPreparacion || 'filtro',
      calidad: this.evaluarCalidadMolido(grosorMolido, perdidaPeso),
      uniformidad: this.evaluarUniformidadMolido(grosorMolido)
    };
    
    console.log(`✅ Molido completado: ${pesoFinal}g (${resultado.porcentajePerdida}% pérdida)`);
    
    return resultado;
  }

  /**
   * Determina el grosor de molido según el tipo de preparación
   * @param {string} tipoPreparacion - Tipo de preparación
   * @returns {Object} Parámetros de molido
   */
  determinarGrosorMolido(tipoPreparacion) {
    const parametrosMolido = {
      'espresso': {
        grosor: 'fino',
        tiempoMolido: 8,
        velocidad: 'lenta'
      },
      'filtro': {
        grosor: 'medio',
        tiempoMolido: 12,
        velocidad: 'media'
      },
      'francesa': {
        grosor: 'grueso',
        tiempoMolido: 6,
        velocidad: 'rapida'
      },
      'chemex': {
        grosor: 'medio-grueso',
        tiempoMolido: 10,
        velocidad: 'media'
      },
      'v60': {
        grosor: 'medio-fino',
        tiempoMolido: 9,
        velocidad: 'media'
      }
    };
    
    return parametrosMolido[tipoPreparacion] || parametrosMolido['filtro'];
  }

  /**
   * Simula el proceso de molido
   * @param {Object} grosorMolido - Parámetros de molido
   * @returns {Promise<void>}
   */
  async simularMolido(grosorMolido) {
    const tiempoSimulacion = Math.min(grosorMolido.tiempoMolido * 1000, 3000); // Máximo 3 segundos
    return new Promise(resolve => setTimeout(resolve, tiempoSimulacion));
  }

  /**
   * Calcula la pérdida de peso durante el molido
   * @param {number} pesoInicial - Peso inicial en gramos
   * @param {Object} grosorMolido - Parámetros de molido
   * @returns {number} Pérdida de peso en gramos
   */
  calcularPerdidaPeso(pesoInicial, grosorMolido) {
    // La pérdida de peso varía según el grosor de molido
    const factoresPerdida = {
      'fino': 0.08,
      'medio-fino': 0.06,
      'medio': 0.05,
      'medio-grueso': 0.04,
      'grueso': 0.03
    };
    
    const factorPerdida = factoresPerdida[grosorMolido.grosor] || 0.05;
    return Math.round(pesoInicial * factorPerdida);
  }

  /**
   * Evalúa la calidad del molido
   * @param {Object} grosorMolido - Parámetros de molido
   * @param {number} perdidaPeso - Pérdida de peso
   * @returns {string} Calidad del molido
   */
  evaluarCalidadMolido(grosorMolido, perdidaPeso) {
    // Evaluar calidad basada en parámetros y pérdida de peso
    const perdidaPorcentaje = perdidaPeso / 1000 * 100; // Asumiendo 1000g base
    
    if (perdidaPorcentaje <= 5) {
      return 'excelente';
    } else if (perdidaPorcentaje <= 8) {
      return 'buena';
    } else {
      return 'regular';
    }
  }

  /**
   * Evalúa la uniformidad del molido
   * @param {Object} grosorMolido - Parámetros de molido
   * @returns {string} Uniformidad del molido
   */
  evaluarUniformidadMolido(grosorMolido) {
    // La uniformidad depende de la velocidad de molido
    const uniformidad = {
      'lenta': 'excelente',
      'media': 'buena',
      'rapida': 'regular'
    };
    
    return uniformidad[grosorMolido.velocidad] || 'buena';
  }

  /**
   * Valida si el molido puede ejecutarse
   * @param {Object} contexto - Contexto de producción
   * @returns {Object} Resultado de validación
   */
  validar(contexto) {
    const validacionBase = super.validar(contexto);
    
    if (!validacionBase.valida) {
      return validacionBase;
    }
    
    const errores = [];
    
    // Validaciones específicas del molido
    if (contexto.cantidadGramos < 50) {
      errores.push('Cantidad mínima para molido: 50g');
    }
    
    if (contexto.cantidadGramos > 2000) {
      errores.push('Cantidad máxima para molido: 2000g');
    }
    
    const tiposPreparacionValidos = ['espresso', 'filtro', 'francesa', 'chemex', 'v60'];
    if (contexto.tipoPreparacion && !tiposPreparacionValidos.includes(contexto.tipoPreparacion)) {
      errores.push(`Tipo de preparación no válido. Tipos válidos: ${tiposPreparacionValidos.join(', ')}`);
    }
    
    return {
      valida: errores.length === 0,
      errores: [...validacionBase.errores, ...errores]
    };
  }
}

module.exports = Molido;
