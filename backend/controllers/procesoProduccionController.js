const FacadeDeProduccion = require('../ProcesoProduccion/FacadeDeProduccion');

class ProcesoProduccionController {
  constructor() {
    this.facade = new FacadeDeProduccion();
  }

  // ===== MÉTODOS PRINCIPALES =====

  // Iniciar proceso completo de producción
  async iniciarProcesoCompleto(req, res) {
    try {
      const datosIniciales = req.body;
      
      // Validar datos de entrada
      const validacion = this.facade.validarDatosProceso(datosIniciales);
      if (!validacion.valido) {
        return res.status(400).json({
          success: false,
          error: 'Datos inválidos',
          detalles: validacion.errores
        });
      }

      const resultado = await this.facade.iniciarProcesoCompleto(datosIniciales);
      
      res.status(201).json({
        success: true,
        message: 'Proceso de producción iniciado exitosamente',
        data: resultado
      });
    } catch (error) {
      console.error('Error iniciando proceso completo:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  // Avanzar proceso al siguiente estado
  async avanzarProceso(req, res) {
    try {
      const { idProceso } = req.params;
      const { observaciones = '' } = req.body;

      if (!idProceso) {
        return res.status(400).json({
          success: false,
          error: 'ID del proceso es requerido'
        });
      }

      const resultado = await this.facade.avanzarProceso(idProceso, observaciones);
      
      res.json({
        success: true,
        message: 'Proceso avanzado exitosamente',
        data: resultado
      });
    } catch (error) {
      console.error('Error avanzando proceso:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  // Obtener estado actual de un proceso
  async obtenerEstadoProceso(req, res) {
    try {
      const { idProceso } = req.params;

      if (!idProceso) {
        return res.status(400).json({
          success: false,
          error: 'ID del proceso es requerido'
        });
      }

      const resultado = await this.facade.obtenerEstadoProceso(idProceso);
      
      res.json({
        success: true,
        data: resultado
      });
    } catch (error) {
      console.error('Error obteniendo estado del proceso:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  // Obtener todos los procesos con filtros
  async obtenerProcesos(req, res) {
    try {
      const filtros = req.query;
      
      const resultado = await this.facade.obtenerProcesos(filtros);
      
      res.json({
        success: true,
        data: resultado
      });
    } catch (error) {
      console.error('Error obteniendo procesos:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  // ===== MÉTODOS DE INFORMES =====

  // Generar informe mensual
  async generarInformeMensual(req, res) {
    try {
      const { año, mes } = req.params;

      if (!año || !mes) {
        return res.status(400).json({
          success: false,
          error: 'Año y mes son requeridos'
        });
      }

      const añoNum = parseInt(año);
      const mesNum = parseInt(mes);

      if (isNaN(añoNum) || isNaN(mesNum) || mesNum < 1 || mesNum > 12) {
        return res.status(400).json({
          success: false,
          error: 'Año y mes deben ser números válidos'
        });
      }

      const resultado = await this.facade.generarInformeMensual(añoNum, mesNum);
      
      res.json({
        success: true,
        data: resultado
      });
    } catch (error) {
      console.error('Error generando informe mensual:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  // Obtener estadísticas anuales
  async obtenerEstadisticasAnuales(req, res) {
    try {
      const { año } = req.params;
      const añoNum = año ? parseInt(año) : null;

      if (año && (isNaN(añoNum) || añoNum < 2000 || añoNum > 2100)) {
        return res.status(400).json({
          success: false,
          error: 'Año debe ser un número válido entre 2000 y 2100'
        });
      }

      const resultado = await this.facade.obtenerEstadisticasAnuales(añoNum);
      
      res.json({
        success: true,
        data: resultado
      });
    } catch (error) {
      console.error('Error obteniendo estadísticas anuales:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  // Generar resumen ejecutivo
  async generarResumenEjecutivo(req, res) {
    try {
      const { año } = req.query;
      const añoNum = año ? parseInt(año) : null;

      if (año && (isNaN(añoNum) || añoNum < 2000 || añoNum > 2100)) {
        return res.status(400).json({
          success: false,
          error: 'Año debe ser un número válido entre 2000 y 2100'
        });
      }

      const resultado = await this.facade.generarResumenEjecutivo(añoNum);
      
      res.json({
        success: true,
        data: resultado
      });
    } catch (error) {
      console.error('Error generando resumen ejecutivo:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  // ===== MÉTODOS DE UTILIDAD =====

  // Obtener estados disponibles
  async obtenerEstadosDisponibles(req, res) {
    try {
      const resultado = this.facade.obtenerEstadosDisponibles();
      
      res.json({
        success: true,
        data: resultado
      });
    } catch (error) {
      console.error('Error obteniendo estados disponibles:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  // Obtener procesos próximos a vencer
  async obtenerProcesosProximosAVencer(req, res) {
    try {
      const { dias = 30 } = req.query;
      const diasNum = parseInt(dias);

      if (isNaN(diasNum) || diasNum < 1 || diasNum > 365) {
        return res.status(400).json({
          success: false,
          error: 'Días debe ser un número válido entre 1 y 365'
        });
      }

      const resultado = await this.facade.obtenerProcesosProximosAVencer(diasNum);
      
      res.json({
        success: true,
        data: resultado
      });
    } catch (error) {
      console.error('Error obteniendo procesos próximos a vencer:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  // ===== MÉTODOS DE DASHBOARD =====

  // Endpoint simple para probar la conexión
  async probarConexion(req, res) {
    try {
      res.json({
        success: true,
        message: 'Conexión exitosa',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Obtener métricas para dashboard
  async obtenerMetricasDashboard(req, res) {
    try {
      const { año = new Date().getFullYear() } = req.query;
      const añoNum = parseInt(año);

      if (isNaN(añoNum)) {
        return res.status(400).json({
          success: false,
          error: 'Año debe ser un número válido'
        });
      }

      // Obtener resumen ejecutivo
      let resumenEjecutivo;
      try {
        resumenEjecutivo = await this.facade.generarResumenEjecutivo(añoNum);
      } catch (error) {
        console.warn('Error obteniendo resumen ejecutivo:', error.message);
        resumenEjecutivo = { data: { resumen: {} } };
      }
      
      // Obtener procesos próximos a vencer
      let procesosProximosAVencer;
      try {
        procesosProximosAVencer = await this.facade.obtenerProcesosProximosAVencer(30);
      } catch (error) {
        console.warn('Error obteniendo procesos próximos a vencer:', error.message);
        procesosProximosAVencer = { data: [] };
      }
      
      // Obtener distribución por estado
      let procesos;
      try {
        procesos = await this.facade.obtenerProcesos({
          fechaInicio: `${añoNum}-01-01`,
          fechaFin: `${añoNum}-12-31`
        });
      } catch (error) {
        console.warn('Error obteniendo procesos:', error.message);
        procesos = { data: { total: 0 } };
      }

      const metricas = {
        año: añoNum,
        resumen: resumenEjecutivo.data?.resumen || {
          totalProcesos: 0,
          procesosCompletados: 0,
          procesosEnProceso: 0,
          tasaCompletacion: '0%',
          totalGramos: 0,
          gramosVendidos: 0,
          distribucionEstados: {}
        },
        procesosProximosAVencer: procesosProximosAVencer.data || [],
        distribucionEstados: resumenEjecutivo.data?.resumen?.distribucionEstados || {},
        totalProcesos: procesos.data?.total || 0,
        fechaGeneracion: new Date()
      };

      res.json({
        success: true,
        data: metricas
      });
    } catch (error) {
      console.error('Error obteniendo métricas del dashboard:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  // ===== MÉTODOS DE OPERACIONES COMPOSITE =====

  // Crear operación usando patrón Composite
  async crearOperacionComposite(req, res) {
    try {
      const { tipoOperacion, configuracion = {} } = req.body;

      if (!tipoOperacion) {
        return res.status(400).json({
          success: false,
          error: 'Tipo de operación es requerido'
        });
      }

      const resultado = this.facade.crearOperacionComposite(tipoOperacion, configuracion);
      
      res.status(201).json({
        success: true,
        message: 'Operación creada exitosamente',
        data: resultado
      });
    } catch (error) {
      console.error('Error creando operación composite:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  // Programar operación para ejecución
  async programarOperacionComposite(req, res) {
    try {
      const { operacion, contexto } = req.body;

      if (!operacion || !contexto) {
        return res.status(400).json({
          success: false,
          error: 'Operación y contexto son requeridos'
        });
      }

      const resultado = this.facade.programarOperacionComposite(operacion, contexto);
      
      res.status(201).json({
        success: true,
        message: 'Operación programada exitosamente',
        data: resultado
      });
    } catch (error) {
      console.error('Error programando operación composite:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  // Ejecutar operación programada
  async ejecutarOperacionComposite(req, res) {
    try {
      const { idOperacion } = req.params;
      const contexto = req.body;

      if (!idOperacion) {
        return res.status(400).json({
          success: false,
          error: 'ID de operación es requerido'
        });
      }

      const resultado = await this.facade.ejecutarOperacionComposite(idOperacion, contexto);
      
      res.json({
        success: true,
        message: 'Operación ejecutada exitosamente',
        data: resultado
      });
    } catch (error) {
      console.error('Error ejecutando operación composite:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  // Obtener estado de operación
  async obtenerEstadoOperacionComposite(req, res) {
    try {
      const { idOperacion } = req.params;

      if (!idOperacion) {
        return res.status(400).json({
          success: false,
          error: 'ID de operación es requerido'
        });
      }

      const resultado = this.facade.obtenerEstadoOperacionComposite(idOperacion);
      
      res.json({
        success: true,
        data: resultado
      });
    } catch (error) {
      console.error('Error obteniendo estado de operación composite:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  // Obtener operaciones programadas
  async obtenerOperacionesProgramadas(req, res) {
    try {
      const resultado = this.facade.obtenerOperacionesProgramadas();
      
      res.json({
        success: true,
        data: resultado
      });
    } catch (error) {
      console.error('Error obteniendo operaciones programadas:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  // Cancelar operación
  async cancelarOperacionComposite(req, res) {
    try {
      const { idOperacion } = req.params;

      if (!idOperacion) {
        return res.status(400).json({
          success: false,
          error: 'ID de operación es requerido'
        });
      }

      const resultado = this.facade.cancelarOperacionComposite(idOperacion);
      
      res.json({
        success: true,
        data: resultado
      });
    } catch (error) {
      console.error('Error cancelando operación composite:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  // Obtener historial de operaciones
  async obtenerHistorialOperaciones(req, res) {
    try {
      const filtros = req.query;
      
      const resultado = this.facade.obtenerHistorialOperaciones(filtros);
      
      res.json({
        success: true,
        data: resultado
      });
    } catch (error) {
      console.error('Error obteniendo historial de operaciones:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  // Obtener estadísticas de operaciones
  async obtenerEstadisticasOperaciones(req, res) {
    try {
      const resultado = this.facade.obtenerEstadisticasOperaciones();
      
      res.json({
        success: true,
        data: resultado
      });
    } catch (error) {
      console.error('Error obteniendo estadísticas de operaciones:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  // Obtener tipos de operaciones disponibles
  async obtenerTiposOperacionesDisponibles(req, res) {
    try {
      const resultado = this.facade.obtenerTiposOperacionesDisponibles();
      
      res.json({
        success: true,
        data: resultado
      });
    } catch (error) {
      console.error('Error obteniendo tipos de operaciones:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  // Obtener información de tipo de operación
  async obtenerInformacionTipoOperacion(req, res) {
    try {
      const { tipoOperacion } = req.params;

      if (!tipoOperacion) {
        return res.status(400).json({
          success: false,
          error: 'Tipo de operación es requerido'
        });
      }

      const resultado = this.facade.obtenerInformacionTipoOperacion(tipoOperacion);
      
      res.json({
        success: true,
        data: resultado
      });
    } catch (error) {
      console.error('Error obteniendo información de tipo de operación:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }
}

module.exports = ProcesoProduccionController;
