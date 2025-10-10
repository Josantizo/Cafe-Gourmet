import axios from 'axios';

const API_BASE_URL = '/api/proceso-produccion';

class ProcesoProduccionService {
  // ===== MÉTODOS PRINCIPALES =====

  // Iniciar proceso completo de producción
  async iniciarProcesoCompleto(datosProceso) {
    try {
      const response = await axios.post(`${API_BASE_URL}/iniciar`, datosProceso);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Avanzar proceso al siguiente estado
  async avanzarProceso(idProceso, observaciones = '') {
    try {
      const response = await axios.put(`${API_BASE_URL}/${idProceso}/avanzar`, {
        observaciones
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Obtener estado actual de un proceso
  async obtenerEstadoProceso(idProceso) {
    try {
      const response = await axios.get(`${API_BASE_URL}/${idProceso}/estado`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Obtener todos los procesos con filtros
  async obtenerProcesos(filtros = {}) {
    try {
      const params = new URLSearchParams();
      Object.keys(filtros).forEach(key => {
        if (filtros[key] !== null && filtros[key] !== undefined && filtros[key] !== '') {
          params.append(key, filtros[key]);
        }
      });
      
      const response = await axios.get(`${API_BASE_URL}?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ===== MÉTODOS DE INFORMES =====

  // Generar informe mensual
  async generarInformeMensual(año, mes) {
    try {
      const response = await axios.get(`${API_BASE_URL}/informes/mensual/${año}/${mes}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Obtener estadísticas anuales
  async obtenerEstadisticasAnuales(año = null) {
    try {
      const url = año ? `${API_BASE_URL}/informes/estadisticas/${año}` : `${API_BASE_URL}/informes/estadisticas`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Generar resumen ejecutivo
  async generarResumenEjecutivo(año = null) {
    try {
      const params = año ? `?año=${año}` : '';
      const response = await axios.get(`${API_BASE_URL}/informes/resumen-ejecutivo${params}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ===== MÉTODOS DE UTILIDAD =====

  // Obtener estados disponibles
  async obtenerEstadosDisponibles() {
    try {
      const response = await axios.get(`${API_BASE_URL}/estados`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Obtener procesos próximos a vencer
  async obtenerProcesosProximosAVencer(dias = 30) {
    try {
      const response = await axios.get(`${API_BASE_URL}/proximos-vencer?dias=${dias}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Obtener métricas del dashboard
  async obtenerMetricasDashboard(año = null) {
    try {
      const params = año ? `?año=${año}` : '';
      const response = await axios.get(`${API_BASE_URL}/dashboard/metricas${params}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ===== MÉTODOS DE VALIDACIÓN =====

  // Validar datos de proceso
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

  // ===== MÉTODOS DE UTILIDAD =====

  // Obtener nombre del estado
  obtenerNombreEstado(estado) {
    const nombres = {
      cosecha: 'Cosecha',
      tostado: 'Tostado',
      molido: 'Molido',
      empaquetado: 'Empaquetado',
      venta: 'Venta'
    };
    return nombres[estado] || estado;
  }

  // Obtener color del estado
  obtenerColorEstado(estado) {
    const colores = {
      cosecha: '#f59e0b', // amber-500
      tostado: '#ef4444', // red-500
      molido: '#8b5cf6', // violet-500
      empaquetado: '#06b6d4', // cyan-500
      venta: '#10b981' // emerald-500
    };
    return colores[estado] || '#6b7280';
  }

  // Obtener icono del estado
  obtenerIconoEstado(estado) {
    const iconos = {
      cosecha: '🌱',
      tostado: '🔥',
      molido: '⚙️',
      empaquetado: '📦',
      venta: '✅'
    };
    return iconos[estado] || '❓';
  }

  // Formatear fecha
  formatearFecha(fecha) {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Formatear número
  formatearNumero(numero, decimales = 0) {
    if (numero === null || numero === undefined) return 'N/A';
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: decimales,
      maximumFractionDigits: decimales
    }).format(numero);
  }

  // Calcular días transcurridos
  calcularDiasTranscurridos(fechaInicio) {
    if (!fechaInicio) return 0;
    const inicio = new Date(fechaInicio);
    const ahora = new Date();
    const diferencia = ahora - inicio;
    return Math.floor(diferencia / (1000 * 60 * 60 * 24));
  }

  // ===== MANEJO DE ERRORES =====

  handleError(error) {
    if (error.response) {
      // Error de respuesta del servidor
      return {
        message: error.response.data.message || 'Error del servidor',
        detalles: error.response.data.detalles || [],
        status: error.response.status
      };
    } else if (error.request) {
      // Error de red
      return {
        message: 'Error de conexión. Verifique su conexión a internet.',
        detalles: [],
        status: 0
      };
    } else {
      // Error desconocido
      return {
        message: 'Error desconocido',
        detalles: [],
        status: 0
      };
    }
  }

  // ===== MÉTODOS DE CONFIGURACIÓN =====

  // Configurar interceptores de axios
  configurarInterceptores() {
    // Interceptor de request
    axios.interceptors.request.use(
      (config) => {
        // Agregar timestamp para evitar cache
        config.params = config.params || {};
        config.params._t = Date.now();
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor de response
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        // Log de errores en desarrollo
        if (process.env.NODE_ENV === 'development') {
          console.error('API Error:', error);
        }
        return Promise.reject(error);
      }
    );
  }
}

// Crear instancia singleton
const procesoProduccionService = new ProcesoProduccionService();

// Configurar interceptores
procesoProduccionService.configurarInterceptores();

export default procesoProduccionService;
