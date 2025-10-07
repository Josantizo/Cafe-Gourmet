import React, { useState } from 'react';
import './ComboCreator.css';

function ComboCreator() {
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [comboDetails, setComboDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const comboTypes = [
    {
      id: 'tradicional',
      name: 'Combo Tradicional',
      description: 'Perfecto para empezar el día',
      price: 'Q 25.00',
      features: ['Café Arábica de Antigua', 'Taza Pequeña', 'Filtro de Papel'],
      color: '#10b981'
    },
    {
      id: 'plus',
      name: 'Combo Plus',
      description: 'Para los amantes del café',
      price: 'Q 45.00',
      features: ['Café Bourbon de Acatenango', 'Taza Mediana', 'Filtro de Tela'],
      color: '#3b82f6'
    },
    {
      id: 'premium',
      name: 'Combo Premium',
      description: 'La experiencia más exclusiva',
      price: 'Q 65.00',
      features: ['Café Catuai de Amatitlán', 'Taza Grande', 'Filtro de Metal'],
      color: '#8b5cf6'
    }
  ];

  const createCombo = async (comboType) => {
    setLoading(true);
    setError(null);
    setSelectedCombo(comboType);

    try {
      const response = await fetch(`http://localhost:5000/combo/${comboType}`);
      
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const comboData = await response.json();
      setComboDetails(comboData);
    } catch (err) {
      setError(`Error al crear el combo: ${err.message}`);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetSelection = () => {
    setSelectedCombo(null);
    setComboDetails(null);
    setError(null);
  };

  return (
    <div className="combo-creator">
      <div className="combo-header">
        <h1>☕ Creador de Combos de Café</h1>
        <p>Selecciona el tipo de combo que deseas crear y personalizar</p>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
          <button onClick={resetSelection} className="retry-button">
            Intentar de nuevo
          </button>
        </div>
      )}

      {!selectedCombo ? (
        <div className="combo-selection">
          <h2>Selecciona un tipo de combo</h2>
          <div className="combo-grid">
            {comboTypes.map((combo) => (
              <div
                key={combo.id}
                className="combo-card"
                style={{ '--combo-color': combo.color }}
                onClick={() => createCombo(combo.id)}
              >
                <div className="combo-card-header">
                  <h3>{combo.name}</h3>
                  <div className="combo-price">{combo.price}</div>
                </div>
                <p className="combo-description">{combo.description}</p>
                <ul className="combo-features">
                  {combo.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                <button className="create-button">
                  {loading ? 'Creando...' : 'Crear Combo'}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="combo-result">
          <div className="result-header">
            <h2>✅ Combo Creado Exitosamente</h2>
            <button onClick={resetSelection} className="new-combo-button">
              Crear Nuevo Combo
            </button>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Creando tu combo personalizado...</p>
            </div>
          ) : comboDetails ? (
            <div className="combo-details">
              <div className="combo-info-card">
                <h3>Detalles del Combo</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Café:</span>
                    <span className="detail-value">{comboDetails.cafe}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Taza:</span>
                    <span className="detail-value">{comboDetails.taza}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Filtro:</span>
                    <span className="detail-value">{comboDetails.filtro}</span>
                  </div>
                </div>
              </div>

              <div className="combo-actions">
                <button className="action-button primary">
                  📋 Guardar Combo
                </button>
                <button className="action-button secondary">
                  🖨️ Imprimir Receta
                </button>
                <button className="action-button secondary">
                  📤 Compartir
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}

      <div className="combo-tips">
        <h3>💡 Consejos para tu combo</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <span className="tip-icon">🌡️</span>
            <h4>Temperatura ideal</h4>
            <p>El agua debe estar entre 90-96°C para extraer el mejor sabor</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">⏱️</span>
            <h4>Tiempo de extracción</h4>
            <p>Deja reposar el café por 3-4 minutos para un sabor óptimo</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">💧</span>
            <h4>Proporción de agua</h4>
            <p>Usa 1 gramo de café por cada 15-17 ml de agua</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComboCreator;
