import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import InventarioCRUD from './components/InventarioCRUD';
import './App.css';

function App() {
  return (
    <div className="App">
      <nav style={{ padding: 16, borderBottom: '1px solid #ddd' }}>
        <Link to="/">Inicio</Link> | <Link to="/inventario">Inventario</Link>
      </nav>
      <main style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<div>Bienvenido a Café Gourmet</div>} />
          <Route path="/inventario" element={<InventarioCRUD />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
