/**
 * Servicio para manejar pagos con Stripe usando el patrón Adapter
 * Mantiene la consistencia con el diseño del sistema
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class PaymentService {
  /**
   * Crea un PaymentIntent usando el adaptador del backend
   * @param {Object} paymentData - Datos del pago
   * @param {string} paymentData.nombreProducto - Nombre del producto
   * @param {number} paymentData.precio - Precio del producto
   * @param {number} paymentData.cantidad - Cantidad del producto
   * @returns {Promise<Object>} Respuesta del adaptador con clientSecret
   */
  async crearPago(paymentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/pago`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error del servidor: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('[PaymentService] Error al crear pago:', error);
      throw new Error(`No se pudo crear el pago: ${error.message}`);
    }
  }

  /**
   * Obtiene información de un pago específico
   * @param {string} idPago - ID del pago
   * @returns {Promise<Object>} Información del pago
   */
  async obtenerPago(idPago) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/pago/${idPago}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error del servidor: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('[PaymentService] Error al obtener pago:', error);
      throw new Error(`No se pudo obtener la información del pago: ${error.message}`);
    }
  }

  /**
   * Crea un cliente en Stripe
   * @param {Object} clienteData - Datos del cliente
   * @param {string} clienteData.nombre - Nombre del cliente
   * @param {string} clienteData.email - Email del cliente
   * @returns {Promise<Object>} Cliente creado
   */
  async crearCliente(clienteData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cliente`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clienteData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error del servidor: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('[PaymentService] Error al crear cliente:', error);
      throw new Error(`No se pudo crear el cliente: ${error.message}`);
    }
  }
}

export default new PaymentService();
