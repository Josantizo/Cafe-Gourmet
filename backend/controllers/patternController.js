/**
 * Controlador para los patrones de diseño
 * Observer, Strategy y Command
 */

const { gestorDeInventario } = require('../models/GestorDeInventario');
const ResponsableDeCompras = require('../patterns/observer/ResponsableDeCompras');
const NotificadorSistema = require('../patterns/observer/NotificadorSistema');
const ContextoDeDistribucion = require('../patterns/strategy/ContextoDeDistribucion');
const AgregarProductoCommand = require('../patterns/command/AgregarProductoCommand');
const RetirarProductoCommand = require('../patterns/command/RetirarProductoCommand');
const ActualizarProductoCommand = require('../patterns/command/ActualizarProductoCommand');
const InvocadorDeComandos = require('../patterns/command/InvocadorDeComandos');

class PatternController {
  constructor() {
    // Inicializar observadores
    this.responsableCompras = new ResponsableDeCompras(
      'Juan Pérez',
      'compras@cafegourmet.com',
      500 // umbral crítico en gramos
    );
    this.notificadorSistema = new NotificadorSistema('Sistema Principal');

    // Registrar observadores en el gestor de inventario
    gestorDeInventario.agregarObservador(this.responsableCompras);
    gestorDeInventario.agregarObservador(this.notificadorSistema);

    // Inicializar contexto de distribución
    this.contextoDistribucion = new ContextoDeDistribucion();

    // Inicializar invocador de comandos
    this.invocadorComandos = new InvocadorDeComandos();
  }

  // ===== PATRÓN OBSERVER =====

  /**
   * Verifica el stock de todos los granos
   */
  async verificarStocks(req, res) {
    try {
      const resultado = await gestorDeInventario.verificarTodosLosStocks();
      
      res.json({
        success: true,
        message: 'Verificación de stocks completada',
        data: resultado
      });
    } catch (error) {
      console.error('Error verificando stocks:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Obtiene las notificaciones del responsable de compras
   */
  async obtenerNotificaciones(req, res) {
    try {
      const notificaciones = this.responsableCompras.obtenerTodasLasNotificaciones();
      const estadisticas = this.responsableCompras.obtenerEstadisticas();
      
      res.json({
        success: true,
        data: {
          notificaciones,
          estadisticas
        }
      });
    } catch (error) {
      console.error('Error obteniendo notificaciones:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Obtiene los logs del sistema
   */
  async obtenerLogsSistema(req, res) {
    try {
      const { severidad } = req.query;
      
      const logs = this.notificadorSistema.obtenerLogs(severidad);
      const estadisticas = this.notificadorSistema.obtenerEstadisticas();
      
      res.json({
        success: true,
        data: {
          logs,
          estadisticas
        }
      });
    } catch (error) {
      console.error('Error obteniendo logs:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Simula el consumo de granos (para pruebas del Observer)
   */
  async consumirGranos(req, res) {
    try {
      const { idGranos, cantidad } = req.body;

      if (!idGranos || !cantidad) {
        return res.status(400).json({
          success: false,
          error: 'idGranos y cantidad son requeridos'
        });
      }

      const resultado = await gestorDeInventario.consumirGranos(idGranos, cantidad);
      
      res.json({
        success: true,
        message: 'Granos consumidos exitosamente',
        data: resultado
      });
    } catch (error) {
      console.error('Error consumiendo granos:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  // ===== PATRÓN STRATEGY =====

  /**
   * Calcula el costo de distribución usando una estrategia específica
   */
  async calcularDistribucion(req, res) {
    try {
      const { estrategia, pedido } = req.body;

      if (!estrategia || !pedido) {
        return res.status(400).json({
          success: false,
          error: 'estrategia y pedido son requeridos'
        });
      }

      this.contextoDistribucion.establecerEstrategia(estrategia);
      const costo = this.contextoDistribucion.calcularCosto(pedido);
      const tiempo = this.contextoDistribucion.calcularTiempoEntrega(pedido);
      const detalles = this.contextoDistribucion.obtenerDetallesEntrega(pedido);
      
      res.json({
        success: true,
        data: {
          estrategia,
          costo,
          tiempo,
          detalles
        }
      });
    } catch (error) {
      console.error('Error calculando distribución:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Selecciona automáticamente la mejor estrategia de distribución
   */
  async seleccionarEstrategiaAutomatica(req, res) {
    try {
      const { pedido } = req.body;

      if (!pedido) {
        return res.status(400).json({
          success: false,
          error: 'pedido es requerido'
        });
      }

      const estrategiaSeleccionada = this.contextoDistribucion.seleccionarEstrategiaAutomatica(pedido);
      const costo = this.contextoDistribucion.calcularCosto(pedido);
      const tiempo = this.contextoDistribucion.calcularTiempoEntrega(pedido);
      const detalles = this.contextoDistribucion.obtenerDetallesEntrega(pedido);
      
      res.json({
        success: true,
        message: 'Estrategia seleccionada automáticamente',
        data: {
          estrategiaSeleccionada,
          costo,
          tiempo,
          detalles
        }
      });
    } catch (error) {
      console.error('Error seleccionando estrategia:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Compara todas las estrategias disponibles
   */
  async compararEstrategias(req, res) {
    try {
      const { pedido } = req.body;

      if (!pedido) {
        return res.status(400).json({
          success: false,
          error: 'pedido es requerido'
        });
      }

      const comparacion = this.contextoDistribucion.compararEstrategias(pedido);
      
      res.json({
        success: true,
        data: {
          pedido,
          comparacion
        }
      });
    } catch (error) {
      console.error('Error comparando estrategias:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Obtiene las estrategias disponibles
   */
  async obtenerEstrategiasDisponibles(req, res) {
    try {
      const estrategias = this.contextoDistribucion.obtenerEstrategiasDisponibles();
      
      res.json({
        success: true,
        data: estrategias
      });
    } catch (error) {
      console.error('Error obteniendo estrategias:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  // ===== PATRÓN COMMAND =====

  /**
   * Ejecuta un comando de inventario
   */
  async ejecutarComando(req, res) {
    try {
      const { tipoComando, datos } = req.body;

      if (!tipoComando) {
        return res.status(400).json({
          success: false,
          error: 'tipoComando es requerido'
        });
      }

      let comando;

      switch (tipoComando.toLowerCase()) {
        case 'agregar':
          if (!datos || !datos.datosProducto) {
            return res.status(400).json({
              success: false,
              error: 'datosProducto es requerido para agregar'
            });
          }
          comando = new AgregarProductoCommand(datos.datosProducto);
          break;

        case 'retirar':
          if (!datos || !datos.idProducto) {
            return res.status(400).json({
              success: false,
              error: 'idProducto es requerido para retirar'
            });
          }
          comando = new RetirarProductoCommand(datos.idProducto);
          break;

        case 'actualizar':
          if (!datos || !datos.idProducto || !datos.nuevosDatos) {
            return res.status(400).json({
              success: false,
              error: 'idProducto y nuevosDatos son requeridos para actualizar'
            });
          }
          comando = new ActualizarProductoCommand(datos.idProducto, datos.nuevosDatos);
          break;

        default:
          return res.status(400).json({
            success: false,
            error: 'Tipo de comando no válido. Opciones: agregar, retirar, actualizar'
          });
      }

      const resultado = await this.invocadorComandos.ejecutarComando(comando);
      
      res.json({
        success: true,
        message: 'Comando ejecutado exitosamente',
        data: resultado
      });
    } catch (error) {
      console.error('Error ejecutando comando:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Deshace el último comando
   */
  async deshacerComando(req, res) {
    try {
      const resultado = await this.invocadorComandos.deshacerUltimoComando();
      
      res.json({
        success: true,
        message: 'Comando deshecho exitosamente',
        data: resultado
      });
    } catch (error) {
      console.error('Error deshaciendo comando:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Rehace el último comando deshecho
   */
  async rehacerComando(req, res) {
    try {
      const resultado = await this.invocadorComandos.rehacerUltimoComando();
      
      res.json({
        success: true,
        message: 'Comando rehecho exitosamente',
        data: resultado
      });
    } catch (error) {
      console.error('Error rehaciendo comando:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Obtiene el historial de comandos
   */
  async obtenerHistorialComandos(req, res) {
    try {
      const { limite = 10 } = req.query;
      
      const historialEjecutados = this.invocadorComandos.obtenerHistorialEjecutados(parseInt(limite));
      const historialDeshechos = this.invocadorComandos.obtenerHistorialDeshechos(parseInt(limite));
      const estadisticas = this.invocadorComandos.obtenerEstadisticas();
      
      res.json({
        success: true,
        data: {
          ejecutados: historialEjecutados,
          deshechos: historialDeshechos,
          estadisticas
        }
      });
    } catch (error) {
      console.error('Error obteniendo historial:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Obtiene estadísticas de comandos
   */
  async obtenerEstadisticasComandos(req, res) {
    try {
      const estadisticas = this.invocadorComandos.obtenerEstadisticas();
      
      res.json({
        success: true,
        data: estadisticas
      });
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }
}

module.exports = PatternController;

