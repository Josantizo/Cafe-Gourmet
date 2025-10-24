/**
 * Patrón Strategy: Interfaz de Estrategia
 * Define el contrato para todas las estrategias de distribución
 * Principio SOLID: Interface Segregation Principle (ISP) y Open/Closed Principle (OCP)
 */

class EstrategiaDistribucion {
  /**
   * Calcula el costo de distribución
   * @param {Object} pedido - Información del pedido
   * @returns {number} Costo de distribución
   */
  calcularCosto(pedido) {
    throw new Error('El método calcularCosto() debe ser implementado por las clases derivadas');
  }

  /**
   * Calcula el tiempo estimado de entrega
   * @param {Object} pedido - Información del pedido
   * @returns {number} Tiempo en horas
   */
  calcularTiempoEntrega(pedido) {
    throw new Error('El método calcularTiempoEntrega() debe ser implementado por las clases derivadas');
  }

  /**
   * Obtiene el nombre de la estrategia
   * @returns {string}
   */
  obtenerNombre() {
    throw new Error('El método obtenerNombre() debe ser implementado por las clases derivadas');
  }

  /**
   * Obtiene la descripción de la estrategia
   * @returns {string}
   */
  obtenerDescripcion() {
    throw new Error('El método obtenerDescripcion() debe ser implementado por las clases derivadas');
  }

  /**
   * Valida si la estrategia es aplicable al pedido
   * @param {Object} pedido - Información del pedido
   * @returns {boolean}
   */
  esAplicable(pedido) {
    return true; // Por defecto, todas las estrategias son aplicables
  }

  /**
   * Obtiene información adicional sobre la entrega
   * @param {Object} pedido - Información del pedido
   * @returns {Object}
   */
  obtenerDetallesEntrega(pedido) {
    return {
      nombre: this.obtenerNombre(),
      descripcion: this.obtenerDescripcion(),
      costo: this.calcularCosto(pedido),
      tiempoEntrega: this.calcularTiempoEntrega(pedido),
      aplicable: this.esAplicable(pedido)
    };
  }
}

module.exports = EstrategiaDistribucion;

