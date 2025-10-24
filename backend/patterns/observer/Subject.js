/**
 * Patrón Observer: Clase Subject (Sujeto)
 * Mantiene una lista de observadores y los notifica de cambios
 * Principio SOLID: Single Responsibility Principle (SRP)
 */

class Subject {
  constructor() {
    this.observadores = [];
  }

  /**
   * Registra un observador
   * @param {Observer} observador - Instancia que implementa la interfaz Observer
   */
  agregarObservador(observador) {
    if (!observador || typeof observador.actualizar !== 'function') {
      throw new Error('El observador debe implementar el método actualizar()');
    }
    
    if (!this.observadores.includes(observador)) {
      this.observadores.push(observador);
      console.log(`✅ Observador ${observador.obtenerNombre()} agregado`);
    }
  }

  /**
   * Elimina un observador
   * @param {Observer} observador - Instancia a eliminar
   */
  eliminarObservador(observador) {
    const index = this.observadores.indexOf(observador);
    if (index > -1) {
      this.observadores.splice(index, 1);
      console.log(`🗑️ Observador ${observador.obtenerNombre()} eliminado`);
    }
  }

  /**
   * Notifica a todos los observadores
   * @param {Object} data - Datos del evento
   */
  notificarObservadores(data) {
    console.log(`📢 Notificando a ${this.observadores.length} observador(es)...`);
    
    this.observadores.forEach(observador => {
      try {
        observador.actualizar(data);
      } catch (error) {
        console.error(`❌ Error notificando a ${observador.obtenerNombre()}:`, error.message);
      }
    });
  }

  /**
   * Obtiene la lista de observadores registrados
   * @returns {Array<Observer>}
   */
  obtenerObservadores() {
    return [...this.observadores];
  }

  /**
   * Obtiene el número de observadores registrados
   * @returns {number}
   */
  contarObservadores() {
    return this.observadores.length;
  }
}

module.exports = Subject;

