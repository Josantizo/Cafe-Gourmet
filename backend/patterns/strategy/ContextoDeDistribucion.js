/**
 * Patrón Strategy: Contexto
 * Gestiona y selecciona la estrategia de distribución más adecuada
 * Principio SOLID: Dependency Inversion Principle (DIP)
 */

const DistribucionRapida = require('./DistribucionRapida');
const DistribucionEconomica = require('./DistribucionEconomica');
const DistribucionBalanceada = require('./DistribucionBalanceada');

class ContextoDeDistribucion {
  constructor() {
    this.estrategiaActual = null;
    this.estrategiasDisponibles = {
      rapida: new DistribucionRapida(),
      economica: new DistribucionEconomica(),
      balanceada: new DistribucionBalanceada()
    };
    this.historialCalculos = [];
  }

  /**
   * Establece la estrategia de distribución manualmente
   * @param {string} tipoEstrategia - 'rapida', 'economica', o 'balanceada'
   */
  establecerEstrategia(tipoEstrategia) {
    const estrategia = this.estrategiasDisponibles[tipoEstrategia.toLowerCase()];
    
    if (!estrategia) {
      throw new Error(`Estrategia "${tipoEstrategia}" no disponible. Opciones: rapida, economica, balanceada`);
    }

    this.estrategiaActual = estrategia;
    console.log(`✅ Estrategia establecida: ${estrategia.obtenerNombre()}`);
  }

  /**
   * Selecciona automáticamente la mejor estrategia según el pedido
   * @param {Object} pedido - Información del pedido
   * @returns {string} Tipo de estrategia seleccionada
   */
  seleccionarEstrategiaAutomatica(pedido) {
    const { 
      distanciaKm = 10, 
      presupuestoMax = null, 
      tiempoMaxHoras = null,
      prioridad = 'normal',
      esUrgente = false 
    } = pedido;

    console.log('\n🤖 Seleccionando estrategia automática...');
    console.log(`   Distancia: ${distanciaKm} km`);
    console.log(`   Presupuesto máximo: ${presupuestoMax ? '$' + presupuestoMax : 'Sin límite'}`);
    console.log(`   Tiempo máximo: ${tiempoMaxHoras ? tiempoMaxHoras + 'h' : 'Sin límite'}`);
    console.log(`   Prioridad: ${prioridad}`);
    console.log(`   Urgente: ${esUrgente ? 'Sí' : 'No'}`);

    // Evaluar todas las estrategias
    const evaluaciones = [];
    
    for (const [tipo, estrategia] of Object.entries(this.estrategiasDisponibles)) {
      if (!estrategia.esAplicable(pedido)) {
        console.log(`   ❌ ${estrategia.obtenerNombre()} no aplicable`);
        continue;
      }

      const costo = estrategia.calcularCosto(pedido);
      const tiempo = estrategia.calcularTiempoEntrega(pedido);

      // Verificar restricciones
      if (presupuestoMax && costo > presupuestoMax) {
        console.log(`   ❌ ${estrategia.obtenerNombre()} excede presupuesto`);
        continue;
      }

      if (tiempoMaxHoras && tiempo > tiempoMaxHoras) {
        console.log(`   ❌ ${estrategia.obtenerNombre()} excede tiempo máximo`);
        continue;
      }

      // Calcular puntuación
      let puntuacion = 0;

      // Si es urgente, priorizar velocidad
      if (esUrgente || prioridad === 'alta') {
        puntuacion += (100 / tiempo) * 2; // Doble peso a velocidad
        puntuacion += (100 / costo) * 1; // Peso normal a costo
      } 
      // Si no es urgente, equilibrar
      else if (prioridad === 'baja') {
        puntuacion += (100 / tiempo) * 0.5; // Medio peso a velocidad
        puntuacion += (100 / costo) * 2; // Doble peso a costo
      } 
      // Prioridad normal
      else {
        puntuacion += (100 / tiempo) * 1; // Peso igual
        puntuacion += (100 / costo) * 1; // Peso igual
      }

      evaluaciones.push({
        tipo,
        estrategia,
        costo,
        tiempo,
        puntuacion
      });

      console.log(`   ✅ ${estrategia.obtenerNombre()}: Costo $${costo}, Tiempo ${tiempo}h, Puntuación ${puntuacion.toFixed(2)}`);
    }

    if (evaluaciones.length === 0) {
      throw new Error('No hay estrategias aplicables para este pedido');
    }

    // Seleccionar la estrategia con mayor puntuación
    evaluaciones.sort((a, b) => b.puntuacion - a.puntuacion);
    const mejorOpcion = evaluaciones[0];

    this.estrategiaActual = mejorOpcion.estrategia;
    console.log(`\n🎯 Mejor opción: ${mejorOpcion.estrategia.obtenerNombre()}`);
    
    return mejorOpcion.tipo;
  }

  /**
   * Calcula el costo usando la estrategia actual
   * @param {Object} pedido
   * @returns {number}
   */
  calcularCosto(pedido) {
    if (!this.estrategiaActual) {
      throw new Error('No se ha establecido una estrategia. Use establecerEstrategia() o seleccionarEstrategiaAutomatica()');
    }

    const costo = this.estrategiaActual.calcularCosto(pedido);
    
    this.historialCalculos.push({
      fecha: new Date(),
      estrategia: this.estrategiaActual.obtenerNombre(),
      pedido,
      costo,
      tiempo: this.estrategiaActual.calcularTiempoEntrega(pedido)
    });

    return costo;
  }

  /**
   * Calcula el tiempo de entrega usando la estrategia actual
   * @param {Object} pedido
   * @returns {number}
   */
  calcularTiempoEntrega(pedido) {
    if (!this.estrategiaActual) {
      throw new Error('No se ha establecido una estrategia. Use establecerEstrategia() o seleccionarEstrategiaAutomatica()');
    }

    return this.estrategiaActual.calcularTiempoEntrega(pedido);
  }

  /**
   * Obtiene los detalles completos de la entrega
   * @param {Object} pedido
   * @returns {Object}
   */
  obtenerDetallesEntrega(pedido) {
    if (!this.estrategiaActual) {
      throw new Error('No se ha establecido una estrategia');
    }

    return this.estrategiaActual.obtenerDetallesEntrega(pedido);
  }

  /**
   * Compara todas las estrategias disponibles para un pedido
   * @param {Object} pedido
   * @returns {Array}
   */
  compararEstrategias(pedido) {
    const comparacion = [];

    for (const [tipo, estrategia] of Object.entries(this.estrategiasDisponibles)) {
      try {
        const detalles = estrategia.obtenerDetallesEntrega(pedido);
        comparacion.push({
          tipo,
          ...detalles
        });
      } catch (error) {
        console.error(`Error comparando estrategia ${tipo}:`, error.message);
      }
    }

    // Ordenar por puntuación (costo/tiempo)
    comparacion.sort((a, b) => {
      const puntuacionA = (100 / a.costo) + (100 / a.tiempoEntrega);
      const puntuacionB = (100 / b.costo) + (100 / b.tiempoEntrega);
      return puntuacionB - puntuacionA;
    });

    return comparacion;
  }

  /**
   * Obtiene la estrategia actual
   * @returns {Object}
   */
  obtenerEstrategiaActual() {
    if (!this.estrategiaActual) {
      return null;
    }

    return {
      nombre: this.estrategiaActual.obtenerNombre(),
      descripcion: this.estrategiaActual.obtenerDescripcion()
    };
  }

  /**
   * Obtiene todas las estrategias disponibles
   * @returns {Array}
   */
  obtenerEstrategiasDisponibles() {
    return Object.keys(this.estrategiasDisponibles).map(tipo => ({
      tipo,
      nombre: this.estrategiasDisponibles[tipo].obtenerNombre(),
      descripcion: this.estrategiasDisponibles[tipo].obtenerDescripcion()
    }));
  }

  /**
   * Obtiene el historial de cálculos
   * @param {number} limite - Número máximo de registros
   * @returns {Array}
   */
  obtenerHistorial(limite = 10) {
    return this.historialCalculos.slice(-limite);
  }

  /**
   * Limpia el historial
   */
  limpiarHistorial() {
    this.historialCalculos = [];
    console.log('🗑️ Historial limpiado');
  }
}

module.exports = ContextoDeDistribucion;

