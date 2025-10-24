/**
 * Patrón Observer: Interfaz Observer
 * Define el contrato para todos los observadores
 * Principio SOLID: Interface Segregation Principle (ISP)
 */

class Observer {
  /**
   * Método que será llamado cuando el sujeto notifique un cambio
   * @param {Object} data - Datos del evento
   */
  actualizar(data) {
    throw new Error('El método actualizar() debe ser implementado por las clases derivadas');
  }

  /**
   * Obtiene el nombre del observador
   * @returns {string}
   */
  obtenerNombre() {
    throw new Error('El método obtenerNombre() debe ser implementado por las clases derivadas');
  }
}

module.exports = Observer;

