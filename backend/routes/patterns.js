/**
 * Rutas para los patrones de diseño
 * Observer, Strategy y Command
 */

const express = require('express');
const router = express.Router();
const PatternController = require('../controllers/patternController');

// Crear instancia del controlador
const patternController = new PatternController();

// ===== RUTAS DEL PATRÓN OBSERVER =====

/**
 * @route POST /api/patterns/observer/verificar-stocks
 * @desc Verifica el stock de todos los granos y notifica si es bajo
 */
router.post('/observer/verificar-stocks', (req, res) => {
  patternController.verificarStocks(req, res);
});

/**
 * @route GET /api/patterns/observer/notificaciones
 * @desc Obtiene las notificaciones del responsable de compras
 */
router.get('/observer/notificaciones', (req, res) => {
  patternController.obtenerNotificaciones(req, res);
});

/**
 * @route GET /api/patterns/observer/logs
 * @desc Obtiene los logs del sistema
 * @query {string} severidad - Filtrar por severidad (opcional)
 */
router.get('/observer/logs', (req, res) => {
  patternController.obtenerLogsSistema(req, res);
});

/**
 * @route POST /api/patterns/observer/consumir-granos
 * @desc Simula el consumo de granos (para pruebas)
 * @body {number} idGranos - ID del grano
 * @body {number} cantidad - Cantidad a consumir
 */
router.post('/observer/consumir-granos', (req, res) => {
  patternController.consumirGranos(req, res);
});

// ===== RUTAS DEL PATRÓN STRATEGY =====

/**
 * @route POST /api/patterns/strategy/calcular
 * @desc Calcula distribución usando una estrategia específica
 * @body {string} estrategia - Tipo de estrategia (rapida, economica, balanceada)
 * @body {Object} pedido - Datos del pedido
 */
router.post('/strategy/calcular', (req, res) => {
  patternController.calcularDistribucion(req, res);
});

/**
 * @route POST /api/patterns/strategy/seleccionar-automatica
 * @desc Selecciona automáticamente la mejor estrategia
 * @body {Object} pedido - Datos del pedido
 */
router.post('/strategy/seleccionar-automatica', (req, res) => {
  patternController.seleccionarEstrategiaAutomatica(req, res);
});

/**
 * @route POST /api/patterns/strategy/comparar
 * @desc Compara todas las estrategias disponibles
 * @body {Object} pedido - Datos del pedido
 */
router.post('/strategy/comparar', (req, res) => {
  patternController.compararEstrategias(req, res);
});

/**
 * @route GET /api/patterns/strategy/disponibles
 * @desc Obtiene las estrategias disponibles
 */
router.get('/strategy/disponibles', (req, res) => {
  patternController.obtenerEstrategiasDisponibles(req, res);
});

// ===== RUTAS DEL PATRÓN COMMAND =====

/**
 * @route POST /api/patterns/command/ejecutar
 * @desc Ejecuta un comando de inventario
 * @body {string} tipoComando - Tipo de comando (agregar, retirar, actualizar)
 * @body {Object} datos - Datos del comando
 */
router.post('/command/ejecutar', (req, res) => {
  patternController.ejecutarComando(req, res);
});

/**
 * @route POST /api/patterns/command/deshacer
 * @desc Deshace el último comando ejecutado
 */
router.post('/command/deshacer', (req, res) => {
  patternController.deshacerComando(req, res);
});

/**
 * @route POST /api/patterns/command/rehacer
 * @desc Rehace el último comando deshecho
 */
router.post('/command/rehacer', (req, res) => {
  patternController.rehacerComando(req, res);
});

/**
 * @route GET /api/patterns/command/historial
 * @desc Obtiene el historial de comandos
 * @query {number} limite - Número máximo de registros (default: 10)
 */
router.get('/command/historial', (req, res) => {
  patternController.obtenerHistorialComandos(req, res);
});

/**
 * @route GET /api/patterns/command/estadisticas
 * @desc Obtiene estadísticas de comandos
 */
router.get('/command/estadisticas', (req, res) => {
  patternController.obtenerEstadisticasComandos(req, res);
});

module.exports = router;

