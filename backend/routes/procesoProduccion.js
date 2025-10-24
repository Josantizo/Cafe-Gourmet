const express = require('express');
const router = express.Router();
const ProcesoProduccionController = require('../controllers/procesoProduccionController');

const controller = new ProcesoProduccionController();

// ===== RUTAS PRINCIPALES =====

// POST /api/proceso-produccion/iniciar
// Iniciar un nuevo proceso completo de producción
router.post('/iniciar', (req, res) => {
  controller.iniciarProcesoCompleto(req, res);
});

// PUT /api/proceso-produccion/:idProceso/avanzar
// Avanzar un proceso al siguiente estado
router.put('/:idProceso/avanzar', (req, res) => {
  controller.avanzarProceso(req, res);
});

// GET /api/proceso-produccion/:idProceso/estado
// Obtener el estado actual de un proceso
router.get('/:idProceso/estado', (req, res) => {
  controller.obtenerEstadoProceso(req, res);
});

// GET /api/proceso-produccion
// Obtener todos los procesos con filtros opcionales
// Query params: estado, tipoGrano, region, fechaInicio, fechaFin
router.get('/', (req, res) => {
  controller.obtenerProcesos(req, res);
});

// ===== RUTAS DE INFORMES =====

// GET /api/proceso-produccion/informes/mensual/:año/:mes
// Generar informe mensual detallado
router.get('/informes/mensual/:año/:mes', (req, res) => {
  controller.generarInformeMensual(req, res);
});

// GET /api/proceso-produccion/informes/estadisticas/:año?
// Obtener estadísticas anuales (opcional especificar año)
router.get('/informes/estadisticas/:año?', (req, res) => {
  controller.obtenerEstadisticasAnuales(req, res);
});

// GET /api/proceso-produccion/informes/resumen-ejecutivo
// Generar resumen ejecutivo
// Query param: año (opcional)
router.get('/informes/resumen-ejecutivo', (req, res) => {
  controller.generarResumenEjecutivo(req, res);
});

// ===== RUTAS DE UTILIDAD =====

// GET /api/proceso-produccion/estados
// Obtener estados disponibles del proceso
router.get('/estados', (req, res) => {
  controller.obtenerEstadosDisponibles(req, res);
});

// GET /api/proceso-produccion/proximos-vencer
// Obtener procesos próximos a vencer
// Query param: dias (opcional, default: 30)
router.get('/proximos-vencer', (req, res) => {
  controller.obtenerProcesosProximosAVencer(req, res);
});

// ===== RUTAS DE DASHBOARD =====

// GET /api/proceso-produccion/test
// Endpoint simple para probar conexión
router.get('/test', (req, res) => {
  controller.probarConexion(req, res);
});

// GET /api/proceso-produccion/dashboard/metricas
// Obtener métricas para dashboard
// Query param: año (opcional, default: año actual)
router.get('/dashboard/metricas', (req, res) => {
  controller.obtenerMetricasDashboard(req, res);
});

// ===== RUTAS DE OPERACIONES COMPOSITE =====

// POST /api/proceso-produccion/operaciones/crear
// Crear operación usando patrón Composite
router.post('/operaciones/crear', (req, res) => {
  controller.crearOperacionComposite(req, res);
});

// POST /api/proceso-produccion/operaciones/programar
// Programar operación para ejecución
router.post('/operaciones/programar', (req, res) => {
  controller.programarOperacionComposite(req, res);
});

// POST /api/proceso-produccion/operaciones/:idOperacion/ejecutar
// Ejecutar operación programada
router.post('/operaciones/:idOperacion/ejecutar', (req, res) => {
  controller.ejecutarOperacionComposite(req, res);
});

// GET /api/proceso-produccion/operaciones/:idOperacion/estado
// Obtener estado de operación
router.get('/operaciones/:idOperacion/estado', (req, res) => {
  controller.obtenerEstadoOperacionComposite(req, res);
});

// GET /api/proceso-produccion/operaciones/programadas
// Obtener operaciones programadas
router.get('/operaciones/programadas', (req, res) => {
  controller.obtenerOperacionesProgramadas(req, res);
});

// DELETE /api/proceso-produccion/operaciones/:idOperacion
// Cancelar operación
router.delete('/operaciones/:idOperacion', (req, res) => {
  controller.cancelarOperacionComposite(req, res);
});

// GET /api/proceso-produccion/operaciones/historial
// Obtener historial de operaciones
// Query params: tipoOperacion, fechaInicio, fechaFin, estado
router.get('/operaciones/historial', (req, res) => {
  controller.obtenerHistorialOperaciones(req, res);
});

// GET /api/proceso-produccion/operaciones/estadisticas
// Obtener estadísticas de operaciones
router.get('/operaciones/estadisticas', (req, res) => {
  controller.obtenerEstadisticasOperaciones(req, res);
});

// GET /api/proceso-produccion/operaciones/tipos
// Obtener tipos de operaciones disponibles
router.get('/operaciones/tipos', (req, res) => {
  controller.obtenerTiposOperacionesDisponibles(req, res);
});

// GET /api/proceso-produccion/operaciones/tipos/:tipoOperacion
// Obtener información de tipo de operación
router.get('/operaciones/tipos/:tipoOperacion', (req, res) => {
  controller.obtenerInformacionTipoOperacion(req, res);
});

// ===== RUTAS DE DOCUMENTACIÓN =====

// GET /api/proceso-produccion/docs
// Documentación de la API
router.get('/docs', (req, res) => {
  res.json({
    success: true,
    message: 'API de Proceso de Producción de Café',
    version: '2.0.0',
    endpoints: {
      principales: {
        'POST /iniciar': 'Iniciar proceso completo de producción',
        'PUT /:idProceso/avanzar': 'Avanzar proceso al siguiente estado',
        'GET /:idProceso/estado': 'Obtener estado actual del proceso',
        'GET /': 'Obtener todos los procesos con filtros'
      },
      operacionesComposite: {
        'POST /operaciones/crear': 'Crear operación usando patrón Composite',
        'POST /operaciones/programar': 'Programar operación para ejecución',
        'POST /operaciones/:idOperacion/ejecutar': 'Ejecutar operación programada',
        'GET /operaciones/:idOperacion/estado': 'Obtener estado de operación',
        'GET /operaciones/programadas': 'Obtener operaciones programadas',
        'DELETE /operaciones/:idOperacion': 'Cancelar operación',
        'GET /operaciones/historial': 'Obtener historial de operaciones',
        'GET /operaciones/estadisticas': 'Obtener estadísticas de operaciones',
        'GET /operaciones/tipos': 'Obtener tipos de operaciones disponibles',
        'GET /operaciones/tipos/:tipoOperacion': 'Obtener información de tipo de operación'
      },
      informes: {
        'GET /informes/mensual/:año/:mes': 'Informe mensual detallado',
        'GET /informes/estadisticas/:año?': 'Estadísticas anuales',
        'GET /informes/resumen-ejecutivo': 'Resumen ejecutivo'
      },
      utilidad: {
        'GET /estados': 'Estados disponibles',
        'GET /proximos-vencer': 'Procesos próximos a vencer',
        'GET /dashboard/metricas': 'Métricas para dashboard'
      }
    },
    estados: {
      cosecha: 'Granos recién cosechados',
      tostado: 'Granos en proceso de tostado',
      molido: 'Granos tostados siendo molidos',
      empaquetado: 'Café molido siendo empaquetado',
      venta: 'Producto listo para venta'
    },
    tiposOperaciones: {
      lote_completo: 'Proceso completo: Tostado → Molido → Envasado',
      proceso_especial: 'Proceso especializado con configuraciones personalizadas',
      tostado: 'Proceso de tostado de granos de café',
      molido: 'Proceso de molido de granos tostados',
      envasado: 'Proceso de envasado de café molido'
    },
    ejemploIniciar: {
      tipoGrano: 'Arabico',
      region: 'Antigua',
      cantidadGramos: 1000,
      precio: 25.50,
      fechaVencimiento: '2024-12-31'
    },
    ejemploAvanzar: {
      observaciones: 'Proceso completado exitosamente'
    },
    ejemploOperacionComposite: {
      tipoOperacion: 'lote_completo',
      configuracion: {},
      contexto: {
        cantidadGramos: 1000,
        tipoGrano: 'Arabico',
        region: 'Antigua',
        tipoPreparacion: 'filtro',
        fechaVencimiento: '2024-12-31'
      }
    }
  });
});

module.exports = router;
