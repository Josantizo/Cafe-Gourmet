const express = require('express');
const router = express.Router();

// Array para almacenar las facturas (en un caso real sería una base de datos)
let facturas = [];
let contadorFacturas = 1;

// Obtener todas las facturas
router.get('/facturas', (req, res) => {
  try {
    res.json({
      success: true,
      data: facturas,
      total: facturas.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las facturas',
      error: error.message
    });
  }
});

// Obtener una factura por ID
router.get('/facturas/:id', (req, res) => {
  try {
    const { id } = req.params;
    const factura = facturas.find(f => f.id === id);
    
    if (!factura) {
      return res.status(404).json({
        success: false,
        message: 'Factura no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: factura
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la factura',
      error: error.message
    });
  }
});

// Crear una nueva factura
router.post('/facturas', (req, res) => {
  try {
    const { cliente, items, subtotal, impuesto, total, metodoPago } = req.body;
    
    // Validaciones básicas
    if (!cliente || !cliente.nombre) {
      return res.status(400).json({
        success: false,
        message: 'El nombre del cliente es requerido'
      });
    }
    
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'La factura debe tener al menos un item'
      });
    }
    
    if (!total || total <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El total debe ser mayor a 0'
      });
    }
    
    // Crear la factura
    const factura = {
      id: `FAC-${String(contadorFacturas).padStart(6, '0')}`,
      numero: contadorFacturas++,
      fecha: new Date().toISOString(),
      cliente: {
        nombre: cliente.nombre,
        telefono: cliente.telefono || '',
        email: cliente.email || ''
      },
      items: items.map(item => ({
        id: item.id,
        nombre: item.name,
        cantidad: item.cantidad,
        precio: item.price,
        subtotal: item.price * item.cantidad
      })),
      subtotal: subtotal,
      impuesto: impuesto || 0,
      total: total,
      metodoPago: metodoPago || 'efectivo',
      estado: 'pagado',
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    };
    
    // Agregar a la lista de facturas
    facturas.push(factura);
    
    res.status(201).json({
      success: true,
      message: 'Factura creada exitosamente',
      data: factura
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear la factura',
      error: error.message
    });
  }
});

// Actualizar el estado de una factura
router.put('/facturas/:id/estado', (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    
    const factura = facturas.find(f => f.id === id);
    if (!factura) {
      return res.status(404).json({
        success: false,
        message: 'Factura no encontrada'
      });
    }
    
    factura.estado = estado;
    factura.fechaActualizacion = new Date().toISOString();
    
    res.json({
      success: true,
      message: 'Estado de factura actualizado',
      data: factura
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la factura',
      error: error.message
    });
  }
});

// Obtener estadísticas de ventas
router.get('/estadisticas', (req, res) => {
  try {
    const totalFacturas = facturas.length;
    const totalVentas = facturas.reduce((sum, f) => sum + f.total, 0);
    const facturasPagadas = facturas.filter(f => f.estado === 'pagado').length;
    const facturasPendientes = facturas.filter(f => f.estado === 'pendiente').length;
    
    // Ventas por método de pago
    const ventasPorMetodo = facturas.reduce((acc, f) => {
      acc[f.metodoPago] = (acc[f.metodoPago] || 0) + f.total;
      return acc;
    }, {});
    
    // Productos más vendidos
    const productosVendidos = {};
    facturas.forEach(factura => {
      factura.items.forEach(item => {
        productosVendidos[item.nombre] = (productosVendidos[item.nombre] || 0) + item.cantidad;
      });
    });
    
    const productosMasVendidos = Object.entries(productosVendidos)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([nombre, cantidad]) => ({ nombre, cantidad }));
    
    res.json({
      success: true,
      data: {
        resumen: {
          totalFacturas,
          totalVentas: parseFloat(totalVentas.toFixed(2)),
          facturasPagadas,
          facturasPendientes
        },
        ventasPorMetodo,
        productosMasVendidos
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
});

// Eliminar una factura (solo para desarrollo)
router.delete('/facturas/:id', (req, res) => {
  try {
    const { id } = req.params;
    const index = facturas.findIndex(f => f.id === id);
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Factura no encontrada'
      });
    }
    
    facturas.splice(index, 1);
    
    res.json({
      success: true,
      message: 'Factura eliminada exitosamente'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la factura',
      error: error.message
    });
  }
});

module.exports = router;
