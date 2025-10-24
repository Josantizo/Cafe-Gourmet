/**
 * Patrón Strategy: Estrategia Concreta - Distribución Económica
 * Prioriza el bajo costo sobre la velocidad
 * Principio SOLID: Single Responsibility Principle (SRP)
 */

const EstrategiaDistribucion = require('./EstrategiaDistribucion');

class DistribucionEconomica extends EstrategiaDistribucion {
  constructor() {
    super();
    this.nombre = 'Distribución Económica';
    this.descripcion = 'Entrega estándar con tarifas reducidas';
    this.costoPorKm = 0.8; // USD por kilómetro
    this.costoBase = 5; // USD base
    this.velocidadPromedio = 40; // km/h (incluye múltiples paradas)
    this.tiempoPreparacion = 4; // horas (agrupación de pedidos)
  }

  /**
   * Calcula el costo de distribución económica
   * @param {Object} pedido
   * @returns {number}
   */
  calcularCosto(pedido) {
    const { distanciaKm = 10, peso = 1, volumenM3 = 0.1 } = pedido;

    // Costo base + costo por distancia
    let costo = this.costoBase + (distanciaKm * this.costoPorKm);

    // Recargo mínimo por peso (más económico que distribución rápida)
    if (peso > 2) {
      costo += (peso - 2) * 2; // Solo cobra después de 2kg
    }

    // Descuento por volumen (envíos consolidados)
    if (volumenM3 > 0.5) {
      costo *= 0.95; // 5% de descuento
    }

    // Descuento por distancia larga (economía de escala)
    if (distanciaKm > 50) {
      costo *= 0.85; // 15% de descuento
    }

    return parseFloat(costo.toFixed(2));
  }

  /**
   * Calcula el tiempo estimado de entrega
   * @param {Object} pedido
   * @returns {number} Tiempo en horas
   */
  calcularTiempoEntrega(pedido) {
    const { distanciaKm = 10, esRutaRegular = false } = pedido;

    // Tiempo de preparación (agrupación) + tiempo de viaje
    let tiempoViaje = distanciaKm / this.velocidadPromedio;
    let tiempoTotal = this.tiempoPreparacion + tiempoViaje;

    // Tiempo adicional por múltiples paradas (ruta compartida)
    tiempoTotal += distanciaKm * 0.03; // 3% adicional por paradas

    // Descuento de tiempo si es ruta regular
    if (esRutaRegular) {
      tiempoTotal *= 0.9; // 10% menos tiempo
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
    // La distribución económica está disponible para todos los pedidos
    return true;
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
        '💰 Tarifa económica',
        '📦 Envío consolidado',
        '🌍 Sin límite de distancia',
        '♻️ Ruta optimizada',
        '📊 Eficiencia energética'
      ],
      ventajas: [
        'Costo más bajo',
        'Ideal para envíos no urgentes',
        'Descuentos por volumen'
      ],
      recomendadoPara: [
        'Pedidos programados',
        'Grandes distancias',
        'Envíos masivos'
      ]
    };
  }
}

module.exports = DistribucionEconomica;

