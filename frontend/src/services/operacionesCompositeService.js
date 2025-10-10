import axios from 'axios';

const API_BASE_URL = '/api/proceso-produccion';

class OperacionesCompositeService {
  // ===== MÉTODOS DE OPERACIONES COMPOSITE =====

  // Crear operación usando patrón Composite
  async crearOperacionComposite(tipoOperacion, configuracion = {}) {
    try {
      const response = await axios.post(`${API_BASE_URL}/operaciones/crear`, {
        tipoOperacion,
        configuracion
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Programar operación para ejecución
  async programarOperacionComposite(operacion, contexto) {
    try {
      const response = await axios.post(`${API_BASE_URL}/operaciones/programar`, {
        operacion,
        contexto
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Ejecutar operación programada
  async ejecutarOperacionComposite(idOperacion, contexto) {
    try {
      const response = await axios.post(`${API_BASE_URL}/operaciones/${idOperacion}/ejecutar`, contexto);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Obtener estado de operación
  async obtenerEstadoOperacionComposite(idOperacion) {
    try {
      const response = await axios.get(`${API_BASE_URL}/operaciones/${idOperacion}/estado`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Obtener operaciones programadas
  async obtenerOperacionesProgramadas() {
    try {
      const response = await axios.get(`${API_BASE_URL}/operaciones/programadas`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Cancelar operación
  async cancelarOperacionComposite(idOperacion) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/operaciones/${idOperacion}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Obtener historial de operaciones
  async obtenerHistorialOperaciones(filtros = {}) {
    try {
      const params = new URLSearchParams();
      Object.keys(filtros).forEach(key => {
        if (filtros[key] !== null && filtros[key] !== undefined && filtros[key] !== '') {
          params.append(key, filtros[key]);
        }
      });
      
      const response = await axios.get(`${API_BASE_URL}/operaciones/historial?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Obtener estadísticas de operaciones
  async obtenerEstadisticasOperaciones() {
    try {
      const response = await axios.get(`${API_BASE_URL}/operaciones/estadisticas`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Obtener tipos de operaciones disponibles
  async obtenerTiposOperacionesDisponibles() {
    try {
      const response = await axios.get(`${API_BASE_URL}/operaciones/tipos`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Obtener información de tipo de operación
  async obtenerInformacionTipoOperacion(tipoOperacion) {
    try {
      const response = await axios.get(`${API_BASE_URL}/operaciones/tipos/${tipoOperacion}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ===== MÉTODOS DE UTILIDAD =====

  // Obtener nombre del tipo de operación
  obtenerNombreTipoOperacion(tipo) {
    const nombres = {
      'lote_completo': 'Lote Completo',
      'proceso_especial': 'Proceso Especial',
      'tostado': 'Tostado',
      'molido': 'Molido',
      'envasado': 'Envasado'
    };
    return nombres[tipo] || tipo;
  }

  // Obtener descripción del tipo de operación
  obtenerDescripcionTipoOperacion(tipo) {
    const descripciones = {
      'lote_completo': 'Proceso completo: Tostado → Molido → Envasado',
      'proceso_especial': 'Proceso especializado con configuraciones personalizadas',
      'tostado': 'Proceso de tostado de granos de café',
      'molido': 'Proceso de molido de granos tostados',
      'envasado': 'Proceso de envasado de café molido'
    };
    return descripciones[tipo] || 'Sin descripción';
  }

  // Obtener icono del tipo de operación
  obtenerIconoTipoOperacion(tipo) {
    const iconos = {
      'lote_completo': '🏭',
      'proceso_especial': '⭐',
      'tostado': '🔥',
      'molido': '⚙️',
      'envasado': '📦'
    };
    return iconos[tipo] || '❓';
  }

  // Obtener color del estado de operación
  obtenerColorEstadoOperacion(estado) {
    const colores = {
      'pendiente': '#f59e0b', // amber-500
      'en_progreso': '#3b82f6', // blue-500
      'completada': '#10b981', // emerald-500
      'fallida': '#ef4444', // red-500
      'cancelada': '#6b7280' // gray-500
    };
    return colores[estado] || '#6b7280';
  }

  // Obtener icono del estado de operación
  obtenerIconoEstadoOperacion(estado) {
    const iconos = {
      'pendiente': '⏳',
      'en_progreso': '🔄',
      'completada': '✅',
      'fallida': '❌',
      'cancelada': '🚫'
    };
    return iconos[estado] || '❓';
  }

  // Formatear tiempo en minutos
  formatearTiempo(minutos) {
    if (minutos < 60) {
      return `${minutos} min`;
    } else {
      const horas = Math.floor(minutos / 60);
      const mins = minutos % 60;
      return mins > 0 ? `${horas}h ${mins}min` : `${horas}h`;
    }
  }

  // Formatear costo
  formatearCosto(costo) {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(costo);
  }

  // Formatear fecha
  formatearFecha(fecha) {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Calcular tiempo transcurrido
  calcularTiempoTranscurrido(fechaInicio, fechaFin = null) {
    if (!fechaInicio) return 0;
    const inicio = new Date(fechaInicio);
    const fin = fechaFin ? new Date(fechaFin) : new Date();
    const diferencia = fin - inicio;
    return Math.floor(diferencia / (1000 * 60)); // en minutos
  }

  // Validar contexto de operación
  validarContextoOperacion(contexto, tipoOperacion) {
    const errores = [];
    
    if (!contexto.cantidadGramos || contexto.cantidadGramos <= 0) {
      errores.push('Cantidad de gramos debe ser mayor a 0');
    }
    
    if (!contexto.tipoGrano) {
      errores.push('Tipo de grano es requerido');
    }
    
    if (!contexto.region) {
      errores.push('Región es requerida');
    }
    
    // Validaciones específicas por tipo
    switch (tipoOperacion) {
      case 'lote_completo':
        if (contexto.cantidadGramos < 200) {
          errores.push('Cantidad mínima para lote completo: 200g');
        }
        if (contexto.cantidadGramos > 3000) {
          errores.push('Cantidad máxima para lote completo: 3000g');
        }
        break;
        
      case 'proceso_especial':
        if (contexto.cantidadGramos < 100) {
          errores.push('Cantidad mínima para proceso especial: 100g');
        }
        if (contexto.cantidadGramos > 5000) {
          errores.push('Cantidad máxima para proceso especial: 5000g');
        }
        break;
        
      case 'tostado':
        if (contexto.cantidadGramos < 100) {
          errores.push('Cantidad mínima para tostado: 100g');
        }
        if (contexto.cantidadGramos > 5000) {
          errores.push('Cantidad máxima para tostado: 5000g');
        }
        break;
        
      case 'molido':
        if (contexto.cantidadGramos < 50) {
          errores.push('Cantidad mínima para molido: 50g');
        }
        if (contexto.cantidadGramos > 2000) {
          errores.push('Cantidad máxima para molido: 2000g');
        }
        break;
        
      case 'envasado':
        if (contexto.cantidadGramos < 100) {
          errores.push('Cantidad mínima para envasado: 100g');
        }
        if (contexto.cantidadGramos > 10000) {
          errores.push('Cantidad máxima para envasado: 10000g');
        }
        break;
    }
    
    return {
      valido: errores.length === 0,
      errores
    };
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
}

// Crear instancia singleton
const operacionesCompositeService = new OperacionesCompositeService();

export default operacionesCompositeService;
