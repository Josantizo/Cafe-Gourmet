import React, { useState } from 'react';
import InventarioCRUD from './InventarioCRUD';
import ComboCreator from './ComboCreator';
import Facturacion from './Facturacion';
import ComboRecommendations from './ComboRecommendations';
import './Dashboard.css';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('inventario');

  const tabs = [
    { id: 'inventario', label: 'Inventario', icon: '📦' },
    { id: 'combos', label: 'Crear Combos', icon: '☕' },
    { id: 'recomendaciones', label: 'Recomendaciones', icon: '🎯' },
    { id: 'facturacion', label: 'Facturación', icon: '💳' },
    { id: 'reportes', label: 'Reportes', icon: '📊' },
    { id: 'configuracion', label: 'Configuración', icon: '⚙️' }
  ];

  return (
    <div className="dashboard">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>☕ Café Gourmet</h1>
          <span className="navbar-subtitle">Sistema de Gestión</span>
        </div>
        
        <div className="navbar-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`navbar-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="navbar-user">
          <div className="user-info">
            <span className="user-name">Admin</span>
            <span className="user-role">Administrador</span>
          </div>
          <div className="user-avatar">👤</div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          {activeTab === 'inventario' && <InventarioCRUD />}
          {activeTab === 'combos' && <ComboCreator />}
          {activeTab === 'recomendaciones' && <ComboRecommendations />}
          {activeTab === 'facturacion' && <Facturacion />}
          {activeTab === 'reportes' && (
            <div className="coming-soon">
              <h2>📊 Reportes</h2>
              <p>Esta sección estará disponible próximamente</p>
            </div>
          )}
          {activeTab === 'configuracion' && (
            <div className="coming-soon">
              <h2>⚙️ Configuración</h2>
              <p>Esta sección estará disponible próximamente</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
