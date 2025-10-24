const ProcesoProduccion = require('./ProcesoProduccion');
const GestorOperacionesComposite = require('./GestorOperacionesComposite');
const { gestorDeInventario } = require('../models/GestorDeInventario');
const { pool } = require('../config/database');

class FacadeDeProduccion {
  constructor() {
    this.procesoProduccion = new ProcesoProduccion();
    this.gestorInventario = gestorDeInventario;
    this.gestorOperacionesComposite = new GestorOperacionesComposite();
  }

  // ===== MÉTODOS PRINCIPALES DEL FACADE =====

  // Iniciar proceso completo de producción desde granos hasta venta
  async iniciarProcesoCompleto(datosIniciales) {
    try {
      const {
        tipoGrano,
        region,
        cantidadGramos,
        precio,
        fechaVencimiento
      } = datosIniciales;

      // 1. Crear entrada en inventario de granos
      const granoData = {
        TipoGrano: tipoGrano,
        Fecha_Ingreso: new Date(),
        Fecha_Vencimiento: fechaVencimiento,
        Cantidad_Gramos: cantidadGramos,
        Cantidad_Gramos_Restock: cantidadGramos,
        Precio: precio
      };

      const granoResultado = await this.gestorInventario.crearGrano(granoData);
      
      // 2. Iniciar proceso de producción
      const procesoData = {
        idGranos: granoResultado.idGranos,
        cantidadGramos,
        tipoGrano,
        region
      };

      const procesoResultado = await this.procesoProduccion.crearProcesoProduccion(procesoData);

      return {
        success: true,
        grano: granoResultado,
        proceso: procesoResultado,
        mensaje: 'Proceso de producción iniciado exitosamente'
      };
    } catch (error) {
      throw new Error(`Error iniciando proceso completo: ${error.message}`);
    }
  }

  // Avanzar proceso de producción al siguiente estado
  async avanzarProceso(idProceso, observaciones = '') {
    try {
      const proceso = await this.procesoProduccion.obtenerProceso(idProceso);
      if (!proceso) {
        throw new Error('Proceso no encontrado');
      }

      const estados = this.procesoProduccion.obtenerEstados();
      const estadoActual = proceso.estadoActual;
      
      let siguienteEstado;
      switch (estadoActual) {
        case estados.COSECHA:
          siguienteEstado = estados.TOSTADO;
          break;
        case estados.TOSTADO:
          siguienteEstado = estados.MOLIDO;
          break;
        case estados.MOLIDO:
          siguienteEstado = estados.EMPAQUETADO;
          break;
        case estados.EMPAQUETADO:
          siguienteEstado = estados.VENTA;
          break;
        default:
          throw new Error('El proceso ya está completado o en estado inválido');
      }

      const resultado = await this.procesoProduccion.avanzarEstado(idProceso, siguienteEstado, observaciones);
      
      return {
        success: true,
        ...resultado,
        procesoCompletado: siguienteEstado === estados.VENTA
      };
    } catch (error) {
      throw new Error(`Error avanzando proceso: ${error.message}`);
    }
  }

  // Obtener estado actual de un proceso
  async obtenerEstadoProceso(idProceso) {
    try {
      const proceso = await this.procesoProduccion.obtenerProceso(idProceso);
      if (!proceso) {
        throw new Error('Proceso no encontrado');
      }

      return {
        success: true,
        idProceso: proceso.idProceso,
        estadoActual: proceso.estadoActual,
        tipoGrano: proceso.tipoGrano,
        region: proceso.region,
        cantidadGramos: proceso.cantidadGramos,
        fechaInicio: proceso.fechaInicio,
        fechaActualizacion: proceso.fechaActualizacion,
        observaciones: proceso.observaciones,
        diasEnProceso: Math.floor((new Date() - new Date(proceso.fechaInicio)) / (1000 * 60 * 60 * 24))
      };
    } catch (error) {
      throw new Error(`Error obteniendo estado del proceso: ${error.message}`);
    }
  }

  // Obtener todos los procesos con filtros
  async obtenerProcesos(filtros = {}) {
    try {
      const procesos = await this.procesoProduccion.obtenerProcesos(filtros);
      
      return {
        success: true,
        total: procesos.length,
        procesos: procesos.map(p => ({
          idProceso: p.idProceso,
          tipoGrano: p.tipoGrano,
          region: p.region,
          cantidadGramos: p.cantidadGramos,
          estadoActual: p.estadoActual,
          fechaInicio: p.fechaInicio,
          fechaActualizacion: p.fechaActualizacion,
          observaciones: p.observaciones
        }))
      };
    } catch (error) {
      throw new Error(`Error obteniendo procesos: ${error.message}`);
    }
  }

  // ===== MÉTODOS DE INFORMES =====

  // Generar informe mensual detallado
  async generarInformeMensual(año, mes) {
    try {
      const informe = await this.procesoProduccion.generarInformeMensual(año, mes);
      
      return {
        success: true,
        informe: {
          resumen: informe.resumen,
          procesos: informe.procesos,
          fechaGeneracion: new Date()
        }
      };
    } catch (error) {
      throw new Error(`Error generando informe mensual: ${error.message}`);
    }
  }

  // Obtener estadísticas de producción por año
  async obtenerEstadisticasAnuales(año = null) {
    try {
      const estadisticas = await this.procesoProduccion.obtenerEstadisticasProduccion(año);
      
      return {
        success: true,
        año: año || 'Todos los años',
        estadisticas,
        fechaGeneracion: new Date()
      };
    } catch (error) {
      throw new Error(`Error obteniendo estadísticas anuales: ${error.message}`);
    }
  }

  // Generar resumen ejecutivo de producción
  async generarResumenEjecutivo(año = null) {
    try {
      const estadisticas = await this.procesoProduccion.obtenerEstadisticasProduccion(año);
      const procesos = await this.procesoProduccion.obtenerProcesos({
        fechaInicio: año ? `${año}-01-01` : null,
        fechaFin: año ? `${año}-12-31` : null
      });

      // Calcular métricas clave
      const listaProcesos = procesos.procesos || [];
      const totalProcesos = listaProcesos.length;
      const procesosCompletados = listaProcesos.filter(p => p.estadoActual === 'venta').length;
      const procesosEnProceso = totalProcesos - procesosCompletados;
      const tasaCompletacion = totalProcesos > 0 ? (procesosCompletados / totalProcesos * 100).toFixed(2) : 0;

      const totalGramos = listaProcesos.reduce((sum, p) => sum + (p.cantidadGramos || 0), 0);
      const gramosVendidos = listaProcesos
        .filter(p => p.estadoActual === 'venta')
        .reduce((sum, p) => sum + (p.cantidadGramos || 0), 0);

      // Distribución por estado
      const distribucionEstados = {};
      listaProcesos.forEach(p => {
        distribucionEstados[p.estadoActual] = (distribucionEstados[p.estadoActual] || 0) + 1;
      });

      return {
        success: true,
        resumen: {
          año: año || 'Todos los años',
          totalProcesos,
          procesosCompletados,
          procesosEnProceso,
          tasaCompletacion: `${tasaCompletacion}%`,
          totalGramos,
          gramosVendidos,
          distribucionEstados,
          estadisticasDetalladas: estadisticas
        },
        fechaGeneracion: new Date()
      };
    } catch (error) {
      throw new Error(`Error generando resumen ejecutivo: ${error.message}`);
    }
  }

  // ===== MÉTODOS DE OPERACIONES COMPOSITE =====

  // Crear operación usando patrón Composite
  crearOperacionComposite(tipoOperacion, configuracion = {}) {
    try {
      const operacion = this.gestorOperacionesComposite.crearOperacion(tipoOperacion, configuracion);
      
      return {
        success: true,
        operacion: {
          id: operacion.id,
          nombre: operacion.nombre,
          tipo: operacion.tipoOperacion,
          tiempoEstimado: operacion.obtenerTiempoEstimado(),
          costoEstimado: operacion.obtenerCostoEstimado(),
          informacion: operacion.obtenerInformacion()
        },
        mensaje: 'Operación creada exitosamente'
      };
    } catch (error) {
      throw new Error(`Error creando operación: ${error.message}`);
    }
  }

  // Programar operación para ejecución
  programarOperacionComposite(operacion, contexto) {
    try {
      const idOperacion = this.gestorOperacionesComposite.programarOperacion(operacion, contexto);
      
      return {
        success: true,
        idOperacion,
        mensaje: 'Operación programada exitosamente'
      };
    } catch (error) {
      throw new Error(`Error programando operación: ${error.message}`);
    }
  }

  // Ejecutar operación programada
  async ejecutarOperacionComposite(idOperacion, contexto) {
    try {
      const resultado = await this.gestorOperacionesComposite.ejecutarOperacion(idOperacion, contexto);
      
      return {
        success: true,
        resultado,
        mensaje: 'Operación ejecutada exitosamente'
      };
    } catch (error) {
      throw new Error(`Error ejecutando operación: ${error.message}`);
    }
  }

  // Obtener estado de operación
  obtenerEstadoOperacionComposite(idOperacion) {
    try {
      const estado = this.gestorOperacionesComposite.obtenerEstadoOperacion(idOperacion);
      
      return {
        success: true,
        estado,
        mensaje: 'Estado obtenido exitosamente'
      };
    } catch (error) {
      throw new Error(`Error obteniendo estado: ${error.message}`);
    }
  }

  // Obtener operaciones programadas
  obtenerOperacionesProgramadas() {
    try {
      const operaciones = this.gestorOperacionesComposite.obtenerOperacionesProgramadas();
      
      return {
        success: true,
        operaciones,
        total: operaciones.length,
        mensaje: 'Operaciones obtenidas exitosamente'
      };
    } catch (error) {
      throw new Error(`Error obteniendo operaciones: ${error.message}`);
    }
  }

  // Cancelar operación
  cancelarOperacionComposite(idOperacion) {
    try {
      const cancelada = this.gestorOperacionesComposite.cancelarOperacion(idOperacion);
      
      return {
        success: cancelada,
        mensaje: cancelada ? 'Operación cancelada exitosamente' : 'Operación no encontrada'
      };
    } catch (error) {
      throw new Error(`Error cancelando operación: ${error.message}`);
    }
  }

  // Obtener historial de operaciones
  obtenerHistorialOperaciones(filtros = {}) {
    try {
      const historial = this.gestorOperacionesComposite.obtenerHistorial(filtros);
      
      return {
        success: true,
        historial,
        total: historial.length,
        mensaje: 'Historial obtenido exitosamente'
      };
    } catch (error) {
      throw new Error(`Error obteniendo historial: ${error.message}`);
    }
  }

  // Obtener estadísticas de operaciones
  obtenerEstadisticasOperaciones() {
    try {
      const estadisticas = this.gestorOperacionesComposite.obtenerEstadisticas();
      
      return {
        success: true,
        estadisticas,
        mensaje: 'Estadísticas obtenidas exitosamente'
      };
    } catch (error) {
      throw new Error(`Error obteniendo estadísticas: ${error.message}`);
    }
  }

  // Obtener tipos de operaciones disponibles
  obtenerTiposOperacionesDisponibles() {
    try {
      const tipos = this.gestorOperacionesComposite.obtenerTiposOperacionesDisponibles();
      
      return {
        success: true,
        tipos,
        mensaje: 'Tipos de operaciones obtenidos exitosamente'
      };
    } catch (error) {
      throw new Error(`Error obteniendo tipos: ${error.message}`);
    }
  }

  // Obtener información de tipo de operación
  obtenerInformacionTipoOperacion(tipoOperacion) {
    try {
      const informacion = this.gestorOperacionesComposite.obtenerInformacionTipoOperacion(tipoOperacion);
      
      return {
        success: true,
        informacion,
        mensaje: 'Información obtenida exitosamente'
      };
    } catch (error) {
      throw new Error(`Error obteniendo información: ${error.message}`);
    }
  }

  // ===== MÉTODOS DE UTILIDAD =====

  // Obtener estados disponibles
  obtenerEstadosDisponibles() {
    return {
      success: true,
      estados: this.procesoProduccion.obtenerEstados(),
      descripcion: {
        cosecha: 'Granos recién cosechados',
        tostado: 'Granos en proceso de tostado',
        molido: 'Granos tostados siendo molidos',
        empaquetado: 'Café molido siendo empaquetado',
        venta: 'Producto listo para venta'
      }
    };
  }

  // Validar datos de entrada
  validarDatosProceso(datos) {
    const errores = [];
    
    if (!datos.tipoGrano) errores.push('Tipo de grano es requerido');
    if (!datos.region) errores.push('Región es requerida');
    if (!datos.cantidadGramos || datos.cantidadGramos <= 0) errores.push('Cantidad en gramos debe ser mayor a 0');
    if (!datos.precio || datos.precio <= 0) errores.push('Precio debe ser mayor a 0');
    if (!datos.fechaVencimiento) errores.push('Fecha de vencimiento es requerida');

    return {
      valido: errores.length === 0,
      errores
    };
  }

  // Obtener procesos próximos a vencer
  async obtenerProcesosProximosAVencer(dias = 30) {
    try {
      const sql = `
        SELECT pp.*, g.Fecha_Vencimiento
        FROM proceso_produccion pp
        LEFT JOIN granos g ON pp.idGranos = g.idGranos
        WHERE g.Fecha_Vencimiento <= DATE_ADD(NOW(), INTERVAL ? DAY)
        AND pp.estadoActual != 'venta'
        ORDER BY g.Fecha_Vencimiento ASC
      `;

      const connection = await pool.getConnection();
      try {
        const [rows] = await connection.execute(sql, [dias]);
        
        return {
          success: true,
          procesos: rows.map(p => ({
            idProceso: p.idProceso,
            tipoGrano: p.tipoGrano,
            region: p.region,
            estadoActual: p.estadoActual,
            cantidadGramos: p.cantidadGramos,
            fechaVencimiento: p.Fecha_Vencimiento,
            diasRestantes: Math.ceil((new Date(p.Fecha_Vencimiento) - new Date()) / (1000 * 60 * 60 * 24))
          })),
          total: rows.length
        };
      } finally {
        connection.release();
      }
    } catch (error) {
      throw new Error(`Error obteniendo procesos próximos a vencer: ${error.message}`);
    }
  }
}

module.exports = FacadeDeProduccion;
