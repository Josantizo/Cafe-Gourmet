import React, { useState, useEffect } from 'react';
import StripePayment from './StripePayment';
import './Facturacion.css';

function Facturacion() {
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const [cliente, setCliente] = useState({ nombre: '', telefono: '', email: '' });
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [mostrarFactura, setMostrarFactura] = useState(false);
  const [facturaGenerada, setFacturaGenerada] = useState(null);
  const [mostrarStripeModal, setMostrarStripeModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const comboTypes = [
    {
      id: 'tradicional',
      name: 'Combo Tradicional',
      description: 'Perfecto para empezar el día',
      price: 25.00,
      features: ['Café Arábica de Antigua', 'Taza Pequeña', 'Filtro de Papel'],
      color: '#10b981',
      stock: 15
    },
    {
      id: 'plus',
      name: 'Combo Plus',
      description: 'Para los amantes del café',
      price: 45.00,
      features: ['Café Bourbon de Acatenango', 'Taza Mediana', 'Filtro de Tela'],
      color: '#3b82f6',
      stock: 8
    },
    {
      id: 'premium',
      name: 'Combo Premium',
      description: 'La experiencia más exclusiva',
      price: 65.00,
      features: ['Café Catuai de Amatitlán', 'Taza Grande', 'Filtro de Metal'],
      color: '#8b5cf6',
      stock: 5
    }
  ];

  const agregarAlCarrito = (combo) => {
    if (combo.stock <= 0) {
      alert('No hay stock disponible para este combo');
      return;
    }

    const itemExistente = carrito.find(item => item.id === combo.id);
    if (itemExistente) {
      if (itemExistente.cantidad >= combo.stock) {
        alert('No hay suficiente stock disponible');
        return;
      }
      setCarrito(carrito.map(item =>
        item.id === combo.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      setCarrito([...carrito, { ...combo, cantidad: 1 }]);
    }
  };

  const quitarDelCarrito = (id) => {
    setCarrito(carrito.filter(item => item.id !== id));
  };

  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      quitarDelCarrito(id);
      return;
    }
    setCarrito(carrito.map(item =>
      item.id === id ? { ...item, cantidad: nuevaCantidad } : item
    ));
  };

  useEffect(() => {
    const nuevoTotal = carrito.reduce((sum, item) => sum + (item.price * item.cantidad), 0);
    setTotal(nuevoTotal);
  }, [carrito]);

  const procesarPago = async () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    if (!cliente.nombre.trim()) {
      alert('Por favor ingrese el nombre del cliente');
      return;
    }

    // Si el método de pago es tarjeta, mostrar modal de Stripe
    if (metodoPago === 'tarjeta') {
      setMostrarStripeModal(true);
      return;
    }

    // Para otros métodos de pago, procesar directamente
    await procesarPagoDirecto();
  };

  const procesarPagoDirecto = async () => {
    setIsProcessingPayment(true);
    
    const facturaData = {
      cliente,
      items: carrito,
      subtotal: total,
      impuesto: total * 0.12, // IVA 12%
      total: total * 1.12,
      metodoPago
    };

    try {
      const response = await fetch('http://localhost:5000/api/facturas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(facturaData)
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setFacturaGenerada(result.data);
        setMostrarFactura(true);
        
        // Limpiar carrito después del pago
        setCarrito([]);
        setCliente({ nombre: '', telefono: '', email: '' });
      } else {
        throw new Error(result.message || 'Error al procesar el pago');
      }
      
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      alert(`Error al procesar el pago: ${error.message}`);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleStripePaymentSuccess = async (paymentIntent) => {
    console.log('Pago con Stripe exitoso:', paymentIntent);
    
    // Crear la factura con el método de pago como "tarjeta"
    const facturaData = {
      cliente,
      items: carrito,
      subtotal: total,
      impuesto: total * 0.12, // IVA 12%
      total: total * 1.12,
      metodoPago: 'tarjeta',
      stripePaymentId: paymentIntent.id
    };

    try {
      const response = await fetch('http://localhost:5000/api/facturas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(facturaData)
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setFacturaGenerada(result.data);
        setMostrarFactura(true);
        
        // Limpiar carrito después del pago
        setCarrito([]);
        setCliente({ nombre: '', telefono: '', email: '' });
      } else {
        throw new Error(result.message || 'Error al procesar el pago');
      }
      
    } catch (error) {
      console.error('Error al crear factura después del pago:', error);
      alert(`Error al crear la factura: ${error.message}`);
    }
  };

  const handleStripePaymentError = (error) => {
    console.error('Error en pago con Stripe:', error);
    alert(`Error en el pago: ${error.message}`);
  };

  const getPaymentDataForStripe = () => {
    // Crear un objeto que represente el total del carrito para Stripe
    const totalCarrito = carrito.reduce((sum, item) => sum + (item.price * item.cantidad), 0);
    
    return {
      nombreProducto: `Compra de ${carrito.length} combo(s)`,
      precio: totalCarrito,
      cantidad: 1,
      cliente: cliente
    };
  };

  const imprimirFactura = () => {
    window.print();
  };

  const nuevaVenta = () => {
    setMostrarFactura(false);
    setFacturaGenerada(null);
  };

  return (
    <div className="facturacion">
      <div className="facturacion-header">
        <h1>💳 Sistema de Facturación</h1>
        <p>Gestiona las ventas y cobros de combos de café</p>
      </div>

      {!mostrarFactura ? (
        <div className="facturacion-content">
          {/* Información del Cliente */}
          <div className="cliente-section">
            <h2>👤 Información del Cliente</h2>
            <div className="cliente-form">
              <div className="form-group">
                <label>Nombre Completo *</label>
                <input
                  type="text"
                  value={cliente.nombre}
                  onChange={(e) => setCliente({...cliente, nombre: e.target.value})}
                  placeholder="Ingrese el nombre del cliente"
                />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  value={cliente.telefono}
                  onChange={(e) => setCliente({...cliente, telefono: e.target.value})}
                  placeholder="Número de teléfono"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={cliente.email}
                  onChange={(e) => setCliente({...cliente, email: e.target.value})}
                  placeholder="Correo electrónico"
                />
              </div>
            </div>
          </div>

          {/* Productos Disponibles */}
          <div className="productos-section">
            <h2>☕ Combos Disponibles</h2>
            <div className="productos-grid">
              {comboTypes.map((combo) => (
                <div key={combo.id} className="producto-card" style={{ '--combo-color': combo.color }}>
                  <div className="producto-header">
                    <h3>{combo.name}</h3>
                    <div className="producto-precio">Q {combo.price.toFixed(2)}</div>
                  </div>
                  <p className="producto-descripcion">{combo.description}</p>
                  <div className="producto-stock">
                    Stock: {combo.stock} unidades
                  </div>
                  <ul className="producto-features">
                    {combo.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <button
                    className="agregar-button"
                    onClick={() => agregarAlCarrito(combo)}
                    disabled={combo.stock <= 0}
                  >
                    {combo.stock <= 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Carrito de Compras */}
          <div className="carrito-section">
            <h2>🛒 Carrito de Compras</h2>
            {carrito.length === 0 ? (
              <div className="carrito-vacio">
                <p>El carrito está vacío</p>
                <p>Agrega combos para comenzar la venta</p>
              </div>
            ) : (
              <div className="carrito-items">
                {carrito.map((item) => (
                  <div key={item.id} className="carrito-item">
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p>Q {item.price.toFixed(2)} c/u</p>
                    </div>
                    <div className="item-controls">
                      <button onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}>-</button>
                      <span>{item.cantidad}</span>
                      <button onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}>+</button>
                    </div>
                    <div className="item-total">
                      Q {(item.price * item.cantidad).toFixed(2)}
                    </div>
                    <button
                      className="quitar-button"
                      onClick={() => quitarDelCarrito(item.id)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resumen y Pago */}
          {carrito.length > 0 && (
            <div className="pago-section">
              <div className="resumen-pago">
                <h3>Resumen de Pago</h3>
                <div className="resumen-item">
                  <span>Subtotal:</span>
                  <span>Q {total.toFixed(2)}</span>
                </div>
                <div className="resumen-item">
                  <span>IVA (12%):</span>
                  <span>Q {(total * 0.12).toFixed(2)}</span>
                </div>
                <div className="resumen-item total">
                  <span>Total:</span>
                  <span>Q {(total * 1.12).toFixed(2)}</span>
                </div>
              </div>

              <div className="metodo-pago">
                <h3>Método de Pago</h3>
                <div className="pago-options">
                  <label>
                    <input
                      type="radio"
                      value="efectivo"
                      checked={metodoPago === 'efectivo'}
                      onChange={(e) => setMetodoPago(e.target.value)}
                    />
                    💵 Efectivo
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="tarjeta"
                      checked={metodoPago === 'tarjeta'}
                      onChange={(e) => setMetodoPago(e.target.value)}
                    />
                    💳 Tarjeta
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="transferencia"
                      checked={metodoPago === 'transferencia'}
                      onChange={(e) => setMetodoPago(e.target.value)}
                    />
                    🏦 Transferencia
                  </label>
                </div>
              </div>

              <button 
                className="procesar-pago-button" 
                onClick={procesarPago}
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? (
                  <>
                    <span className="loader"></span>
                    Procesando...
                  </>
                ) : (
                  <>
                    💳 Procesar Pago
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Factura Generada */
        <div className="factura-generada">
          <div className="factura-header">
            <h2>✅ Pago Procesado Exitosamente</h2>
            <div className="factura-actions">
              <button onClick={imprimirFactura} className="imprimir-button">
                🖨️ Imprimir Factura
              </button>
              <button onClick={nuevaVenta} className="nueva-venta-button">
                ➕ Nueva Venta
              </button>
            </div>
          </div>

          <div className="factura-content">
            <div className="factura-info">
              <h3>Factura #{facturaGenerada.id}</h3>
              <p><strong>Fecha:</strong> {new Date(facturaGenerada.fecha).toLocaleString('es-GT')}</p>
              <p><strong>Cliente:</strong> {facturaGenerada.cliente.nombre}</p>
              {facturaGenerada.cliente.telefono && (
                <p><strong>Teléfono:</strong> {facturaGenerada.cliente.telefono}</p>
              )}
              {facturaGenerada.cliente.email && (
                <p><strong>Email:</strong> {facturaGenerada.cliente.email}</p>
              )}
            </div>

            <div className="factura-items">
              <h4>Items Facturados:</h4>
              {facturaGenerada.items.map((item) => (
                <div key={item.id} className="factura-item">
                  <span>{item.nombre} x{item.cantidad}</span>
                  <span>Q {item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="factura-totales">
              <div className="total-line">
                <span>Subtotal:</span>
                <span>Q {facturaGenerada.subtotal.toFixed(2)}</span>
              </div>
              <div className="total-line">
                <span>IVA (12%):</span>
                <span>Q {facturaGenerada.impuesto.toFixed(2)}</span>
              </div>
              <div className="total-line final">
                <span>Total:</span>
                <span>Q {facturaGenerada.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="factura-metodo">
              <p><strong>Método de Pago:</strong> {facturaGenerada.metodoPago}</p>
              <p><strong>Estado:</strong> {facturaGenerada.estado}</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Pago con Stripe */}
      <StripePayment
        isOpen={mostrarStripeModal}
        onClose={() => setMostrarStripeModal(false)}
        paymentData={getPaymentDataForStripe()}
        onPaymentSuccess={handleStripePaymentSuccess}
        onPaymentError={handleStripePaymentError}
      />
    </div>
  );
}

export default Facturacion;
