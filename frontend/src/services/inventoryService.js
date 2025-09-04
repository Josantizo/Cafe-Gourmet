const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

export async function updateGrano(id, data) {
  const response = await fetch(`${API_BASE}/coffee/granos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.error || 'Error actualizando grano');
  }
  return json;
}


