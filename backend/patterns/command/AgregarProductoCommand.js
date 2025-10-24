/**
 * Patrón Command: Comando Concreto - Agregar Producto
 * Añade un producto al inventario con capacidad de deshacer
 * Principio SOLID: Single Responsibility Principle (SRP)
 */

const Command = require('./Command');
const { gestorDeInventario } = require('../../models/GestorDeInventario');

class AgregarProductoCommand extends Command {
  constructor(datosProducto) {
    super();
    this.datosProducto = datosProducto;
    this.idProductoCreado = null;
    this.ejecutado = false;
  }

  /**
   * Ejecuta el comando de agregar producto
   * @returns {Promise<Object>}
   */
  async ejecutar() {
    try {
      if (this.ejecutado) {
        throw new Error('Este comando ya fue ejecutado');
      }

      console.log('➕ Ejecutando: Agregar Producto');
      console.log('   Datos:', JSON.stringify(this.datosProducto, null, 2));

      // Crear el producto en la base de datos
      const resultado = await gestorDeInventario.crearGrano(this.datosProducto);
      
      this.idProductoCreado = resultado.idGranos;
      this.ejecutado = true;

      console.log(`✅ Producto agregado exitosamente (ID: ${this.idProductoCreado})`);

      return {
        exito: true,
        mensaje: 'Producto agregado exitosamente',
        idProducto: this.idProductoCreado,
        comando: this.obtenerNombre(),
        timestamp: new Date()
      };
    } catch (error) {
      console.error('❌ Error agregando producto:', error.message);
      throw new Error(`Error ejecutando comando agregar producto: ${error.message}`);
    }
  }

  /**
   * Deshace el comando eliminando el producto
   * @returns {Promise<Object>}
   */
  async deshacer() {
    try {
      if (!this.ejecutado) {
        throw new Error('No se puede deshacer un comando que no ha sido ejecutado');
      }

      if (!this.idProductoCreado) {
        throw new Error('No hay ID de producto para deshacer');
      }

      console.log('↩️ Deshaciendo: Agregar Producto');
      console.log(`   Eliminando producto ID: ${this.idProductoCreado}`);

      // Eliminar el producto de la base de datos
      await gestorDeInventario.eliminarGrano(this.idProductoCreado);
      
      this.ejecutado = false;

      console.log('✅ Comando deshecho exitosamente');

      return {
        exito: true,
        mensaje: 'Comando deshecho: Producto eliminado',
        idProducto: this.idProductoCreado,
        comando: this.obtenerNombre(),
        timestamp: new Date()
      };
    } catch (error) {
      console.error('❌ Error deshaciendo comando:', error.message);
      throw new Error(`Error deshaciendo comando agregar producto: ${error.message}`);
    }
  }

  /**
   * Obtiene el nombre del comando
   * @returns {string}
   */
  obtenerNombre() {
    return 'AgregarProducto';
  }

  /**
   * Obtiene la descripción del comando
   * @returns {string}
   */
  obtenerDescripcion() {
    return `Agregar producto: ${this.datosProducto.TipoGrano || 'Sin nombre'}`;
  }

  /**
   * Verifica si el comando puede ser deshecho
   * @returns {boolean}
   */
  puedeDeshacer() {
    return this.ejecutado && this.idProductoCreado !== null;
  }

  /**
   * Obtiene información completa del comando
   * @returns {Object}
   */
  obtenerInfo() {
    return {
      ...super.obtenerInfo(),
      datosProducto: this.datosProducto,
      idProductoCreado: this.idProductoCreado,
      ejecutado: this.ejecutado
    };
  }
}

module.exports = AgregarProductoCommand;

