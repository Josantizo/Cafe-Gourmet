/**
 * Patrón Command: Comando Concreto - Retirar Producto
 * Elimina un producto del inventario con capacidad de deshacer
 * Principio SOLID: Single Responsibility Principle (SRP)
 */

const Command = require('./Command');
const { gestorDeInventario } = require('../../models/GestorDeInventario');

class RetirarProductoCommand extends Command {
  constructor(idProducto) {
    super();
    this.idProducto = idProducto;
    this.datosBackup = null;
    this.ejecutado = false;
  }

  /**
   * Ejecuta el comando de retirar producto
   * @returns {Promise<Object>}
   */
  async ejecutar() {
    try {
      if (this.ejecutado) {
        throw new Error('Este comando ya fue ejecutado');
      }

      console.log('➖ Ejecutando: Retirar Producto');
      console.log(`   ID Producto: ${this.idProducto}`);

      // Primero, hacer backup del producto antes de eliminarlo
      const productos = await gestorDeInventario.obtenerGranos(this.idProducto);
      
      if (productos.length === 0) {
        throw new Error(`Producto con ID ${this.idProducto} no encontrado`);
      }

      this.datosBackup = productos[0];
      console.log('   Backup creado:', JSON.stringify(this.datosBackup, null, 2));

      // Eliminar el producto
      await gestorDeInventario.eliminarGrano(this.idProducto);
      
      this.ejecutado = true;

      console.log('✅ Producto retirado exitosamente');

      return {
        exito: true,
        mensaje: 'Producto retirado exitosamente',
        idProducto: this.idProducto,
        datosBackup: this.datosBackup,
        comando: this.obtenerNombre(),
        timestamp: new Date()
      };
    } catch (error) {
      console.error('❌ Error retirando producto:', error.message);
      throw new Error(`Error ejecutando comando retirar producto: ${error.message}`);
    }
  }

  /**
   * Deshace el comando restaurando el producto
   * @returns {Promise<Object>}
   */
  async deshacer() {
    try {
      if (!this.ejecutado) {
        throw new Error('No se puede deshacer un comando que no ha sido ejecutado');
      }

      if (!this.datosBackup) {
        throw new Error('No hay datos de backup para restaurar');
      }

      console.log('↩️ Deshaciendo: Retirar Producto');
      console.log('   Restaurando producto:', JSON.stringify(this.datosBackup, null, 2));

      // Preparar datos sin el ID (será auto-generado)
      const datosRestaurar = { ...this.datosBackup };
      delete datosRestaurar.idGranos;

      // Restaurar el producto
      const resultado = await gestorDeInventario.crearGrano(datosRestaurar);
      
      this.ejecutado = false;

      console.log(`✅ Comando deshecho: Producto restaurado (nuevo ID: ${resultado.idGranos})`);

      return {
        exito: true,
        mensaje: 'Comando deshecho: Producto restaurado',
        idProductoOriginal: this.idProducto,
        idProductoNuevo: resultado.idGranos,
        comando: this.obtenerNombre(),
        timestamp: new Date(),
        nota: 'El producto fue restaurado con un nuevo ID'
      };
    } catch (error) {
      console.error('❌ Error deshaciendo comando:', error.message);
      throw new Error(`Error deshaciendo comando retirar producto: ${error.message}`);
    }
  }

  /**
   * Obtiene el nombre del comando
   * @returns {string}
   */
  obtenerNombre() {
    return 'RetirarProducto';
  }

  /**
   * Obtiene la descripción del comando
   * @returns {string}
   */
  obtenerDescripcion() {
    return `Retirar producto ID: ${this.idProducto}`;
  }

  /**
   * Verifica si el comando puede ser deshecho
   * @returns {boolean}
   */
  puedeDeshacer() {
    return this.ejecutado && this.datosBackup !== null;
  }

  /**
   * Obtiene información completa del comando
   * @returns {Object}
   */
  obtenerInfo() {
    return {
      ...super.obtenerInfo(),
      idProducto: this.idProducto,
      tieneBackup: this.datosBackup !== null,
      ejecutado: this.ejecutado
    };
  }
}

module.exports = RetirarProductoCommand;

