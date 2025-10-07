import React, { useState, useEffect } from 'react';
import './ComboRecommendations.css';

function ComboRecommendations() {
  const [inventario, setInventario] = useState([]);
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulación de datos de inventario (en un caso real vendría del backend)
  const inventarioSimulado = [
    { id: 1, nombre: 'Café Arábica de Antigua', cantidad: 15, categoria: 'cafe', tipo: 'Arabico', region: 'Antigua' },
    { id: 2, nombre: 'Café Bourbon de Acatenango', cantidad: 8, categoria: 'cafe', tipo: 'Bourbon', region: 'Acatenango' },
    { id: 3, nombre: 'Café Catuai de Amatitlán', cantidad: 5, categoria: 'cafe', tipo: 'Catuai', region: 'Amatitlán' },
    { id: 4, nombre: 'Taza Pequeña', cantidad: 20, categoria: 'taza', tamaño: 'Pequeña' },
    { id: 5, nombre: 'Taza Mediana', cantidad: 12, categoria: 'taza', tamaño: 'Mediana' },
    { id: 6, nombre: 'Taza Grande', cantidad: 8, categoria: 'taza', tamaño: 'Grande' },
    { id: 7, nombre: 'Filtro de Papel', cantidad: 50, categoria: 'filtro', tipo: 'Papel' },
    { id: 8, nombre: 'Filtro de Tela', cantidad: 15, categoria: 'filtro', tipo: 'Tela' },
    { id: 9, nombre: 'Filtro de Metal', cantidad: 10, categoria: 'filtro', tipo: 'Metal' }
  ];

  useEffect(() => {
    // Simular carga de inventario
    setTimeout(() => {
      setInventario(inventarioSimulado);
      generarRecomendaciones(inventarioSimulado);
      setLoading(false);
    }, 1000);
  }, []);

  const generarRecomendaciones = (inventarioData) => {
    const cafes = inventarioData.filter(item => item.categoria === 'cafe');
    const tazas = inventarioData.filter(item => item.categoria === 'taza');
    const filtros = inventarioData.filter(item => item.categoria === 'filtro');

    const recomendacionesGeneradas = [];

    // Recomendación 1: Combo basado en stock más alto
    const cafeMasStock = cafes.reduce((max, cafe) => cafe.cantidad > max.cantidad ? cafe : max, cafes[0]);
    const tazaMasStock = tazas.reduce((max, taza) => taza.cantidad > max.cantidad ? taza : max, tazas[0]);
    const filtroMasStock = filtros.reduce((max, filtro) => filtro.cantidad > max.cantidad ? filtro : max, filtros[0]);

    if (cafeMasStock && tazaMasStock && filtroMasStock) {
      recomendacionesGeneradas.push({
        id: 'recomendacion-1',
        nombre: 'Combo Recomendado por Stock',
        descripcion: 'Basado en los productos con mayor disponibilidad',
        precio: 25.00,
        items: [cafeMasStock, tazaMasStock, filtroMasStock],
        razon: 'Mayor disponibilidad en inventario',
        prioridad: 'alta',
        color: '#10b981'
      });
    }

    // Recomendación 2: Combo premium si hay stock suficiente
    const cafePremium = cafes.find(cafe => cafe.tipo === 'Catuai' && cafe.cantidad >= 3);
    const tazaGrande = tazas.find(taza => taza.tamaño === 'Grande' && taza.cantidad >= 3);
    const filtroMetal = filtros.find(filtro => filtro.tipo === 'Metal' && filtro.cantidad >= 3);

    if (cafePremium && tazaGrande && filtroMetal) {
      recomendacionesGeneradas.push({
        id: 'recomendacion-2',
        nombre: 'Combo Premium Disponible',
        descripcion: 'Para clientes que buscan la mejor experiencia',
        precio: 65.00,
        items: [cafePremium, tazaGrande, filtroMetal],
        razon: 'Stock suficiente para combo premium',
        prioridad: 'media',
        color: '#8b5cf6'
      });
    }

    // Recomendación 3: Combo balanceado
    const cafeBalanceado = cafes.find(cafe => cafe.tipo === 'Bourbon' && cafe.cantidad >= 5);
    const tazaMediana = tazas.find(taza => taza.tamaño === 'Mediana' && taza.cantidad >= 5);
    const filtroTela = filtros.find(filtro => filtro.tipo === 'Tela' && filtro.cantidad >= 5);

    if (cafeBalanceado && tazaMediana && filtroTela) {
      recomendacionesGeneradas.push({
        id: 'recomendacion-3',
        nombre: 'Combo Balanceado',
        descripcion: 'Perfecto equilibrio entre calidad y precio',
        precio: 45.00,
        items: [cafeBalanceado, tazaMediana, filtroTela],
        razon: 'Stock balanceado para combo intermedio',
        prioridad: 'media',
        color: '#3b82f6'
      });
    }

    // Recomendación 4: Combo de emergencia (stock bajo)
    const itemsBajoStock = inventarioData.filter(item => item.cantidad <= 5);
    if (itemsBajoStock.length > 0) {
      recomendacionesGeneradas.push({
        id: 'recomendacion-4',
        nombre: 'Combo de Liquidación',
        descripcion: 'Productos con stock limitado - ¡Aprovecha!',
        precio: 20.00,
        items: itemsBajoStock.slice(0, 3),
        razon: 'Liquidación de productos con stock bajo',
        prioridad: 'baja',
        color: '#f59e0b'
      });
    }

    setRecomendaciones(recomendacionesGeneradas);
  };

  const getPrioridadIcon = (prioridad) => {
    switch (prioridad) {
      case 'alta': return '🔥';
      case 'media': return '⭐';
      case 'baja': return '💡';
      default: return '📋';
    }
  };

  const getPrioridadText = (prioridad) => {
    switch (prioridad) {
      case 'alta': return 'Alta Prioridad';
      case 'media': return 'Prioridad Media';
      case 'baja': return 'Baja Prioridad';
      default: return 'Recomendación';
    }
  };

  if (loading) {
    return (
      <div className="combo-recommendations">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Analizando inventario para generar recomendaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="combo-recommendations">
      <div className="recommendations-header">
        <h1>🎯 Recomendaciones de Combos</h1>
        <p>Combos sugeridos basados en tu inventario actual</p>
      </div>

      <div className="inventario-resumen">
        <h2>📊 Resumen del Inventario</h2>
        <div className="inventario-stats">
          <div className="stat-card">
            <span className="stat-icon">☕</span>
            <div className="stat-info">
              <h3>{inventario.filter(item => item.categoria === 'cafe').length}</h3>
              <p>Tipos de Café</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🥤</span>
            <div className="stat-info">
              <h3>{inventario.filter(item => item.categoria === 'taza').length}</h3>
              <p>Tipos de Tazas</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🔍</span>
            <div className="stat-info">
              <h3>{inventario.filter(item => item.categoria === 'filtro').length}</h3>
              <p>Tipos de Filtros</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">⚠️</span>
            <div className="stat-info">
              <h3>{inventario.filter(item => item.cantidad <= 5).length}</h3>
              <p>Productos con Stock Bajo</p>
            </div>
          </div>
        </div>
      </div>

      <div className="recomendaciones-grid">
        {recomendaciones.map((recomendacion) => (
          <div
            key={recomendacion.id}
            className="recomendacion-card"
            style={{ '--combo-color': recomendacion.color }}
          >
            <div className="recomendacion-header">
              <div className="recomendacion-titulo">
                <h3>{recomendacion.nombre}</h3>
                <div className="prioridad-badge">
                  <span className="prioridad-icon">{getPrioridadIcon(recomendacion.prioridad)}</span>
                  <span className="prioridad-text">{getPrioridadText(recomendacion.prioridad)}</span>
                </div>
              </div>
              <div className="recomendacion-precio">Q {recomendacion.precio.toFixed(2)}</div>
            </div>

            <p className="recomendacion-descripcion">{recomendacion.descripcion}</p>

            <div className="recomendacion-razon">
              <strong>💡 Razón:</strong> {recomendacion.razon}
            </div>

            <div className="recomendacion-items">
              <h4>Items Incluidos:</h4>
              <ul>
                {recomendacion.items.map((item, index) => (
                  <li key={index}>
                    <span className="item-nombre">{item.nombre}</span>
                    <span className="item-stock">Stock: {item.cantidad}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="recomendacion-actions">
              <button className="crear-combo-button">
                🛒 Crear Este Combo
              </button>
              <button className="ver-detalles-button">
                👁️ Ver Detalles
              </button>
            </div>
          </div>
        ))}
      </div>

      {recomendaciones.length === 0 && (
        <div className="sin-recomendaciones">
          <h3>🤔 No hay recomendaciones disponibles</h3>
          <p>Actualiza tu inventario para generar recomendaciones personalizadas</p>
        </div>
      )}

      <div className="recomendaciones-tips">
        <h3>💡 Consejos para Mejorar las Recomendaciones</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <span className="tip-icon">📈</span>
            <h4>Mantén Stock Balanceado</h4>
            <p>Procura tener cantidades similares de todos los productos para crear más opciones de combos</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">🔄</span>
            <h4>Actualiza Regularmente</h4>
            <p>Revisa y actualiza tu inventario frecuentemente para obtener recomendaciones más precisas</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">📊</span>
            <h4>Analiza las Ventas</h4>
            <p>Considera qué combos se venden más para ajustar las recomendaciones</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComboRecommendations;
