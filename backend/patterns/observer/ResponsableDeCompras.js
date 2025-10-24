/**
 * Patrón Observer: Observador Concreto - ResponsableDeCompras
 * Se encarga de recibir notificaciones de stock bajo y tomar acciones
 * Principio SOLID: Single Responsibility Principle (SRP)
 */

const Observer = require('./Observer');

class ResponsableDeCompras extends Observer {
  constructor(nombre, email, umbralCritico = 500) {
    super();
    this.nombre = nombre;
    this.email = email;
    this.umbralCritico = umbralCritico; // gramos
    this.notificaciones = [];
    this.alertasEnviadas = 0;
  }

  /**
   * Recibe y procesa notificaciones de stock bajo
   * @param {Object} data - Datos del evento
   */
  actualizar(data) {
    const { tipo, grano, cantidadActual, umbralRestock, fecha } = data;

    const notificacion = {
      fecha: fecha || new Date(),
      tipo,
      grano,
      cantidadActual,
      umbralRestock,
      estado: 'pendiente',
      prioridad: this.determinarPrioridad(cantidadActual, umbralRestock)
    };

    this.notificaciones.push(notificacion);
    this.alertasEnviadas++;

    console.log(`
╔════════════════════════════════════════════════════════════╗
║           🚨 ALERTA DE STOCK BAJO 🚨                      ║
╠════════════════════════════════════════════════════════════╣
║ Responsable: ${this.nombre.padEnd(42)}║
║ Email: ${this.email.padEnd(48)}║
║ Tipo Grano: ${grano.TipoGrano.padEnd(45)}║
║ Cantidad Actual: ${cantidadActual.toString().padEnd(38)} g ║
║ Umbral Restock: ${umbralRestock.toString().padEnd(39)} g ║
║ Prioridad: ${notificacion.prioridad.padEnd(46)}║
╚════════════════════════════════════════════════════════════╝
    `);

    // Simular envío de email
    this.enviarEmail(notificacion);

    // Si es crítico, tomar acción inmediata
    if (notificacion.prioridad === 'CRÍTICA') {
      this.tomarAccionInmediata(notificacion);
    }
  }

  /**
   * Determina la prioridad de la notificación
   * @param {number} cantidadActual
   * @param {number} umbralRestock
   * @returns {string}
   */
  determinarPrioridad(cantidadActual, umbralRestock) {
    const porcentaje = (cantidadActual / umbralRestock) * 100;

    if (porcentaje <= 10) return 'CRÍTICA';
    if (porcentaje <= 30) return 'ALTA';
    if (porcentaje <= 50) return 'MEDIA';
    return 'BAJA';
  }

  /**
   * Simula el envío de un email
   * @param {Object} notificacion
   */
  enviarEmail(notificacion) {
    console.log(`📧 Email enviado a ${this.email}`);
    console.log(`   Asunto: [${notificacion.prioridad}] Stock Bajo - ${notificacion.grano.TipoGrano}`);
  }

  /**
   * Toma acción inmediata para notificaciones críticas
   * @param {Object} notificacion
   */
  tomarAccionInmediata(notificacion) {
    console.log(`⚠️ ACCIÓN INMEDIATA REQUERIDA para ${notificacion.grano.TipoGrano}`);
    console.log(`   ⏰ Generando orden de compra automática...`);
    
    notificacion.estado = 'accion_tomada';
    notificacion.accion = 'orden_compra_automatica';
    
    // Aquí se podría integrar con un sistema de compras real
  }

  /**
   * Obtiene el nombre del observador
   * @returns {string}
   */
  obtenerNombre() {
    return `ResponsableDeCompras: ${this.nombre}`;
  }

  /**
   * Obtiene las notificaciones pendientes
   * @returns {Array}
   */
  obtenerNotificacionesPendientes() {
    return this.notificaciones.filter(n => n.estado === 'pendiente');
  }

  /**
   * Marca una notificación como procesada
   * @param {number} index
   */
  marcarComoProcesada(index) {
    if (this.notificaciones[index]) {
      this.notificaciones[index].estado = 'procesada';
      this.notificaciones[index].fechaProcesamiento = new Date();
    }
  }

  /**
   * Obtiene estadísticas del responsable
   * @returns {Object}
   */
  obtenerEstadisticas() {
    const pendientes = this.notificaciones.filter(n => n.estado === 'pendientes').length;
    const procesadas = this.notificaciones.filter(n => n.estado === 'procesada').length;
    const criticas = this.notificaciones.filter(n => n.prioridad === 'CRÍTICA').length;

    return {
      nombre: this.nombre,
      email: this.email,
      totalAlertas: this.alertasEnviadas,
      alertasPendientes: pendientes,
      alertasProcesadas: procesadas,
      alertasCriticas: criticas,
      ultimaNotificacion: this.notificaciones[this.notificaciones.length - 1] || null
    };
  }

  /**
   * Obtiene todas las notificaciones
   * @returns {Array}
   */
  obtenerTodasLasNotificaciones() {
    return [...this.notificaciones];
  }
}

module.exports = ResponsableDeCompras;

