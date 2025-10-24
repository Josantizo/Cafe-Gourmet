/**
 * Patrón Strategy: Estrategia Concreta - Distribución Rápida
 * Prioriza la velocidad de entrega sobre el costo
 * Principio SOLID: Single Responsibility Principle (SRP)
 */

const EstrategiaDistribucion = require('./EstrategiaDistribucion');

class DistribucionRapida extends EstrategiaDistribucion {
  constructor() {
    super();
    this.nombre = 'Distribución Rápida';
    this.descripcion = 'Entrega express con mensajería especializada';
    this.costoPorKm = 2.5; // USD por kilómetro
    this.costoBase = 15; // USD base
    this.velocidadPromedio = 60; // km/h
    this.tiempoPreparacion = 1; // hora
  }

  /**
   * Calcula el costo de distribución rápida
   * @param {Object} pedido
   * @returns {number}
   */
  calcularCosto(pedido) {
    const { distanciaKm = 10, peso = 1, esUrgente = false } = pedido;

    // Costo base + costo por distancia
    let costo = this.costoBase + (distanciaKm * this.costoPorKm);

    // Recargo por peso (cada kg adicional después del primero)
    if (peso > 1) {
      costo += (peso - 1) * 5;
    }

    // Recargo urgente (entrega en menos de 2 horas)
    if (esUrgente) {
      costo *= 1.5; // 50% adicional
    }

    // Recargo por distancia larga
    if (distanciaKm > 20) {
      costo *= 1.2; // 20% adicional
    }

    return parseFloat(costo.toFixed(2));
  }

  /**
   * Calcula el tiempo estimado de entrega
   * @param {Object} pedido
   * @returns {number} Tiempo en horas
   */
  calcularTiempoEntrega(pedido) {
    const { distanciaKm = 10, esUrgente = false } = pedido;

    // Tiempo de preparación + tiempo de viaje
    let tiempoViaje = distanciaKm / this.velocidadPromedio;
    let tiempoTotal = this.tiempoPreparacion + tiempoViaje;

    // Si es urgente, se reduce el tiempo de preparación
    if (esUrgente) {
      tiempoTotal = tiempoViaje + 0.5; // 30 minutos de preparación
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
    // La distribución rápida está disponible para distancias menores a 100 km
    return distanciaKm <= 100;
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
        '🚀 Entrega express',
        '📦 Seguimiento en tiempo real',
        '✅ Garantía de puntualidad',
        '🔒 Seguro incluido',
        '📱 Notificaciones SMS'
      ],
      ventajas: [
        'Tiempo de entrega más rápido',
        'Prioridad en la ruta',
        'Mensajero dedicado'
      ],
      recomendadoPara: [
        'Pedidos urgentes',
        'Distancias cortas y medias',
        'Clientes premium'
      ]
    };
  }
}

module.exports = DistribucionRapida;

