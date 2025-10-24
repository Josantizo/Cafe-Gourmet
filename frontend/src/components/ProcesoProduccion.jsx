import React, { useState, useEffect } from 'react';
import procesoProduccionService from '../services/procesoProduccionService';
import operacionesCompositeService from '../services/operacionesCompositeService';
import './ProcesoProduccion.css';

function ProcesoProduccion() {
  const [activeView, setActiveView] = useState('dashboard');
  const [procesos, setProcesos] = useState([]);
  const [estados, setEstados] = useState({});
  const [metricas, setMetricas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    estado: '',
    tipoGrano: '',
    region: ''
  });
  
  // Estados para operaciones Composite
  const [operacionesProgramadas, setOperacionesProgramadas] = useState([]);
  const [tiposOperaciones, setTiposOperaciones] = useState([]);
  const [historialOperaciones, setHistorialOperaciones] = useState([]);
  const [estadisticasOperaciones, setEstadisticasOperaciones] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    setLoading(true);
    try {
      const [procesosData, estadosData, metricasData, tiposData, operacionesData, historialData, estadisticasData] = await Promise.all([
        procesoProduccionService.obtenerProcesos(),
        procesoProduccionService.obtenerEstadosDisponibles(),
        procesoProduccionService.obtenerMetricasDashboard(),
        operacionesCompositeService.obtenerTiposOperacionesDisponibles(),
        operacionesCompositeService.obtenerOperacionesProgramadas(),
        operacionesCompositeService.obtenerHistorialOperaciones(),
        operacionesCompositeService.obtenerEstadisticasOperaciones()
      ]);

      setProcesos(procesosData.data?.procesos || []);
      setEstados(estadosData.data || {});
      setMetricas(metricasData.data || {});
      setTiposOperaciones(tiposData.data?.tipos || []);
      setOperacionesProgramadas(operacionesData.data?.operaciones || []);
      setHistorialOperaciones(historialData.data?.historial || []);
      setEstadisticasOperaciones(estadisticasData.data?.estadisticas || {});
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cargarProcesos = async () => {
    setLoading(true);
    try {
      const procesosData = await procesoProduccionService.obtenerProcesos(filtros);
      setProcesos(procesosData.data.procesos);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const aplicarFiltros = () => {
    cargarProcesos();
  };

  const limpiarFiltros = () => {
    setFiltros({ estado: '', tipoGrano: '', region: '' });
    cargarProcesos();
  };

  const views = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'procesos', label: 'Procesos', icon: '⚙️' },
    { id: 'nuevo', label: 'Nuevo Proceso', icon: '➕' },
    { id: 'operaciones', label: 'Operaciones Composite', icon: '🏭' },
    { id: 'informes', label: 'Informes', icon: '📈' }
  ];

  if (loading && procesos.length === 0) {
    return (
      <div className="proceso-produccion">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando datos del proceso de producción...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="proceso-produccion">
      {/* Header */}
      <div className="proceso-header">
        <div className="proceso-title">
          <h1>🏭 Proceso de Producción</h1>
          <p>Gestión completa del ciclo de producción de café</p>
        </div>
        
        <div className="proceso-views">
          {views.map(view => (
            <button
              key={view.id}
              className={`view-tab ${activeView === view.id ? 'active' : ''}`}
              onClick={() => setActiveView(view.id)}
            >
              <span className="view-icon">{view.icon}</span>
              <span className="view-label">{view.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
          <button onClick={cargarDatosIniciales} className="retry-button">
            Reintentar
          </button>
        </div>
      )}

      {/* Content */}
      <div className="proceso-content">
        {activeView === 'dashboard' && (
          <DashboardView 
            metricas={metricas} 
            procesos={procesos}
            estados={estados}
            onRefresh={cargarDatosIniciales}
            onNavigate={setActiveView}
          />
        )}
        
        {activeView === 'procesos' && (
          <ProcesosView 
            procesos={procesos}
            estados={estados}
            filtros={filtros}
            onFiltroChange={handleFiltroChange}
            onAplicarFiltros={aplicarFiltros}
            onLimpiarFiltros={limpiarFiltros}
            onRefresh={cargarProcesos}
            loading={loading}
          />
        )}
        
        {activeView === 'nuevo' && (
          <NuevoProcesoView 
            estados={estados}
            onProcesoCreado={cargarDatosIniciales}
          />
        )}
        
        {activeView === 'operaciones' && (
          <OperacionesCompositeView 
            tiposOperaciones={tiposOperaciones}
            operacionesProgramadas={operacionesProgramadas}
            historialOperaciones={historialOperaciones}
            estadisticasOperaciones={estadisticasOperaciones}
            onRefresh={cargarDatosIniciales}
          />
        )}
        
        {activeView === 'informes' && (
          <InformesView 
            estados={estados}
            onRefresh={cargarDatosIniciales}
          />
        )}
      </div>
    </div>
  );
}

// Componente Dashboard
function DashboardView({ metricas, procesos, estados, onRefresh, onNavigate }) {
  if (!metricas) {
    return (
      <div className="dashboard-view">
        <div className="no-data">
          <span className="no-data-icon">📊</span>
          <h3>No hay datos disponibles</h3>
          <p>Los datos del dashboard se cargarán cuando haya procesos de producción</p>
        </div>
      </div>
    );
  }

  const { resumen = {}, procesosProximosAVencer = {} } = metricas?.data || {};
  
  // Asegurar que distribucionEstados existe
  const distribucionEstados = resumen.distribucionEstados || {};

  return (
    <div className="dashboard-view">
      {/* Métricas principales */}
      <div className="metricas-grid">
        <div className="metrica-card">
          <div className="metrica-icon">📦</div>
          <div className="metrica-content">
            <h3>{resumen?.totalProcesos || 0}</h3>
            <p>Total Procesos</p>
          </div>
        </div>
        
        <div className="metrica-card">
          <div className="metrica-icon">✅</div>
          <div className="metrica-content">
            <h3>{resumen?.procesosCompletados || 0}</h3>
            <p>Completados</p>
          </div>
        </div>
        
        <div className="metrica-card">
          <div className="metrica-icon">⏳</div>
          <div className="metrica-content">
            <h3>{resumen?.procesosEnProceso || 0}</h3>
            <p>En Proceso</p>
          </div>
        </div>
        
        <div className="metrica-card">
          <div className="metrica-icon">📈</div>
          <div className="metrica-content">
            <h3>{resumen?.tasaCompletacion || '0%'}</h3>
            <p>Tasa Completación</p>
          </div>
        </div>
      </div>

      {/* Distribución por estados */}
      <div className="dashboard-section">
        <h2>Distribución por Estados</h2>
        <div className="estados-grid">
          {Object.keys(distribucionEstados).length > 0 ? (
            Object.entries(distribucionEstados).map(([estado, cantidad]) => (
              <div key={estado} className="estado-card">
                <div 
                  className="estado-indicator"
                  style={{ backgroundColor: procesoProduccionService.obtenerColorEstado(estado) }}
                >
                  {procesoProduccionService.obtenerIconoEstado(estado)}
                </div>
                <div className="estado-content">
                  <h4>{procesoProduccionService.obtenerNombreEstado(estado)}</h4>
                  <p>{cantidad} procesos</p>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data">
              <p>No hay datos de distribución de estados disponibles</p>
            </div>
          )}
        </div>
      </div>

      {/* Procesos próximos a vencer */}
      {procesosProximosAVencer?.total > 0 && (
        <div className="dashboard-section">
          <h2>Procesos Próximos a Vencer</h2>
          <div className="proximos-vencer">
            {procesosProximosAVencer?.procesos?.slice(0, 5).map(proceso => (
              <div key={proceso.idProceso} className="proceso-card">
                <div className="proceso-header">
                  <span className="proceso-tipo">{proceso.tipoGrano}</span>
                  <span className="proceso-region">{proceso.region}</span>
                </div>
                <div className="proceso-content">
                  <p>{proceso.cantidadGramos}g</p>
                  <p className="dias-restantes">
                    {proceso.diasRestantes} días restantes
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Acciones rápidas */}
      <div className="dashboard-section">
        <h2>Acciones Rápidas</h2>
        <div className="acciones-grid">
          <button className="accion-button" onClick={() => onNavigate('nuevo')}>
            <span className="accion-icon">➕</span>
            <span>Nuevo Proceso</span>
          </button>
          <button className="accion-button" onClick={() => onNavigate('procesos')}>
            <span className="accion-icon">📋</span>
            <span>Ver Procesos</span>
          </button>
          <button className="accion-button" onClick={() => onNavigate('informes')}>
            <span className="accion-icon">📊</span>
            <span>Generar Informe</span>
          </button>
          <button className="accion-button" onClick={onRefresh}>
            <span className="accion-icon">🔄</span>
            <span>Actualizar</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente Procesos
function ProcesosView({ procesos, estados, filtros, onFiltroChange, onAplicarFiltros, onLimpiarFiltros, onRefresh, loading }) {
  return (
    <div className="procesos-view">
      {/* Filtros */}
      <div className="filtros-section">
        <h2>Filtrar Procesos</h2>
        <div className="filtros-grid">
          <div className="filtro-group">
            <label>Estado</label>
            <select 
              value={filtros.estado} 
              onChange={(e) => onFiltroChange('estado', e.target.value)}
            >
              <option value="">Todos los estados</option>
              {estados.estados && Object.entries(estados.estados).map(([key, value]) => (
                <option key={key} value={value}>
                  {procesoProduccionService.obtenerNombreEstado(value)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filtro-group">
            <label>Tipo de Grano</label>
            <select 
              value={filtros.tipoGrano} 
              onChange={(e) => onFiltroChange('tipoGrano', e.target.value)}
            >
              <option value="">Todos los tipos</option>
              <option value="Arabico">Arábico</option>
              <option value="Bourbon">Bourbon</option>
              <option value="Catuai">Catuai</option>
            </select>
          </div>
          
          <div className="filtro-group">
            <label>Región</label>
            <select 
              value={filtros.region} 
              onChange={(e) => onFiltroChange('region', e.target.value)}
            >
              <option value="">Todas las regiones</option>
              <option value="Antigua">Antigua</option>
              <option value="Acatenango">Acatenango</option>
              <option value="Amatitlán">Amatitlán</option>
            </select>
          </div>
          
          <div className="filtro-actions">
            <button onClick={onAplicarFiltros} className="btn-primary">
              Aplicar Filtros
            </button>
            <button onClick={onLimpiarFiltros} className="btn-secondary">
              Limpiar
            </button>
          </div>
        </div>
      </div>

      {/* Lista de procesos */}
      <div className="procesos-section">
        <div className="procesos-header">
          <h2>Procesos de Producción</h2>
          <button onClick={onRefresh} className="refresh-button" disabled={loading}>
            {loading ? '🔄' : '🔄'} Actualizar
          </button>
        </div>
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando procesos...</p>
          </div>
        ) : procesos.length === 0 ? (
          <div className="no-data">
            <span className="no-data-icon">📋</span>
            <h3>No hay procesos</h3>
            <p>No se encontraron procesos con los filtros aplicados</p>
          </div>
        ) : (
          <div className="procesos-grid">
            {procesos.map(proceso => (
              <ProcesoCard key={proceso.idProceso} proceso={proceso} estados={estados} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Componente Tarjeta de Proceso
function ProcesoCard({ proceso, estados }) {
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [avanzando, setAvanzando] = useState(false);

  const avanzarProceso = async () => {
    if (avanzando) return;
    
    setAvanzando(true);
    try {
      await procesoProduccionService.avanzarProceso(proceso.idProceso, 'Proceso avanzado desde el dashboard');
      // Recargar la página para mostrar los cambios
      window.location.reload();
    } catch (error) {
      alert('Error al avanzar el proceso: ' + error.message);
    } finally {
      setAvanzando(false);
    }
  };

  const puedeAvanzar = proceso.estadoActual !== 'venta';
  const diasTranscurridos = procesoProduccionService.calcularDiasTranscurridos(proceso.fechaInicio);

  return (
    <div className="proceso-card">
      <div className="proceso-card-header">
        <div className="proceso-info">
          <h3>{proceso.tipoGrano}</h3>
          <p>{proceso.region}</p>
        </div>
        <div 
          className="proceso-estado"
          style={{ backgroundColor: procesoProduccionService.obtenerColorEstado(proceso.estadoActual) }}
        >
          {procesoProduccionService.obtenerIconoEstado(proceso.estadoActual)}
        </div>
      </div>
      
      <div className="proceso-card-content">
        <div className="proceso-details">
          <div className="detail-item">
            <span className="detail-label">Cantidad:</span>
            <span className="detail-value">{proceso.cantidadGramos}g</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Estado:</span>
            <span className="detail-value">
              {procesoProduccionService.obtenerNombreEstado(proceso.estadoActual)}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Días en proceso:</span>
            <span className="detail-value">{diasTranscurridos}</span>
          </div>
        </div>
        
        <div className="proceso-actions">
          <button 
            onClick={() => setMostrarDetalles(!mostrarDetalles)}
            className="btn-secondary"
          >
            {mostrarDetalles ? 'Ocultar' : 'Ver'} Detalles
          </button>
          
          {puedeAvanzar && (
            <button 
              onClick={avanzarProceso}
              className="btn-primary"
              disabled={avanzando}
            >
              {avanzando ? 'Avanzando...' : 'Avanzar'}
            </button>
          )}
        </div>
        
        {mostrarDetalles && (
          <div className="proceso-detalles">
            <div className="detail-item">
              <span className="detail-label">Fecha inicio:</span>
              <span className="detail-value">
                {procesoProduccionService.formatearFecha(proceso.fechaInicio)}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Última actualización:</span>
              <span className="detail-value">
                {procesoProduccionService.formatearFecha(proceso.fechaActualizacion)}
              </span>
            </div>
            {proceso.observaciones && (
              <div className="detail-item">
                <span className="detail-label">Observaciones:</span>
                <span className="detail-value">{proceso.observaciones}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Componente Nuevo Proceso
function NuevoProcesoView({ estados, onProcesoCreado }) {
  const [formData, setFormData] = useState({
    tipoGrano: '',
    region: '',
    cantidadGramos: '',
    precio: '',
    fechaVencimiento: ''
  });
  const [creando, setCreando] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (campo, valor) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
  };

  const crearProceso = async (e) => {
    e.preventDefault();
    
    if (creando) return;
    
    // Validar datos
    const validacion = procesoProduccionService.validarDatosProceso(formData);
    if (!validacion.valido) {
      setError(validacion.errores.join(', '));
      return;
    }
    
    setCreando(true);
    setError(null);
    
    try {
      await procesoProduccionService.iniciarProcesoCompleto(formData);
      alert('Proceso creado exitosamente');
      setFormData({
        tipoGrano: '',
        region: '',
        cantidadGramos: '',
        precio: '',
        fechaVencimiento: ''
      });
      onProcesoCreado();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreando(false);
    }
  };

  return (
    <div className="nuevo-proceso-view">
      <div className="form-container">
        <h2>Crear Nuevo Proceso de Producción</h2>
        
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={crearProceso} className="proceso-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Tipo de Grano *</label>
              <select 
                value={formData.tipoGrano} 
                onChange={(e) => handleInputChange('tipoGrano', e.target.value)}
                required
              >
                <option value="">Seleccionar tipo</option>
                <option value="Arabico">Arábico</option>
                <option value="Bourbon">Bourbon</option>
                <option value="Catuai">Catuai</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Región *</label>
              <select 
                value={formData.region} 
                onChange={(e) => handleInputChange('region', e.target.value)}
                required
              >
                <option value="">Seleccionar región</option>
                <option value="Antigua">Antigua</option>
                <option value="Acatenango">Acatenango</option>
                <option value="Amatitlán">Amatitlán</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Cantidad (gramos) *</label>
              <input 
                type="number" 
                value={formData.cantidadGramos} 
                onChange={(e) => handleInputChange('cantidadGramos', e.target.value)}
                min="1"
                step="1"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Precio por gramo *</label>
              <input 
                type="number" 
                value={formData.precio} 
                onChange={(e) => handleInputChange('precio', e.target.value)}
                min="0.01"
                step="0.01"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Fecha de Vencimiento *</label>
              <input 
                type="date" 
                value={formData.fechaVencimiento} 
                onChange={(e) => handleInputChange('fechaVencimiento', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={creando}>
              {creando ? 'Creando...' : 'Crear Proceso'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => setFormData({
              tipoGrano: '',
              region: '',
              cantidadGramos: '',
              precio: '',
              fechaVencimiento: ''
            })}>
              Limpiar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente Informes
function InformesView({ estados, onRefresh }) {
  const [año, setAño] = useState(new Date().getFullYear());
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [informe, setInforme] = useState(null);
  const [cargando, setCargando] = useState(false);

  const generarInforme = async () => {
    setCargando(true);
    try {
      const informeData = await procesoProduccionService.generarInformeMensual(año, mes);
      setInforme(informeData.data.informe);
    } catch (error) {
      alert('Error al generar informe: ' + error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="informes-view">
      <div className="informes-header">
        <h2>Generar Informes</h2>
        <div className="informes-controls">
          <div className="control-group">
            <label>Año</label>
            <select value={año} onChange={(e) => setAño(parseInt(e.target.value))}>
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <div className="control-group">
            <label>Mes</label>
            <select value={mes} onChange={(e) => setMes(parseInt(e.target.value))}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>
                  {new Date(2024, month - 1).toLocaleDateString('es-ES', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          
          <button onClick={generarInforme} className="btn-primary" disabled={cargando}>
            {cargando ? 'Generando...' : 'Generar Informe'}
          </button>
        </div>
      </div>
      
      {informe && informe.resumen && (
        <div className="informe-resultado">
          <h3>Informe de {informe.resumen.nombreMes} {informe.resumen.año}</h3>
          
          <div className="informe-metricas">
            <div className="metrica-item">
              <span className="metrica-label">Total Procesos:</span>
              <span className="metrica-value">{informe.resumen.totalProcesos}</span>
            </div>
            <div className="metrica-item">
              <span className="metrica-label">Total Gramos:</span>
              <span className="metrica-value">{procesoProduccionService.formatearNumero(informe.resumen.totalGramos)}g</span>
            </div>
            <div className="metrica-item">
              <span className="metrica-label">Valor Estimado:</span>
              <span className="metrica-value">Q{procesoProduccionService.formatearNumero(informe.resumen.valorEstimado, 2)}</span>
            </div>
          </div>
          
          <div className="informe-estados">
            <h4>Distribución por Estados</h4>
            <div className="estados-grid">
              {informe.resumen.estados && Object.entries(informe.resumen.estados).map(([estado, datos]) => (
                <div key={estado} className="estado-item">
                  <div className="estado-header">
                    <span className="estado-icon">
                      {procesoProduccionService.obtenerIconoEstado(estado)}
                    </span>
                    <span className="estado-nombre">
                      {procesoProduccionService.obtenerNombreEstado(estado)}
                    </span>
                  </div>
                  <div className="estado-datos">
                    <p>Cantidad: {datos.cantidad}</p>
                    <p>Gramos: {procesoProduccionService.formatearNumero(datos.gramos)}g</p>
                    <p>Valor: Q{procesoProduccionService.formatearNumero(datos.valor, 2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente Operaciones Composite
function OperacionesCompositeView({ tiposOperaciones, operacionesProgramadas, historialOperaciones, estadisticasOperaciones, onRefresh }) {
  const [activeTab, setActiveTab] = useState('programadas');
  const [creandoOperacion, setCreandoOperacion] = useState(false);
  const [ejecutandoOperacion, setEjecutandoOperacion] = useState(null);
  const [error, setError] = useState(null);

  const tabs = [
    { id: 'programadas', label: 'Programadas', icon: '⏳' },
    { id: 'historial', label: 'Historial', icon: '📋' },
    { id: 'estadisticas', label: 'Estadísticas', icon: '📊' },
    { id: 'crear', label: 'Crear Operación', icon: '➕' }
  ];

  const ejecutarOperacion = async (idOperacion) => {
    if (ejecutandoOperacion === idOperacion) return;
    
    setEjecutandoOperacion(idOperacion);
    setError(null);
    
    try {
      // Contexto de ejemplo para la operación
      const contexto = {
        cantidadGramos: 1000,
        tipoGrano: 'Arabico',
        region: 'Antigua',
        tipoPreparacion: 'filtro',
        fechaVencimiento: '2024-12-31'
      };
      
      await operacionesCompositeService.ejecutarOperacionComposite(idOperacion, contexto);
      alert('Operación ejecutada exitosamente');
      onRefresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setEjecutandoOperacion(null);
    }
  };

  const cancelarOperacion = async (idOperacion) => {
    if (!window.confirm('¿Está seguro de que desea cancelar esta operación?')) return;
    
    try {
      await operacionesCompositeService.cancelarOperacionComposite(idOperacion);
      alert('Operación cancelada exitosamente');
      onRefresh();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="operaciones-composite-view">
      {/* Header */}
      <div className="operaciones-header">
        <h2>🏭 Operaciones Composite</h2>
        <p>Gestión de operaciones de producción usando el patrón Composite</p>
        
        <div className="operaciones-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
          <button onClick={() => setError(null)} className="close-button">
            ✕
          </button>
        </div>
      )}

      {/* Content */}
      <div className="operaciones-content">
        {activeTab === 'programadas' && (
          <OperacionesProgramadasTab 
            operaciones={operacionesProgramadas}
            onEjecutar={ejecutarOperacion}
            onCancelar={cancelarOperacion}
            ejecutando={ejecutandoOperacion}
          />
        )}
        
        {activeTab === 'historial' && (
          <HistorialOperacionesTab 
            historial={historialOperaciones}
          />
        )}
        
        {activeTab === 'estadisticas' && (
          <EstadisticasOperacionesTab 
            estadisticas={estadisticasOperaciones}
          />
        )}
        
        {activeTab === 'crear' && (
          <CrearOperacionTab 
            tiposOperaciones={tiposOperaciones}
            onOperacionCreada={onRefresh}
          />
        )}
      </div>
    </div>
  );
}

// Componente Tab de Operaciones Programadas
function OperacionesProgramadasTab({ operaciones, onEjecutar, onCancelar, ejecutando }) {
  if (operaciones.length === 0) {
    return (
      <div className="no-data">
        <span className="no-data-icon">⏳</span>
        <h3>No hay operaciones programadas</h3>
        <p>Las operaciones programadas aparecerán aquí</p>
      </div>
    );
  }

  return (
    <div className="operaciones-programadas">
      <div className="operaciones-grid">
        {operaciones.map(operacion => (
          <div key={operacion.id} className="operacion-card">
            <div className="operacion-header">
              <div className="operacion-info">
                <h3>{operacion.nombre}</h3>
                <p>{operacion.tipoOperacion}</p>
              </div>
              <div 
                className="operacion-estado"
                style={{ backgroundColor: operacionesCompositeService.obtenerColorEstadoOperacion(operacion.estado) }}
              >
                {operacionesCompositeService.obtenerIconoEstadoOperacion(operacion.estado)}
              </div>
            </div>
            
            <div className="operacion-content">
              <div className="operacion-details">
                <div className="detail-item">
                  <span className="detail-label">Tiempo estimado:</span>
                  <span className="detail-value">
                    {operacionesCompositeService.formatearTiempo(operacion.tiempoEstimado)}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Costo estimado:</span>
                  <span className="detail-value">
                    {operacionesCompositeService.formatearCosto(operacion.costoEstimado)}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Fecha programación:</span>
                  <span className="detail-value">
                    {operacionesCompositeService.formatearFecha(operacion.fechaProgramacion)}
                  </span>
                </div>
              </div>
              
              <div className="operacion-actions">
                <button 
                  onClick={() => onEjecutar(operacion.id)}
                  className="btn-primary"
                  disabled={ejecutando === operacion.id || operacion.estado !== 'pendiente'}
                >
                  {ejecutando === operacion.id ? 'Ejecutando...' : 'Ejecutar'}
                </button>
                
                <button 
                  onClick={() => onCancelar(operacion.id)}
                  className="btn-secondary"
                  disabled={operacion.estado === 'en_progreso'}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente Tab de Historial
function HistorialOperacionesTab({ historial }) {
  if (historial.length === 0) {
    return (
      <div className="no-data">
        <span className="no-data-icon">📋</span>
        <h3>No hay historial de operaciones</h3>
        <p>El historial de operaciones aparecerá aquí</p>
      </div>
    );
  }

  return (
    <div className="historial-operaciones">
      <div className="historial-grid">
        {historial.map(registro => (
          <div key={registro.id} className="historial-card">
            <div className="historial-header">
              <div className="historial-info">
                <h3>{registro.nombre}</h3>
                <p>{registro.tipoOperacion}</p>
              </div>
              <div 
                className="historial-estado"
                style={{ backgroundColor: operacionesCompositeService.obtenerColorEstadoOperacion(registro.estado) }}
              >
                {operacionesCompositeService.obtenerIconoEstadoOperacion(registro.estado)}
              </div>
            </div>
            
            <div className="historial-content">
              <div className="historial-details">
                <div className="detail-item">
                  <span className="detail-label">Fecha:</span>
                  <span className="detail-value">
                    {operacionesCompositeService.formatearFecha(registro.fecha)}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Tiempo transcurrido:</span>
                  <span className="detail-value">
                    {operacionesCompositeService.formatearTiempo(registro.tiempoTranscurrido)}
                  </span>
                </div>
                {registro.costoReal && (
                  <div className="detail-item">
                    <span className="detail-label">Costo real:</span>
                    <span className="detail-value">
                      {operacionesCompositeService.formatearCosto(registro.costoReal)}
                    </span>
                  </div>
                )}
              </div>
              
              {registro.error && (
                <div className="historial-error">
                  <span className="error-label">Error:</span>
                  <span className="error-message">{registro.error}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente Tab de Estadísticas
function EstadisticasOperacionesTab({ estadisticas }) {
  if (!estadisticas) {
    return (
      <div className="no-data">
        <span className="no-data-icon">📊</span>
        <h3>No hay estadísticas disponibles</h3>
        <p>Las estadísticas aparecerán aquí</p>
      </div>
    );
  }

  return (
    <div className="estadisticas-operaciones">
      {/* Métricas principales */}
      <div className="metricas-grid">
        <div className="metrica-card">
          <div className="metrica-icon">📦</div>
          <div className="metrica-content">
            <h3>{estadisticas.totalOperaciones}</h3>
            <p>Total Operaciones</p>
          </div>
        </div>
        
        <div className="metrica-card">
          <div className="metrica-icon">✅</div>
          <div className="metrica-content">
            <h3>{estadisticas.operacionesExitosas}</h3>
            <p>Exitosas</p>
          </div>
        </div>
        
        <div className="metrica-card">
          <div className="metrica-icon">❌</div>
          <div className="metrica-content">
            <h3>{estadisticas.operacionesFallidas}</h3>
            <p>Fallidas</p>
          </div>
        </div>
        
        <div className="metrica-card">
          <div className="metrica-icon">📈</div>
          <div className="metrica-content">
            <h3>{estadisticas.tasaExito}%</h3>
            <p>Tasa de Éxito</p>
          </div>
        </div>
      </div>

      {/* Estadísticas por tipo */}
      <div className="dashboard-section">
        <h2>Estadísticas por Tipo de Operación</h2>
        <div className="estadisticas-tipo-grid">
          {estadisticas.estadisticasPorTipo && Object.entries(estadisticas.estadisticasPorTipo).map(([tipo, datos]) => (
            <div key={tipo} className="estadistica-tipo-card">
              <div className="estadistica-tipo-header">
                <span className="tipo-icon">
                  {operacionesCompositeService.obtenerIconoTipoOperacion(tipo)}
                </span>
                <span className="tipo-nombre">
                  {operacionesCompositeService.obtenerNombreTipoOperacion(tipo)}
                </span>
              </div>
              <div className="estadistica-tipo-content">
                <div className="tipo-metrica">
                  <span className="metrica-label">Total:</span>
                  <span className="metrica-value">{datos.total}</span>
                </div>
                <div className="tipo-metrica">
                  <span className="metrica-label">Exitosas:</span>
                  <span className="metrica-value">{datos.exitosas}</span>
                </div>
                <div className="tipo-metrica">
                  <span className="metrica-label">Fallidas:</span>
                  <span className="metrica-value">{datos.fallidas}</span>
                </div>
                <div className="tipo-metrica">
                  <span className="metrica-label">Canceladas:</span>
                  <span className="metrica-value">{datos.canceladas}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Componente Tab de Crear Operación
function CrearOperacionTab({ tiposOperaciones, onOperacionCreada }) {
  const [formData, setFormData] = useState({
    tipoOperacion: '',
    tipoProceso: 'premium',
    cantidadGramos: '',
    tipoGrano: '',
    region: '',
    tipoPreparacion: 'filtro',
    fechaVencimiento: ''
  });
  const [creando, setCreando] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (campo, valor) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
  };

  const crearOperacion = async (e) => {
    e.preventDefault();
    
    if (creando) return;
    
    // Validar datos
    const validacion = operacionesCompositeService.validarContextoOperacion(formData, formData.tipoOperacion);
    if (!validacion.valido) {
      setError(validacion.errores.join(', '));
      return;
    }
    
    setCreando(true);
    setError(null);
    
    try {
      // Crear operación
      const configuracion = formData.tipoOperacion === 'proceso_especial' ? 
        { tipoProceso: formData.tipoProceso } : {};
      
      const operacionData = await operacionesCompositeService.crearOperacionComposite(
        formData.tipoOperacion, 
        configuracion
      );
      
      // Programar operación
      const contexto = {
        cantidadGramos: parseInt(formData.cantidadGramos),
        tipoGrano: formData.tipoGrano,
        region: formData.region,
        tipoPreparacion: formData.tipoPreparacion,
        fechaVencimiento: formData.fechaVencimiento
      };
      
      await operacionesCompositeService.programarOperacionComposite(operacionData.data.operacion, contexto);
      
      alert('Operación creada y programada exitosamente');
      setFormData({
        tipoOperacion: '',
        tipoProceso: 'premium',
        cantidadGramos: '',
        tipoGrano: '',
        region: '',
        tipoPreparacion: 'filtro',
        fechaVencimiento: ''
      });
      onOperacionCreada();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreando(false);
    }
  };

  return (
    <div className="crear-operacion">
      <div className="form-container">
        <h2>Crear Nueva Operación Composite</h2>
        
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={crearOperacion} className="operacion-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Tipo de Operación *</label>
              <select 
                value={formData.tipoOperacion} 
                onChange={(e) => handleInputChange('tipoOperacion', e.target.value)}
                required
              >
                <option value="">Seleccionar tipo</option>
                {tiposOperaciones.map(tipo => (
                  <option key={tipo} value={tipo}>
                    {operacionesCompositeService.obtenerNombreTipoOperacion(tipo)}
                  </option>
                ))}
              </select>
            </div>
            
            {formData.tipoOperacion === 'proceso_especial' && (
              <div className="form-group">
                <label>Tipo de Proceso Especial</label>
                <select 
                  value={formData.tipoProceso} 
                  onChange={(e) => handleInputChange('tipoProceso', e.target.value)}
                >
                  <option value="premium">Premium</option>
                  <option value="express">Express</option>
                  <option value="artesanal">Artesanal</option>
                  <option value="experimental">Experimental</option>
                </select>
              </div>
            )}
            
            <div className="form-group">
              <label>Cantidad (gramos) *</label>
              <input 
                type="number" 
                value={formData.cantidadGramos} 
                onChange={(e) => handleInputChange('cantidadGramos', e.target.value)}
                min="1"
                step="1"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Tipo de Grano *</label>
              <select 
                value={formData.tipoGrano} 
                onChange={(e) => handleInputChange('tipoGrano', e.target.value)}
                required
              >
                <option value="">Seleccionar tipo</option>
                <option value="Arabico">Arábico</option>
                <option value="Bourbon">Bourbon</option>
                <option value="Catuai">Catuai</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Región *</label>
              <select 
                value={formData.region} 
                onChange={(e) => handleInputChange('region', e.target.value)}
                required
              >
                <option value="">Seleccionar región</option>
                <option value="Antigua">Antigua</option>
                <option value="Acatenango">Acatenango</option>
                <option value="Amatitlán">Amatitlán</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Tipo de Preparación</label>
              <select 
                value={formData.tipoPreparacion} 
                onChange={(e) => handleInputChange('tipoPreparacion', e.target.value)}
              >
                <option value="filtro">Filtro</option>
                <option value="espresso">Espresso</option>
                <option value="francesa">Francesa</option>
                <option value="chemex">Chemex</option>
                <option value="v60">V60</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Fecha de Vencimiento *</label>
              <input 
                type="date" 
                value={formData.fechaVencimiento} 
                onChange={(e) => handleInputChange('fechaVencimiento', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={creando}>
              {creando ? 'Creando...' : 'Crear Operación'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => setFormData({
              tipoOperacion: '',
              tipoProceso: 'premium',
              cantidadGramos: '',
              tipoGrano: '',
              region: '',
              tipoPreparacion: 'filtro',
              fechaVencimiento: ''
            })}>
              Limpiar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProcesoProduccion;
