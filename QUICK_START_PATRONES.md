# 🚀 Quick Start - Patrones de Comportamiento

Guía rápida para empezar a usar los patrones de comportamiento en Café Gourmet.

## 📦 Instalación Rápida

### 1. Backend

```bash
cd backend
npm install
npm start
```

✅ Servidor corriendo en `http://localhost:5000`

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

✅ Aplicación corriendo en `http://localhost:3000`

---

## 🧪 Probar los Patrones (Sin Frontend)

Ejecuta el script de prueba en el backend:

```bash
cd backend
node test-patterns.js
```

Esto demostrará:
- ✅ Observer: Notificaciones automáticas
- ✅ Strategy: Selección de estrategias
- ✅ Command: Deshacer/Rehacer operaciones

---

## 🎨 Usar los Patrones desde la UI

### 1. Abrir la aplicación

Navega a `http://localhost:3000` y haz clic en **🎨 Patrones** en el navbar.

### 2. Patrón Observer

**¿Qué hace?**
Notifica automáticamente cuando el stock de granos es bajo.

**Cómo probar:**
1. Click en tab **👁️ Observer**
2. Click en **🔍 Verificar Todos los Stocks**
3. Ver notificaciones generadas en tiempo real
4. Simular consumo de granos para generar más notificaciones

**Resultado:**
- 📬 Notificaciones con prioridad (CRÍTICA, ALTA, MEDIA, BAJA)
- 📧 Emails simulados al responsable de compras
- 📝 Logs del sistema

### 3. Patrón Strategy

**¿Qué hace?**
Selecciona automáticamente la mejor estrategia de distribución.

**Cómo probar:**
1. Click en tab **🎯 Strategy**
2. Configurar pedido:
   - Distancia: 25 km
   - Peso: 3 kg
   - Prioridad: Alta
   - Urgente: ✓
3. Click en **🤖 Selección Automática**
4. Click en **📊 Comparar Estrategias**

**Resultado:**
- La mejor estrategia seleccionada automáticamente
- Comparación de costos y tiempos
- Características de cada estrategia

### 4. Patrón Command

**¿Qué hace?**
Permite deshacer y rehacer operaciones de inventario.

**Cómo probar:**
1. Click en tab **⚡ Command**
2. Seleccionar **Agregar Producto**
3. Llenar datos:
   - Tipo de Grano: "Arábica Premium"
   - Cantidad: 5000 g
   - Precio: 150
4. Click en **⚡ Ejecutar Comando**
5. Click en **↩️ Deshacer** (producto eliminado)
6. Click en **🔄 Rehacer** (producto restaurado)

**Resultado:**
- ✅ Operaciones ejecutadas
- 📜 Historial completo
- 🔄 Capacidad de deshacer/rehacer

---

## 🌐 API Endpoints - Ejemplos Rápidos

### Observer

**Verificar stocks:**
```bash
curl -X POST http://localhost:5000/api/patterns/observer/verificar-stocks
```

**Ver notificaciones:**
```bash
curl http://localhost:5000/api/patterns/observer/notificaciones
```

**Consumir granos (trigger):**
```bash
curl -X POST http://localhost:5000/api/patterns/observer/consumir-granos \
  -H "Content-Type: application/json" \
  -d '{"idGranos": 1, "cantidad": 3000}'
```

### Strategy

**Selección automática:**
```bash
curl -X POST http://localhost:5000/api/patterns/strategy/seleccionar-automatica \
  -H "Content-Type: application/json" \
  -d '{
    "pedido": {
      "distanciaKm": 25,
      "peso": 3,
      "prioridad": "alta",
      "esUrgente": true
    }
  }'
```

**Comparar estrategias:**
```bash
curl -X POST http://localhost:5000/api/patterns/strategy/comparar \
  -H "Content-Type: application/json" \
  -d '{
    "pedido": {
      "distanciaKm": 15,
      "peso": 2
    }
  }'
```

### Command

**Ejecutar comando (agregar):**
```bash
curl -X POST http://localhost:5000/api/patterns/command/ejecutar \
  -H "Content-Type: application/json" \
  -d '{
    "tipoComando": "agregar",
    "datos": {
      "datosProducto": {
        "TipoGrano": "Robusta",
        "Cantidad_Gramos": 5000,
        "Precio": 120
      }
    }
  }'
```

**Deshacer último comando:**
```bash
curl -X POST http://localhost:5000/api/patterns/command/deshacer
```

**Ver historial:**
```bash
curl http://localhost:5000/api/patterns/command/historial
```

---

## 📚 Documentación Completa

Para más detalles, ver [PATRONES_COMPORTAMIENTO.md](./PATRONES_COMPORTAMIENTO.md)

---

## 🔧 Troubleshooting

### El backend no inicia

**Problema:** Error de conexión a la base de datos

**Solución:**
1. Verificar que MySQL está corriendo
2. Revisar credenciales en `backend/.env`:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tu_password
   DB_NAME=cafeteria
   DB_PORT=3306
   ```

### El frontend no se conecta al backend

**Problema:** Error CORS o conexión rechazada

**Solución:**
1. Verificar que el backend está corriendo en puerto 5000
2. Verificar configuración CORS en `backend/server.js`
3. Actualizar URL en `frontend/src/components/PatronesComportamiento.jsx`:
   ```javascript
   const API_URL = 'http://localhost:5000/api/patterns';
   ```

### Las notificaciones no aparecen

**Problema:** Los observadores no están registrados

**Solución:**
El `PatternController` registra automáticamente los observadores al iniciar.
Si no aparecen:
1. Reiniciar el servidor backend
2. Verificar consola del backend para mensajes de registro

---

## 💡 Tips

### Mejores prácticas

1. **Observer**: Usa `verificarStockBajo()` después de cada actualización de inventario
2. **Strategy**: Llama a `seleccionarEstrategiaAutomatica()` en lugar de elegir manual
3. **Command**: Mantén un límite razonable en el historial (default: 50)

### Performance

- Los comandos se guardan en memoria, considera persistencia para producción
- Las notificaciones se acumulan, limpia periódicamente
- Las estrategias no tienen estado, son seguras para concurrencia

---

## 🎯 Casos de Uso Reales

### Caso 1: Sistema de Alertas de Inventario

**Escenario:**
Una tienda de café necesita reordenar granos automáticamente.

**Solución con Observer:**
```javascript
// El GestorDeInventario notifica automáticamente
// ResponsableDeCompras recibe la alerta y genera orden de compra
gestorDeInventario.consumirGranos(1, 8000); // Consume 8kg
// → Notificación CRÍTICA enviada
// → Orden de compra automática generada
```

### Caso 2: Optimización de Costos de Envío

**Escenario:**
Una empresa quiere minimizar costos de distribución.

**Solución con Strategy:**
```javascript
// El contexto selecciona la estrategia más económica
contexto.seleccionarEstrategiaAutomatica({
  distanciaKm: 120,
  peso: 10,
  prioridad: 'baja'
});
// → Selecciona DistribucionEconomica
// → Ahorro del 40% vs. DistribucionRapida
```

### Caso 3: Auditoría de Cambios en Inventario

**Escenario:**
Se requiere rastrear y revertir cambios accidentales.

**Solución con Command:**
```javascript
// Todos los cambios quedan registrados
// Se puede deshacer cualquier operación
invocador.ejecutarComando(new ActualizarProductoCommand(1, {...}));
invocador.deshacerUltimoComando(); // Revertir cambio
// → Auditoría completa en historial
```

---

## 📞 Soporte

Si tienes problemas o preguntas:

1. 📖 Lee la [documentación completa](./PATRONES_COMPORTAMIENTO.md)
2. 🧪 Ejecuta `node test-patterns.js` para verificar funcionamiento
3. 🔍 Revisa logs del backend para errores
4. 💬 Contacta al equipo de desarrollo

---

**¡Listo para empezar! 🚀**

