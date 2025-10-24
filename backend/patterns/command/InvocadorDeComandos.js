/**
 * Patrón Command: Invocador (Invoker)
 * Gestiona la ejecución y el historial de comandos
 * Principio SOLID: Single Responsibility Principle (SRP)
 */

class InvocadorDeComandos {
  constructor() {
    this.historialEjecutados = [];
    this.historialDeshechos = [];
    this.maxHistorial = 50; // Límite de comandos en historial
  }

  /**
   * Ejecuta un comando y lo agrega al historial
   * @param {Command} comando
   * @returns {Promise<Object>}
   */
  async ejecutarComando(comando) {
    try {
      console.log(`\n🎬 Invocando comando: ${comando.obtenerNombre()}`);
      
      const resultado = await comando.ejecutar();
      
      // Agregar al historial de ejecutados
      this.historialEjecutados.push({
        comando,
        resultado,
        timestamp: new Date()
      });

      // Limpiar historial de deshechos (ya no se pueden rehacer)
      this.historialDeshechos = [];

      // Limitar el tamaño del historial
      if (this.historialEjecutados.length > this.maxHistorial) {
        this.historialEjecutados.shift();
      }

      console.log(`✅ Comando ejecutado y agregado al historial`);
      console.log(`   Historial: ${this.historialEjecutados.length} ejecutados\n`);

      return resultado;
    } catch (error) {
      console.error(`❌ Error ejecutando comando: ${error.message}`);
      throw error;
    }
  }

  /**
   * Deshace el último comando ejecutado
   * @returns {Promise<Object>}
   */
  async deshacerUltimoComando() {
    if (this.historialEjecutados.length === 0) {
      throw new Error('No hay comandos para deshacer');
    }

    const ultimoRegistro = this.historialEjecutados.pop();
    const comando = ultimoRegistro.comando;

    console.log(`\n↩️ Deshaciendo último comando: ${comando.obtenerNombre()}`);

    if (!comando.puedeDeshacer()) {
      throw new Error('Este comando no puede ser deshecho');
    }

    try {
      const resultado = await comando.deshacer();
      
      // Mover al historial de deshechos
      this.historialDeshechos.push({
        comando,
        resultado,
        timestamp: new Date()
      });

      console.log(`✅ Comando deshecho exitosamente`);
      console.log(`   Historial: ${this.historialEjecutados.length} ejecutados, ${this.historialDeshechos.length} deshechos\n`);

      return resultado;
    } catch (error) {
      // Si falla deshacer, volver a agregar al historial
      this.historialEjecutados.push(ultimoRegistro);
      throw error;
    }
  }

  /**
   * Rehace el último comando deshecho
   * @returns {Promise<Object>}
   */
  async rehacerUltimoComando() {
    if (this.historialDeshechos.length === 0) {
      throw new Error('No hay comandos para rehacer');
    }

    const ultimoRegistro = this.historialDeshechos.pop();
    const comando = ultimoRegistro.comando;

    console.log(`\n🔄 Rehaciendo comando: ${comando.obtenerNombre()}`);

    try {
      const resultado = await comando.ejecutar();
      
      // Mover de vuelta al historial de ejecutados
      this.historialEjecutados.push({
        comando,
        resultado,
        timestamp: new Date()
      });

      console.log(`✅ Comando rehecho exitosamente`);
      console.log(`   Historial: ${this.historialEjecutados.length} ejecutados, ${this.historialDeshechos.length} deshechos\n`);

      return resultado;
    } catch (error) {
      // Si falla rehacer, volver a agregar al historial de deshechos
      this.historialDeshechos.push(ultimoRegistro);
      throw error;
    }
  }

  /**
   * Deshace múltiples comandos
   * @param {number} cantidad
   * @returns {Promise<Array>}
   */
  async deshacerMultiplesComandos(cantidad) {
    const resultados = [];
    
    for (let i = 0; i < cantidad; i++) {
      if (this.historialEjecutados.length === 0) {
        break;
      }
      
      try {
        const resultado = await this.deshacerUltimoComando();
        resultados.push(resultado);
      } catch (error) {
        console.error(`Error deshaciendo comando ${i + 1}:`, error.message);
        break;
      }
    }

    return resultados;
  }

  /**
   * Obtiene el historial de comandos ejecutados
   * @param {number} limite - Número máximo de registros
   * @returns {Array}
   */
  obtenerHistorialEjecutados(limite = 10) {
    return this.historialEjecutados
      .slice(-limite)
      .map(registro => ({
        comando: registro.comando.obtenerNombre(),
        descripcion: registro.comando.obtenerDescripcion(),
        info: registro.comando.obtenerInfo(),
        resultado: registro.resultado,
        timestamp: registro.timestamp
      }));
  }

  /**
   * Obtiene el historial de comandos deshechos
   * @param {number} limite - Número máximo de registros
   * @returns {Array}
   */
  obtenerHistorialDeshechos(limite = 10) {
    return this.historialDeshechos
      .slice(-limite)
      .map(registro => ({
        comando: registro.comando.obtenerNombre(),
        descripcion: registro.comando.obtenerDescripcion(),
        info: registro.comando.obtenerInfo(),
        resultado: registro.resultado,
        timestamp: registro.timestamp
      }));
  }

  /**
   * Verifica si hay comandos para deshacer
   * @returns {boolean}
   */
  hayComandosParaDeshacer() {
    return this.historialEjecutados.length > 0;
  }

  /**
   * Verifica si hay comandos para rehacer
   * @returns {boolean}
   */
  hayComandosParaRehacer() {
    return this.historialDeshechos.length > 0;
  }

  /**
   * Obtiene el último comando ejecutado
   * @returns {Object|null}
   */
  obtenerUltimoComandoEjecutado() {
    if (this.historialEjecutados.length === 0) {
      return null;
    }

    const ultimoRegistro = this.historialEjecutados[this.historialEjecutados.length - 1];
    return {
      comando: ultimoRegistro.comando.obtenerNombre(),
      descripcion: ultimoRegistro.comando.obtenerDescripcion(),
      timestamp: ultimoRegistro.timestamp,
      puedeDeshacer: ultimoRegistro.comando.puedeDeshacer()
    };
  }

  /**
   * Limpia el historial
   */
  limpiarHistorial() {
    this.historialEjecutados = [];
    this.historialDeshechos = [];
    console.log('🗑️ Historial de comandos limpiado');
  }

  /**
   * Obtiene estadísticas del invocador
   * @returns {Object}
   */
  obtenerEstadisticas() {
    const porTipo = {};
    
    this.historialEjecutados.forEach(registro => {
      const nombre = registro.comando.obtenerNombre();
      porTipo[nombre] = (porTipo[nombre] || 0) + 1;
    });

    return {
      totalEjecutados: this.historialEjecutados.length,
      totalDeshechos: this.historialDeshechos.length,
      maxHistorial: this.maxHistorial,
      hayComandosParaDeshacer: this.hayComandosParaDeshacer(),
      hayComandosParaRehacer: this.hayComandosParaRehacer(),
      comandosPorTipo: porTipo,
      ultimoComando: this.obtenerUltimoComandoEjecutado()
    };
  }

  /**
   * Establece el límite máximo del historial
   * @param {number} limite
   */
  establecerMaxHistorial(limite) {
    if (limite < 1) {
      throw new Error('El límite debe ser al menos 1');
    }

    this.maxHistorial = limite;
    
    // Ajustar historial actual si excede el nuevo límite
    while (this.historialEjecutados.length > this.maxHistorial) {
      this.historialEjecutados.shift();
    }
  }
}

module.exports = InvocadorDeComandos;

