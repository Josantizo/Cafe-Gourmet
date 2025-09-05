//Aqui va la parte visual de su CRUD, le pueden pedir a cursor que les ayude a crearla.

import React, { useState, useEffect } from 'react';
import { updateGrano, obtenerGranos } from '../services/inventoryService';

export default function InventarioCRUD() {
  const [id, setId] = useState('');
  const [granos, setGranos] = useState([]);
  const [form, setForm] = useState({
    TipoGrano: '',
    Fecha_Ingreso: '',
    Fecha_Vencimiento: '',
    Cantidad_Gramos: '',
    Cantidad_Gramos_Restock: '',
    Precio: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarGranos();
  }, []);

  const cargarGranos = async () => {
    setLoadingData(true);
    setError(null);
    try {
      const datos = await obtenerGranos();
      setGranos(datos);
    } catch (err) {
      setError('Error al cargar los datos: ' + err.message);
    } finally {
      setLoadingData(false);
    }
  };

  const seleccionarGrano = (grano) => {
    setId(grano.id.toString());
    setForm({
      TipoGrano: grano.TipoGrano || '',
      Fecha_Ingreso: grano.Fecha_Ingreso ? grano.Fecha_Ingreso.split('T')[0] : '',
      Fecha_Vencimiento: grano.Fecha_Vencimiento ? grano.Fecha_Vencimiento.split('T')[0] : '',
      Cantidad_Gramos: grano.Cantidad_Gramos || '',
      Cantidad_Gramos_Restock: grano.Cantidad_Gramos_Restock || '',
      Precio: grano.Precio || ''
    });
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const payload = {};
      Object.entries(form).forEach(([key, value]) => {
        if (value !== '' && value !== null) {
          payload[key] = key.includes('Cantidad') || key === 'Precio' ? Number(value) : value;
        }
      });
      const res = await updateGrano(Number(id), payload);
      setMessage(`Actualizado correctamente. Filas afectadas: ${res.filasAfectadas}`);
      // Recargar los datos después de actualizar
      await cargarGranos();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '1rem' }}>
      <div className="card-hover" style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 10px 25px rgba(0,0,0,0.05)', margin: '0 auto', maxWidth: 900 }}>
        <header style={{ marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 28, color: '#111827' }}>Gestión de Inventario</h1>
          <p style={{ margin: '8px 0 0', color: '#6b7280' }}>CRUD de granos — ahora: Update</p>
        </header>

        {message && (
          <div className="alert alert-success">{message}</div>
        )}
        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        {/* Tabla de datos */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ margin: 0, fontSize: 20, color: '#111827' }}>Inventario de Granos</h2>
            <button 
              onClick={cargarGranos} 
              disabled={loadingData}
              style={{ 
                background: '#10b981', 
                color: 'white', 
                border: 'none', 
                padding: '0.5rem 1rem', 
                borderRadius: '6px',
                cursor: loadingData ? 'not-allowed' : 'pointer',
                opacity: loadingData ? 0.6 : 1
              }}
            >
              {loadingData ? 'Cargando...' : 'Actualizar Lista'}
            </button>
          </div>
          
          {loadingData ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>Cargando datos...</div>
          ) : granos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>No hay granos registrados</div>
          ) : (
            <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9fafb' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontSize: '14px', fontWeight: '600', color: '#374151' }}>ID</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Tipo</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Ingreso</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Vencimiento</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Cantidad (g)</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Restock (g)</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Precio (Q/kg)</th>
                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {granos.map((grano) => (
                    <tr key={grano.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>{grano.id}</td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>{grano.TipoGrano || '-'}</td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>{grano.Fecha_Ingreso ? new Date(grano.Fecha_Ingreso).toLocaleDateString() : '-'}</td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>{grano.Fecha_Vencimiento ? new Date(grano.Fecha_Vencimiento).toLocaleDateString() : '-'}</td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>{grano.Cantidad_Gramos ? grano.Cantidad_Gramos.toFixed(2) : '-'}</td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>{grano.Cantidad_Gramos_Restock ? grano.Cantidad_Gramos_Restock.toFixed(2) : '-'}</td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>{grano.Precio ? `Q ${grano.Precio.toFixed(2)}` : '-'}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <button
                          onClick={() => seleccionarGrano(grano)}
                          style={{
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Seleccionar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={{ marginTop: 24 }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: 20, color: '#111827' }}>Actualizar Grano</h2>
          <p style={{ margin: '0 0 16px 0', color: '#6b7280', fontSize: '14px' }}>
            Selecciona un grano de la tabla arriba o ingresa manualmente el ID
          </p>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">ID del grano</label>
            <input className="form-input" type="number" value={id} onChange={(e) => setId(e.target.value)} placeholder="Ingresa el ID" required />
          </div>

          <div className="table-container" style={{ background: '#fff', padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
              <div style={{ gridColumn: 'span 12' }} className="form-group">
                <label className="form-label">Tipo de grano</label>
                <input className="form-input" name="TipoGrano" value={form.TipoGrano} onChange={onChange} placeholder="Arábica / Robusta" />
              </div>

              <div style={{ gridColumn: 'span 12' }} className="form-group">
                <label className="form-label">Fecha de ingreso</label>
                <input className="form-input" name="Fecha_Ingreso" type="date" value={form.Fecha_Ingreso} onChange={onChange} />
              </div>

              <div style={{ gridColumn: 'span 12' }} className="form-group">
                <label className="form-label">Fecha de vencimiento</label>
                <input className="form-input" name="Fecha_Vencimiento" type="date" value={form.Fecha_Vencimiento} onChange={onChange} />
              </div>

              <div style={{ gridColumn: 'span 12' }} className="form-group">
                <label className="form-label">Cantidad (gramos)</label>
                <input className="form-input" name="Cantidad_Gramos" type="number" step="0.01" value={form.Cantidad_Gramos} onChange={onChange} placeholder="Ej. 1200" />
              </div>

              <div style={{ gridColumn: 'span 12' }} className="form-group">
                <label className="form-label">Cantidad Restock (gramos)</label>
                <input className="form-input" name="Cantidad_Gramos_Restock" type="number" step="0.01" value={form.Cantidad_Gramos_Restock} onChange={onChange} placeholder="Ej. 500" />
              </div>

              <div style={{ gridColumn: 'span 12' }} className="form-group">
                <label className="form-label">Precio (Q por kg)</label>
                <input className="form-input" name="Precio" type="number" step="0.01" value={form.Precio} onChange={onChange} placeholder="Ej. 25.50" />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 16 }}>
            <button type="button" className="btn" onClick={() => { setId(''); setForm({ TipoGrano: '', Fecha_Ingreso: '', Fecha_Vencimiento: '', Cantidad_Gramos: '', Cantidad_Gramos_Restock: '', Precio: '' }); setMessage(null); setError(null); }} style={{ background: '#f3f4f6', color: '#374151', padding: '0.75rem 1rem' }}>Limpiar</button>
            <button type="submit" className="btn" disabled={loading} style={{ background: '#f59e0b', color: '#111827', padding: '0.75rem 1rem' }}>
              {loading ? (<span className="loader" />) : 'Actualizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}