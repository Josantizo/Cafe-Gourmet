/**
 * Patrón Command: Comando Concreto - Actualizar Producto
 * Modifica un producto del inventario con capacidad de deshacer
 * Principio SOLID: Single Responsibility Principle (SRP)
 */

const Command = require('./Command');
const { gestorDeInventario } = require('../../models/GestorDeInventario');

class ActualizarProductoCommand extends Command {
  constructor(idProducto, nuevosDatos) {
    super();
    this.idProducto = idProducto;
    this.nuevosDatos = nuevosDatos;
    this.datosAnteriores = null;
    this.ejecutado = false;
  }

  /**
   * Ejecuta el comando de actualizar producto
   * @returns {Promise<Object>}
   */
  async ejecutar() {
    try {
      if (this.ejecutado) {
        throw new Error('Este comando ya fue ejecutado');
      }

      console.log('✏️ Ejecutando: Actualizar Producto');
      console.log(`   ID Producto: ${this.idProducto}`);
      console.log('   Nuevos datos:', JSON.stringify(this.nuevosDatos, null, 2));

      // Primero, hacer backup del estado actual
      const productos = await gestorDeInventario.obtenerGranos(this.idProducto);
      
      if (productos.length === 0) {
        throw new Error(`Producto con ID ${this.idProducto} no encontrado`);
      }

      this.datosAnteriores = productos[0];
      
      // Guardar solo los campos que vamos a cambiar
      this.datosAnterioresRelevantes = {};
      for (const campo in this.nuevosDatos) {
        this.datosAnterioresRelevantes[campo] = this.datosAnteriores[campo];
      }

      console.log('   Backup de campos a modificar:', JSON.stringify(this.datosAnterioresRelevantes, null, 2));

      // Actualizar el producto
      const resultado = await gestorDeInventario.actualizarGrano(this.idProducto, this.nuevosDatos);
      
      this.ejecutado = true;

      console.log('✅ Producto actualizado exitosamente');

      return {
        exito: true,
        mensaje: 'Producto actualizado exitosamente',
        idProducto: this.idProducto,
        camposActualizados: Object.keys(this.nuevosDatos),
        resultado: resultado,
        comando: this.obtenerNombre(),
        timestamp: new Date()
      };
    } catch (error) {
      console.error('❌ Error actualizando producto:', error.message);
      throw new Error(`Error ejecutando comando actualizar producto: ${error.message}`);
    }
  }

  /**
   * Deshace el comando restaurando los valores anteriores
   * @returns {Promise<Object>}
   */
  async deshacer() {
    try {
      if (!this.ejecutado) {
        throw new Error('No se puede deshacer un comando que no ha sido ejecutado');
      }

      if (!this.datosAnterioresRelevantes) {
        throw new Error('No hay datos anteriores para restaurar');
      }

      console.log('↩️ Deshaciendo: Actualizar Producto');
      console.log('   Restaurando campos:', JSON.stringify(this.datosAnterioresRelevantes, null, 2));

      // Restaurar los valores anteriores
      await gestorDeInventario.actualizarGrano(this.idProducto, this.datosAnterioresRelevantes);
      
      this.ejecutado = false;

      console.log('✅ Comando deshecho: Valores anteriores restaurados');

      return {
        exito: true,
        mensaje: 'Comando deshecho: Valores anteriores restaurados',
        idProducto: this.idProducto,
        camposRestaurados: Object.keys(this.datosAnterioresRelevantes),
        comando: this.obtenerNombre(),
        timestamp: new Date()
      };
    } catch (error) {
      console.error('❌ Error deshaciendo comando:', error.message);
      throw new Error(`Error deshaciendo comando actualizar producto: ${error.message}`);
    }
  }

  /**
   * Obtiene el nombre del comando
   * @returns {string}
   */
  obtenerNombre() {
    return 'ActualizarProducto';
  }

  /**
   * Obtiene la descripción del comando
   * @returns {string}
   */
  obtenerDescripcion() {
    const campos = Object.keys(this.nuevosDatos).join(', ');
    return `Actualizar producto ID ${this.idProducto}: ${campos}`;
  }

  /**
   * Verifica si el comando puede ser deshecho
   * @returns {boolean}
   */
  puedeDeshacer() {
    return this.ejecutado && this.datosAnterioresRelevantes !== null;
  }

  /**
   * Obtiene información completa del comando
   * @returns {Object}
   */
  obtenerInfo() {
    return {
      ...super.obtenerInfo(),
      idProducto: this.idProducto,
      nuevosDatos: this.nuevosDatos,
      tieneBackup: this.datosAnterioresRelevantes !== null,
      ejecutado: this.ejecutado
    };
  }
}

module.exports = ActualizarProductoCommand;

