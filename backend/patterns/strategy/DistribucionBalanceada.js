/**
 * Patrón Strategy: Estrategia Concreta - Distribución Balanceada
 * Equilibrio entre costo y velocidad
 * Principio SOLID: Single Responsibility Principle (SRP)
 */

const EstrategiaDistribucion = require('./EstrategiaDistribucion');

class DistribucionBalanceada extends EstrategiaDistribucion {
  constructor() {
    super();
    this.nombre = 'Distribución Balanceada';
    this.descripcion = 'Equilibrio óptimo entre costo y tiempo';
    this.costoPorKm = 1.5; // USD por kilómetro
    this.costoBase = 8; // USD base
    this.velocidadPromedio = 50; // km/h
    this.tiempoPreparacion = 2; // horas
  }

  /**
   * Calcula el costo de distribución balanceada
   * @param {Object} pedido
   * @returns {number}
   */
  calcularCosto(pedido) {
    const { distanciaKm = 10, peso = 1, prioridad = 'normal' } = pedido;

    // Costo base + costo por distancia
    let costo = this.costoBase + (distanciaKm * this.costoPorKm);

    // Recargo balanceado por peso
    if (peso > 1.5) {
      costo += (peso - 1.5) * 3;
    }

    // Ajuste por prioridad
    if (prioridad === 'alta') {
      costo *= 1.2; // 20% adicional
    } else if (prioridad === 'baja') {
      costo *= 0.9; // 10% descuento
    }

    // Descuento por distancia media-larga
    if (distanciaKm > 30 && distanciaKm <= 80) {
      costo *= 0.95; // 5% descuento
    }

    return parseFloat(costo.toFixed(2));
  }

  /**
   * Calcula el tiempo estimado de entrega
   * @param {Object} pedido
   * @returns {number} Tiempo en horas
   */
  calcularTiempoEntrega(pedido) {
    const { distanciaKm = 10, prioridad = 'normal' } = pedido;

    // Tiempo de preparación + tiempo de viaje
    let tiempoViaje = distanciaKm / this.velocidadPromedio;
    let tiempoTotal = this.tiempoPreparacion + tiempoViaje;

    // Ajuste por prioridad
    if (prioridad === 'alta') {
      tiempoTotal *= 0.85; // 15% más rápido
    } else if (prioridad === 'baja') {
      tiempoTotal *= 1.15; // 15% más lento
    }

    return parseFloat(tiempoTotal.toFixed(2));
  }

  /**
   * Obtiene el nombre de la estrategia
   * @returns {string}
   */
  obtenerNombre() {
    return this.nombre;
  }

  /**
   * Obtiene la descripción de la estrategia
   * @returns {string}
   */
  obtenerDescripcion() {
    return this.descripcion;
  }

  /**
   * Valida si la estrategia es aplicable
   * @param {Object} pedido
   * @returns {boolean}
   */
  esAplicable(pedido) {
    const { distanciaKm = 10 } = pedido;
    // Aplicable para distancias medias
    return distanciaKm >= 5 && distanciaKm <= 150;
  }

  /**
   * Obtiene información adicional sobre la entrega
   * @param {Object} pedido
   * @returns {Object}
   */
  obtenerDetallesEntrega(pedido) {
    const detallesBase = super.obtenerDetallesEntrega(pedido);
    
    return {
      ...detallesBase,
      caracteristicas: [
        '⚖️ Balance costo-tiempo',
        '📦 Seguimiento estándar',
        '🚚 Ruta semi-directa',
        '✅ Confiabilidad garantizada',
        '🎯 Flexible y adaptable'
      ],
      ventajas: [
        'Mejor relación calidad-precio',
        'Tiempo razonable',
        'Opciones de prioridad'
      ],
      recomendadoPara: [
        'Mayoría de envíos',
        'Distancias medias',
        'Clientes regulares'
      ]
    };
  }
}

module.exports = DistribucionBalanceada;

