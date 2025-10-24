import React, { useState, useEffect } from 'react';
import './PatronesComportamiento.css';

const PatronesComportamiento = () => {
  const [activeTab, setActiveTab] = useState('observer');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Estado para Observer
  const [notificaciones, setNotificaciones] = useState([]);
  const [logs, setLogs] = useState([]);
  const [consumoGranos, setConsumoGranos] = useState({ idGranos: '', cantidad: '' });

  // Estado para Strategy
  const [pedido, setPedido] = useState({
    distanciaKm: 10,
    peso: 1,
    presupuestoMax: null,
    tiempoMaxHoras: null,
    prioridad: 'normal',
    esUrgente: false
  });
  const [estrategias, setEstrategias] = useState([]);
  const [estrategiaSeleccionada, setEstrategiaSeleccionada] = useState(null);
  const [comparacionEstrategias, setComparacionEstrategias] = useState([]);

  // Estado para Command
  const [tipoComando, setTipoComando] = useState('agregar');
  const [datosComando, setDatosComando] = useState({
    TipoGrano: '',
    Cantidad_Gramos: '',
    Cantidad_Gramos_Restock: '',
    Precio: '',
    Fecha_Vencimiento: ''
  });
  const [historialComandos, setHistorialComandos] = useState({ ejecutados: [], deshechos: [] });
  const [estadisticasComandos, setEstadisticasComandos] = useState({});

  const API_URL = 'http://localhost:5000/api/patterns';

  // ===== FUNCIONES OBSERVER =====

  const verificarStocks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/observer/verificar-stocks`, {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: `✅ ${data.message}` });
        await obtenerNotificaciones();
      }
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const obtenerNotificaciones = async () => {
    try {
      const response = await fetch(`${API_URL}/observer/notificaciones`);
      const data = await response.json();
      
      if (data.success) {
        setNotificaciones(data.data.notificaciones || []);
      }
    } catch (error) {
      console.error('Error obteniendo notificaciones:', error);
    }
  };

  const obtenerLogs = async () => {
    try {
      const response = await fetch(`${API_URL}/observer/logs`);
      const data = await response.json();
      
      if (data.success) {
        setLogs(data.data.logs || []);
      }
    } catch (error) {
      console.error('Error obteniendo logs:', error);
    }
  };

  const consumirGranos = async () => {
    if (!consumoGranos.idGranos || !consumoGranos.cantidad) {
      setMessage({ type: 'error', text: '❌ Completa todos los campos' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/observer/consumir-granos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idGranos: parseInt(consumoGranos.idGranos),
          cantidad: parseFloat(consumoGranos.cantidad)
        })
      });
      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: '✅ Granos consumidos exitosamente' });
        setConsumoGranos({ idGranos: '', cantidad: '' });
        await obtenerNotificaciones();
      }
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  // ===== FUNCIONES STRATEGY =====

  const obtenerEstrategiasDisponibles = async () => {
    try {
      const response = await fetch(`${API_URL}/strategy/disponibles`);
      const data = await response.json();
      
      if (data.success) {
        setEstrategias(data.data || []);
      }
    } catch (error) {
      console.error('Error obteniendo estrategias:', error);
    }
  };

  const seleccionarEstrategiaAutomatica = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/strategy/seleccionar-automatica`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pedido })
      });
      const data = await response.json();
      
      if (data.success) {
        setEstrategiaSeleccionada(data.data);
        setMessage({ type: 'success', text: '✅ Estrategia seleccionada automáticamente' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const compararEstrategias = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/strategy/comparar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pedido })
      });
      const data = await response.json();
      
      if (data.success) {
        setComparacionEstrategias(data.data.comparacion || []);
        setMessage({ type: 'success', text: '✅ Comparación realizada' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  // ===== FUNCIONES COMMAND =====

  const ejecutarComando = async () => {
    setLoading(true);
    try {
      let datos = {};
      
      if (tipoComando === 'agregar') {
        // Agregar fecha de ingreso automáticamente
        const datosCompletos = {
          ...datosComando,
          Fecha_Ingreso: new Date().toISOString().split('T')[0],
          Cantidad_Gramos: parseFloat(datosComando.Cantidad_Gramos),
          Cantidad_Gramos_Restock: parseFloat(datosComando.Cantidad_Gramos_Restock || datosComando.Cantidad_Gramos / 2),
          Precio: parseFloat(datosComando.Precio)
        };
        datos = { datosProducto: datosCompletos };
      } else if (tipoComando === 'actualizar') {
        const { idProducto, ...nuevosDatos } = datosComando;
        datos = { idProducto: parseInt(idProducto), nuevosDatos };
      } else if (tipoComando === 'retirar') {
        datos = { idProducto: parseInt(datosComando.idProducto) };
      }

      const response = await fetch(`${API_URL}/command/ejecutar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipoComando, datos })
      });
      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: '✅ Comando ejecutado exitosamente' });
        await obtenerHistorialComandos();
      }
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const deshacerComando = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/command/deshacer`, {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: '↩️ Comando deshecho' });
        await obtenerHistorialComandos();
      }
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const rehacerComando = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/command/rehacer`, {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: '🔄 Comando rehecho' });
        await obtenerHistorialComandos();
      }
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const obtenerHistorialComandos = async () => {
    try {
      const response = await fetch(`${API_URL}/command/historial`);
      const data = await response.json();
      
      if (data.success) {
        setHistorialComandos(data.data);
        setEstadisticasComandos(data.data.estadisticas || {});
      }
    } catch (error) {
      console.error('Error obteniendo historial:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'observer') {
      obtenerNotificaciones();
      obtenerLogs();
    } else if (activeTab === 'strategy') {
      obtenerEstrategiasDisponibles();
    } else if (activeTab === 'command') {
      obtenerHistorialComandos();
    }
  }, [activeTab]);

  return (
    <div className="patrones-container">
      <h1>📋 Administrador de Tareas</h1>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="tabs">
        <button 
          className={activeTab === 'observer' ? 'active' : ''} 
          onClick={() => setActiveTab('observer')}
        >
          📬 Notificaciones de Stock
        </button>
        <button 
          className={activeTab === 'strategy' ? 'active' : ''} 
          onClick={() => setActiveTab('strategy')}
        >
          🚚 Estrategias de Distribución
        </button>
        <button 
          className={activeTab === 'command' ? 'active' : ''} 
          onClick={() => setActiveTab('command')}
        >
          📦 Operaciones de Inventario
        </button>
      </div>

      {/* PATRÓN OBSERVER */}
      {activeTab === 'observer' && (
        <div className="tab-content">
          <h2>Notificaciones de Stock</h2>
          
          <div className="section">
            <h3>Verificar Stocks</h3>
            <button onClick={verificarStocks} disabled={loading}>
              {loading ? 'Verificando...' : '🔍 Verificar Todos los Stocks'}
            </button>
          </div>

          <div className="section">
            <h3>Simular Consumo de Granos</h3>
            <div className="form-group">
              <input
                type="number"
                placeholder="ID del Grano"
                value={consumoGranos.idGranos}
                onChange={(e) => setConsumoGranos({...consumoGranos, idGranos: e.target.value})}
              />
              <input
                type="number"
                placeholder="Cantidad (gramos)"
                value={consumoGranos.cantidad}
                onChange={(e) => setConsumoGranos({...consumoGranos, cantidad: e.target.value})}
              />
              <button onClick={consumirGranos} disabled={loading}>
                Consumir Granos
              </button>
            </div>
          </div>

          <div className="section">
            <h3>📬 Notificaciones ({notificaciones.length})</h3>
            <div className="list">
              {notificaciones.slice(-10).reverse().map((notif, idx) => (
                <div key={idx} className={`notification priority-${notif.prioridad?.toLowerCase()}`}>
                  <strong>{notif.grano?.TipoGrano}</strong>
                  <p>Stock: {notif.cantidadActual}g / {notif.umbralRestock}g</p>
                  <span className="priority">{notif.prioridad}</span>
                  <span className="date">{new Date(notif.fecha).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PATRÓN STRATEGY */}
      {activeTab === 'strategy' && (
        <div className="tab-content">
          <h2>Estrategias de Distribución</h2>
          
          <div className="section">
            <h3>Configurar Pedido</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Distancia (km)</label>
                <input
                  type="number"
                  value={pedido.distanciaKm}
                  onChange={(e) => setPedido({...pedido, distanciaKm: parseFloat(e.target.value)})}
                />
              </div>
              <div className="form-group">
                <label>Peso (kg)</label>
                <input
                  type="number"
                  value={pedido.peso}
                  onChange={(e) => setPedido({...pedido, peso: parseFloat(e.target.value)})}
                />
              </div>
              <div className="form-group">
                <label>Prioridad</label>
                <select
                  value={pedido.prioridad}
                  onChange={(e) => setPedido({...pedido, prioridad: e.target.value})}
                >
                  <option value="baja">Baja</option>
                  <option value="normal">Normal</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={pedido.esUrgente}
                    onChange={(e) => setPedido({...pedido, esUrgente: e.target.checked})}
                  />
                  Urgente
                </label>
              </div>
            </div>
            
            <div className="button-group">
              <button onClick={seleccionarEstrategiaAutomatica} disabled={loading}>
                🤖 Selección Automática
              </button>
              <button onClick={compararEstrategias} disabled={loading}>
                📊 Comparar Estrategias
              </button>
            </div>
          </div>

          {estrategiaSeleccionada && (
            <div className="section result">
              <h3>✅ Estrategia Seleccionada: {estrategiaSeleccionada.estrategiaSeleccionada}</h3>
              <div className="strategy-details">
                <p><strong>Costo:</strong> ${estrategiaSeleccionada.costo}</p>
                <p><strong>Tiempo:</strong> {estrategiaSeleccionada.tiempo}h</p>
                <p><strong>Descripción:</strong> {estrategiaSeleccionada.detalles?.descripcion}</p>
              </div>
            </div>
          )}

          {comparacionEstrategias.length > 0 && (
            <div className="section">
              <h3>📊 Comparación de Estrategias</h3>
              <div className="comparison-grid">
                {comparacionEstrategias.map((est, idx) => (
                  <div key={idx} className="strategy-card">
                    <h4>{est.nombre}</h4>
                    <p>{est.descripcion}</p>
                    <div className="stats">
                      <span>💰 ${est.costo}</span>
                      <span>⏱️ {est.tiempoEntrega}h</span>
                    </div>
                    {est.aplicable ? (
                      <span className="badge success">✅ Aplicable</span>
                    ) : (
                      <span className="badge error">❌ No aplicable</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* PATRÓN COMMAND */}
      {activeTab === 'command' && (
        <div className="tab-content">
          <h2>Operaciones de Inventario</h2>
          
          <div className="section">
            <h3>Ejecutar Comando</h3>
            <div className="form-group">
              <label>Tipo de Comando</label>
              <select
                value={tipoComando}
                onChange={(e) => setTipoComando(e.target.value)}
              >
                <option value="agregar">Agregar Producto</option>
                <option value="actualizar">Actualizar Producto</option>
                <option value="retirar">Retirar Producto</option>
              </select>
            </div>

            {tipoComando === 'agregar' && (
              <div className="form-grid">
                <input
                  placeholder="Tipo de Grano *"
                  value={datosComando.TipoGrano}
                  onChange={(e) => setDatosComando({...datosComando, TipoGrano: e.target.value})}
                />
                <input
                  type="number"
                  placeholder="Cantidad (gramos) *"
                  value={datosComando.Cantidad_Gramos}
                  onChange={(e) => setDatosComando({...datosComando, Cantidad_Gramos: e.target.value})}
                />
                <input
                  type="number"
                  placeholder="Stock mínimo (gramos)"
                  value={datosComando.Cantidad_Gramos_Restock}
                  onChange={(e) => setDatosComando({...datosComando, Cantidad_Gramos_Restock: e.target.value})}
                />
                <input
                  type="number"
                  placeholder="Precio *"
                  value={datosComando.Precio}
                  onChange={(e) => setDatosComando({...datosComando, Precio: e.target.value})}
                />
                <input
                  type="date"
                  placeholder="Fecha Vencimiento *"
                  value={datosComando.Fecha_Vencimiento}
                  onChange={(e) => setDatosComando({...datosComando, Fecha_Vencimiento: e.target.value})}
                />
              </div>
            )}

            {tipoComando === 'retirar' && (
              <input
                type="number"
                placeholder="ID del Producto"
                value={datosComando.idProducto}
                onChange={(e) => setDatosComando({...datosComando, idProducto: e.target.value})}
              />
            )}

            <button onClick={ejecutarComando} disabled={loading}>
              ⚡ Ejecutar Comando
            </button>
          </div>

          <div className="section">
            <h3>Control de Comandos</h3>
            <div className="button-group">
              <button onClick={deshacerComando} disabled={loading || !estadisticasComandos.hayComandosParaDeshacer}>
                ↩️ Deshacer
              </button>
              <button onClick={rehacerComando} disabled={loading || !estadisticasComandos.hayComandosParaRehacer}>
                🔄 Rehacer
              </button>
            </div>
          </div>

          <div className="section">
            <h3>📜 Historial de Comandos</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-value">{estadisticasComandos.totalEjecutados || 0}</span>
                <span className="stat-label">Ejecutados</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{estadisticasComandos.totalDeshechos || 0}</span>
                <span className="stat-label">Deshechos</span>
              </div>
            </div>
            
            <div className="history-list">
              {historialComandos.ejecutados?.slice(-5).reverse().map((cmd, idx) => (
                <div key={idx} className="history-item">
                  <strong>{cmd.comando}</strong>
                  <p>{cmd.descripcion}</p>
                  <span className="timestamp">{new Date(cmd.timestamp).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatronesComportamiento;

