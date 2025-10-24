/**
 * Patrón Command: Interfaz Command
 * Define el contrato para todos los comandos
 * Principio SOLID: Interface Segregation Principle (ISP)
 */

class Command {
  /**
   * Ejecuta el comando
   * @returns {Promise<Object>} Resultado de la ejecución
   */
  async ejecutar() {
    throw new Error('El método ejecutar() debe ser implementado por las clases derivadas');
  }

  /**
   * Deshace el comando
   * @returns {Promise<Object>} Resultado del deshacer
   */
  async deshacer() {
    throw new Error('El método deshacer() debe ser implementado por las clases derivadas');
  }

  /**
   * Obtiene el nombre del comando
   * @returns {string}
   */
  obtenerNombre() {
    throw new Error('El método obtenerNombre() debe ser implementado por las clases derivadas');
  }

  /**
   * Obtiene la descripción del comando
   * @returns {string}
   */
  obtenerDescripcion() {
    return 'Comando base';
  }

  /**
   * Verifica si el comando puede ser deshecho
   * @returns {boolean}
   */
  puedeDeshacer() {
    return true;
  }

  /**
   * Obtiene información del comando
   * @returns {Object}
   */
  obtenerInfo() {
    return {
      nombre: this.obtenerNombre(),
      descripcion: this.obtenerDescripcion(),
      puedeDeshacer: this.puedeDeshacer(),
      timestamp: new Date()
    };
  }
}

module.exports = Command;

