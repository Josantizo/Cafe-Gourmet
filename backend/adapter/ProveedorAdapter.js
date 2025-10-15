/**
 * ProveedorAdapter.js
 *
 * Adaptador para integrar tu sistema interno de venta de café gourmet con Stripe.
 */

const Stripe = require('stripe');

class ProveedorAdapter {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('Se requiere una clave de API de Stripe.');
    }
    this.stripe = new Stripe(apiKey);
  }

  /**
   * Crea un pago (PaymentIntent) en Stripe.
   * @param {Object} data - Información del pago.
   * @param {number} data.monto - Monto en pesos mexicanos (MXN).
   * @param {string} data.descripcion - Descripción del producto o servicio.
   * @param {string} data.moneda - Moneda (por defecto 'mxn').
   * @returns {Promise<Object>} Información adaptada del pago.
   */
  async crearPago(data) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(data.monto * 100), // Stripe usa centavos
        currency: data.moneda || 'mxn',
        description: data.descripcion,
        automatic_payment_methods: { enabled: true },
      });

      return {
        idPago: paymentIntent.id,
        estado: paymentIntent.status,
        cliente: paymentIntent.customer || null,
        monto: paymentIntent.amount / 100,
        moneda: paymentIntent.currency,
        clientSecret: paymentIntent.client_secret,
      };
    } catch (error) {
      console.error('[ProveedorAdapter] Error al crear pago:', error.message);
      throw new Error('No se pudo crear el pago con Stripe.');
    }
  }

  /**
   * Obtiene información de un pago específico desde Stripe.
   * @param {string} idPago - ID del PaymentIntent de Stripe.
   * @returns {Promise<Object>} Información adaptada del pago.
   */
  async obtenerPago(idPago) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(idPago);

      return {
        idPago: paymentIntent.id,
        estado: paymentIntent.status,
        monto: paymentIntent.amount / 100,
        moneda: paymentIntent.currency,
        descripcion: paymentIntent.description,
      };
    } catch (error) {
      console.error('[ProveedorAdapter] Error al obtener pago:', error.message);
      throw new Error('No se pudo obtener la información del pago.');
    }
  }

  /**
   * Crea un cliente en Stripe.
   * @param {Object} data - Información del cliente.
   * @param {string} data.nombre - Nombre del cliente.
   * @param {string} data.email - Correo del cliente.
   * @returns {Promise<Object>} Cliente adaptado.
   */
  async crearCliente(data) {
    try {
      const customer = await this.stripe.customers.create({
        name: data.nombre,
        email: data.email,
      });

      return {
        idCliente: customer.id,
        nombre: customer.name,
        email: customer.email,
      };
    } catch (error) {
      console.error('[ProveedorAdapter] Error al crear cliente:', error.message);
      throw new Error('No se pudo crear el cliente en Stripe.');
    }
  }

  /**
   * Obtiene la información de un cliente de Stripe.
   * @param {string} idCliente - ID del cliente en Stripe.
   * @returns {Promise<Object>} Información adaptada del cliente.
   */
  async obtenerCliente(idCliente) {
    try {
      const customer = await this.stripe.customers.retrieve(idCliente);
      return {
        idCliente: customer.id,
        nombre: customer.name,
        email: customer.email,
      };
    } catch (error) {
      console.error('[ProveedorAdapter] Error al obtener cliente:', error.message);
      throw new Error('No se pudo obtener la información del cliente.');
    }
  }
}

module.exports = ProveedorAdapter;