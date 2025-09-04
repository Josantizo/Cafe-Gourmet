//Aqui va la parte visual de su CRUD, le pueden pedir a cursor que les ayude a crearla.

import React, { useState } from 'react';
import { updateGrano } from '../services/inventoryService';

export default function InventarioCRUD() {
  const [id, setId] = useState('');
  const [form, setForm] = useState({
    TipoGrano: '',
    Fecha_Ingreso: '',
    Fecha_Vencimiento: '',
    Cantidad_Gramos: '',
    Cantidad_Gramos_Restock: '',
    Precio: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

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
            <button type="button" className="btn" onClick={() => { setForm({ TipoGrano: '', Fecha_Ingreso: '', Fecha_Vencimiento: '', Cantidad_Gramos: '', Cantidad_Gramos_Restock: '', Precio: '' }); setMessage(null); setError(null); }} style={{ background: '#f3f4f6', color: '#374151', padding: '0.75rem 1rem' }}>Limpiar</button>
            <button type="submit" className="btn" disabled={loading} style={{ background: '#f59e0b', color: '#111827', padding: '0.75rem 1rem' }}>
              {loading ? (<span className="loader" />) : 'Actualizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}