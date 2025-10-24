# 🎨 Patrones de Comportamiento - Café Gourmet

Este documento describe la implementación de los tres patrones de comportamiento en el sistema de gestión de Café Gourmet, siguiendo los principios SOLID y las mejores prácticas de programación orientada a objetos.

## 📋 Tabla de Contenidos

- [Patrón Observer](#patrón-observer)
- [Patrón Strategy](#patrón-strategy)
- [Patrón Command](#patrón-command)
- [Arquitectura y Principios SOLID](#arquitectura-y-principios-solid)
- [API Endpoints](#api-endpoints)
- [Ejemplos de Uso](#ejemplos-de-uso)

---

## 👁️ Patrón Observer

### Descripción
Implementa un sistema de notificación automática cuando el stock de granos es bajo. El `GestorDeInventario` actúa como **Subject** y notifica a sus **Observadores** cuando ocurren eventos relevantes.

### Estructura

```
backend/patterns/observer/
├── Observer.js                    # Interfaz Observer (ISP)
├── Subject.js                     # Clase Subject base
├── ResponsableDeCompras.js        # Observador concreto
└── NotificadorSistema.js          # Observador concreto
```

### Componentes

#### 1. **Observer** (Interfaz)
Define el contrato para todos los observadores.

```javascript
class Observer {
  actualizar(data) { }
  obtenerNombre() { }
}
```

#### 2. **Subject** (Sujeto)
Mantiene una lista de observadores y los notifica de cambios.

```javascript
class Subject {
  agregarObservador(observador)
  eliminarObservador(observador)
  notificarObservadores(data)
}
```

#### 3. **ResponsableDeCompras** (Observador Concreto)
Recibe notificaciones de stock bajo y toma acciones.

**Características:**
- ✅ Recibe notificaciones automáticas
- 📧 Envía emails simulados
- 🚨 Determina prioridad (CRÍTICA, ALTA, MEDIA, BAJA)
- ⚠️ Toma acciones inmediatas para casos críticos

#### 4. **NotificadorSistema** (Observador Concreto)
Registra eventos del sistema en logs.

**Características:**
- 📝 Registra todos los eventos
- 💾 Guarda logs en archivo (simulado)
- 📊 Genera estadísticas
- 🗑️ Limpia logs antiguos

### Integración con GestorDeInventario

El `GestorDeInventario` hereda de `Subject`:

```javascript
class GestorDeInventario extends Subject {
  async verificarStockBajo(idGranos) {
    // Verifica y notifica si el stock está bajo
  }
  
  async verificarTodosLosStocks() {
    // Verifica todos los granos
  }
}
```

### Principios SOLID Aplicados

- **Single Responsibility Principle (SRP)**: Cada observador tiene una responsabilidad única.
- **Open/Closed Principle (OCP)**: Puedes agregar nuevos observadores sin modificar el Subject.
- **Interface Segregation Principle (ISP)**: Interfaz Observer con métodos mínimos necesarios.
- **Dependency Inversion Principle (DIP)**: Subject depende de la abstracción Observer, no de implementaciones concretas.

---

## 🎯 Patrón Strategy

### Descripción
Implementa la selección dinámica de estrategias de distribución según las características del pedido. Permite cambiar el algoritmo de cálculo de costo y tiempo en tiempo de ejecución.

### Estructura

```
backend/patterns/strategy/
├── EstrategiaDistribucion.js      # Interfaz Strategy (ISP)
├── DistribucionRapida.js          # Estrategia concreta
├── DistribucionEconomica.js       # Estrategia concreta
├── DistribucionBalanceada.js      # Estrategia concreta
└── ContextoDeDistribucion.js      # Contexto
```

### Estrategias Disponibles

#### 1. **DistribucionRapida** 🚀
Prioriza velocidad sobre costo.

**Características:**
- Costo base: $15 USD
- Costo por km: $2.5 USD
- Velocidad: 60 km/h
- Tiempo preparación: 1 hora

**Recargos:**
- 50% adicional si es urgente
- 20% adicional si distancia > 20 km
- $5 por kg adicional

**Ventajas:**
- ✅ Entrega más rápida
- 📦 Seguimiento en tiempo real
- 🔒 Seguro incluido

#### 2. **DistribucionEconomica** 💰
Prioriza costo sobre velocidad.

**Características:**
- Costo base: $5 USD
- Costo por km: $0.8 USD
- Velocidad: 40 km/h
- Tiempo preparación: 4 horas

**Descuentos:**
- 5% si volumen > 0.5 m³
- 15% si distancia > 50 km
- Solo cobra después de 2 kg

**Ventajas:**
- ✅ Costo más bajo
- ♻️ Ruta optimizada
- 🌍 Sin límite de distancia

#### 3. **DistribucionBalanceada** ⚖️
Equilibrio entre costo y velocidad.

**Características:**
- Costo base: $8 USD
- Costo por km: $1.5 USD
- Velocidad: 50 km/h
- Tiempo preparación: 2 horas

**Ajustes por prioridad:**
- Alta: +20% costo, -15% tiempo
- Normal: sin cambios
- Baja: -10% costo, +15% tiempo

### ContextoDeDistribucion

Gestiona la selección y ejecución de estrategias.

**Métodos principales:**
```javascript
establecerEstrategia(tipoEstrategia)
seleccionarEstrategiaAutomatica(pedido)
compararEstrategias(pedido)
```

### Selección Automática

El contexto puede seleccionar automáticamente la mejor estrategia basándose en:
- Distancia del pedido
- Presupuesto máximo
- Tiempo máximo
- Prioridad (urgente/alta/normal/baja)
- Peso y volumen

### Principios SOLID Aplicados

- **Single Responsibility Principle (SRP)**: Cada estrategia calcula costo/tiempo de forma independiente.
- **Open/Closed Principle (OCP)**: Puedes agregar nuevas estrategias sin modificar el contexto.
- **Liskov Substitution Principle (LSP)**: Todas las estrategias son intercambiables.
- **Dependency Inversion Principle (DIP)**: El contexto depende de la abstracción EstrategiaDistribucion.

---

## ⚡ Patrón Command

### Descripción
Implementa operaciones de inventario con capacidad de deshacer (undo) y rehacer (redo). Encapsula cada operación como un objeto independiente.

### Estructura

```
backend/patterns/command/
├── Command.js                      # Interfaz Command (ISP)
├── AgregarProductoCommand.js       # Comando concreto
├── RetirarProductoCommand.js       # Comando concreto
├── ActualizarProductoCommand.js    # Comando concreto
└── InvocadorDeComandos.js          # Invoker
```

### Comandos Disponibles

#### 1. **AgregarProductoCommand** ➕
Agrega un producto al inventario.

**Operaciones:**
- `ejecutar()`: Crea el producto en la base de datos
- `deshacer()`: Elimina el producto creado

**Datos requeridos:**
```javascript
{
  TipoGrano: string,
  Cantidad_Gramos: number,
  Precio: number,
  Fecha_Vencimiento: date
}
```

#### 2. **RetirarProductoCommand** ➖
Retira un producto del inventario.

**Operaciones:**
- `ejecutar()`: Hace backup y elimina el producto
- `deshacer()`: Restaura el producto eliminado

**Datos requeridos:**
```javascript
{
  idProducto: number
}
```

**Nota:** Al deshacer, el producto se restaura con un nuevo ID.

#### 3. **ActualizarProductoCommand** ✏️
Actualiza campos de un producto.

**Operaciones:**
- `ejecutar()`: Hace backup de campos actuales y actualiza
- `deshacer()`: Restaura los valores anteriores

**Datos requeridos:**
```javascript
{
  idProducto: number,
  nuevosDatos: {
    campo1: valor1,
    campo2: valor2
  }
}
```

### InvocadorDeComandos (Invoker)

Gestiona la ejecución y el historial de comandos.

**Métodos principales:**
```javascript
ejecutarComando(comando)
deshacerUltimoComando()
rehacerUltimoComando()
deshacerMultiplesComandos(cantidad)
obtenerHistorialEjecutados(limite)
obtenerHistorialDeshechos(limite)
```

**Características:**
- 📜 Mantiene historial de ejecutados y deshechos
- 🔄 Permite deshacer y rehacer
- 📊 Genera estadísticas
- 🗑️ Limpia historial automáticamente (límite: 50)

### Principios SOLID Aplicados

- **Single Responsibility Principle (SRP)**: Cada comando encapsula una operación específica.
- **Open/Closed Principle (OCP)**: Puedes agregar nuevos comandos sin modificar el invoker.
- **Interface Segregation Principle (ISP)**: Interfaz Command con métodos esenciales.
- **Dependency Inversion Principle (DIP)**: El invoker depende de la abstracción Command.

---

## 🏗️ Arquitectura y Principios SOLID

### Estructura General

```
backend/
├── patterns/
│   ├── observer/          # Patrón Observer
│   ├── strategy/          # Patrón Strategy
│   └── command/           # Patrón Command
├── controllers/
│   └── patternController.js
├── routes/
│   └── patterns.js
└── models/
    └── GestorDeInventario.js
```

### Principios SOLID Implementados

#### 1. **Single Responsibility Principle (SRP)**
- Cada clase tiene una única responsabilidad
- Los observadores solo observan y reaccionan
- Las estrategias solo calculan costos/tiempos
- Los comandos solo ejecutan/deshacen operaciones

#### 2. **Open/Closed Principle (OCP)**
- Abierto para extensión: Puedes agregar nuevos observadores, estrategias y comandos
- Cerrado para modificación: No necesitas modificar código existente

#### 3. **Liskov Substitution Principle (LSP)**
- Todas las estrategias son intercambiables
- Todos los observadores son intercambiables
- Todos los comandos son intercambiables

#### 4. **Interface Segregation Principle (ISP)**
- Interfaces pequeñas y específicas
- Observer, EstrategiaDistribucion, Command tienen solo métodos necesarios

#### 5. **Dependency Inversion Principle (DIP)**
- Las clases de alto nivel dependen de abstracciones
- Subject depende de Observer (no de ResponsableDeCompras)
- ContextoDeDistribucion depende de EstrategiaDistribucion
- InvocadorDeComandos depende de Command

---

## 🌐 API Endpoints

### Observer

```
POST   /api/patterns/observer/verificar-stocks
GET    /api/patterns/observer/notificaciones
GET    /api/patterns/observer/logs?severidad=CRITICAL
POST   /api/patterns/observer/consumir-granos
```

### Strategy

```
POST   /api/patterns/strategy/calcular
POST   /api/patterns/strategy/seleccionar-automatica
POST   /api/patterns/strategy/comparar
GET    /api/patterns/strategy/disponibles
```

### Command

```
POST   /api/patterns/command/ejecutar
POST   /api/patterns/command/deshacer
POST   /api/patterns/command/rehacer
GET    /api/patterns/command/historial?limite=10
GET    /api/patterns/command/estadisticas
```

---

## 💻 Ejemplos de Uso

### Observer - Verificar Stocks

```javascript
// Verificar todos los stocks
const response = await fetch('http://localhost:5000/api/patterns/observer/verificar-stocks', {
  method: 'POST'
});
const data = await response.json();
console.log(data);
// {
//   success: true,
//   data: {
//     totalGranos: 10,
//     granosConStockBajo: 3
//   }
// }
```

### Observer - Consumir Granos (Trigger de Notificación)

```javascript
const response = await fetch('http://localhost:5000/api/patterns/observer/consumir-granos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    idGranos: 1,
    cantidad: 5000  // Consumir 5kg
  })
});
```

### Strategy - Selección Automática

```javascript
const response = await fetch('http://localhost:5000/api/patterns/strategy/seleccionar-automatica', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    pedido: {
      distanciaKm: 25,
      peso: 3,
      prioridad: 'alta',
      esUrgente: true
    }
  })
});
const data = await response.json();
console.log(data.data.estrategiaSeleccionada); // 'rapida'
```

### Strategy - Comparar Estrategias

```javascript
const response = await fetch('http://localhost:5000/api/patterns/strategy/comparar', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    pedido: {
      distanciaKm: 15,
      peso: 2,
      prioridad: 'normal'
    }
  })
});
const data = await response.json();
// Retorna comparación de las 3 estrategias
```

### Command - Agregar Producto

```javascript
const response = await fetch('http://localhost:5000/api/patterns/command/ejecutar', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tipoComando: 'agregar',
    datos: {
      datosProducto: {
        TipoGrano: 'Arábica Premium',
        Cantidad_Gramos: 5000,
        Cantidad_Gramos_Restock: 2000,
        Precio: 150.00,
        Fecha_Vencimiento: '2025-12-31'
      }
    }
  })
});
```

### Command - Deshacer Último Comando

```javascript
const response = await fetch('http://localhost:5000/api/patterns/command/deshacer', {
  method: 'POST'
});
const data = await response.json();
console.log(data.message); // 'Comando deshecho exitosamente'
```

### Command - Ver Historial

```javascript
const response = await fetch('http://localhost:5000/api/patterns/command/historial?limite=5');
const data = await response.json();
console.log(data.data.ejecutados);
console.log(data.data.estadisticas);
```

---

## 🚀 Iniciar el Sistema

### Backend

```bash
cd backend
npm install
npm start
```

El servidor estará disponible en `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm start
```

La aplicación estará disponible en `http://localhost:3000`

### Acceder a los Patrones

1. Abrir `http://localhost:3000`
2. Hacer clic en la pestaña **"🎨 Patrones"** en el navbar
3. Navegar entre las pestañas:
   - **👁️ Observer**: Notificaciones de stock
   - **🎯 Strategy**: Estrategias de distribución
   - **⚡ Command**: Operaciones de inventario

---

## 📊 Diagramas de Clases

### Observer Pattern

```
┌─────────────┐
│   Subject   │
├─────────────┤
│ +agregarObservador()
│ +eliminarObservador()
│ +notificarObservadores()
└─────────────┘
       △
       │
       │
┌──────┴───────┐
│ GestorDeInventario │
├────────────────────┤
│ +verificarStockBajo()
│ +verificarTodosLosStocks()
└────────────────────┘

┌──────────────┐          ┌───────────────────┐
│   Observer   │◄─────────│ResponsableDeCompras│
├──────────────┤          ├───────────────────┤
│ +actualizar()│          │ +actualizar()     │
│ +obtenerNombre()        │ +enviarEmail()    │
└──────────────┘          └───────────────────┘
                          
                          ┌──────────────────┐
                          │NotificadorSistema│
                          ├──────────────────┤
                          │ +actualizar()    │
                          │ +obtenerLogs()   │
                          └──────────────────┘
```

### Strategy Pattern

```
┌─────────────────────────┐
│ EstrategiaDistribucion  │
├─────────────────────────┤
│ +calcularCosto()        │
│ +calcularTiempoEntrega()│
└─────────────────────────┘
            △
            │
    ┌───────┴───────┬───────────────┐
    │               │               │
┌───┴────┐   ┌──────┴──────┐  ┌────┴────────┐
│Rapida  │   │ Economica   │  │ Balanceada  │
└────────┘   └─────────────┘  └─────────────┘

┌─────────────────────────┐
│ ContextoDeDistribucion  │
├─────────────────────────┤
│ -estrategiaActual       │
│ +establecerEstrategia() │
│ +seleccionarAutomatica()│
│ +compararEstrategias()  │
└─────────────────────────┘
```

### Command Pattern

```
┌──────────────┐
│   Command    │
├──────────────┤
│ +ejecutar()  │
│ +deshacer()  │
└──────────────┘
       △
       │
┌──────┴──────┬─────────────┬──────────────┐
│ Agregar     │  Retirar    │  Actualizar  │
│ Producto    │  Producto   │  Producto    │
└─────────────┴─────────────┴──────────────┘

┌────────────────────────┐
│ InvocadorDeComandos    │
├────────────────────────┤
│ -historialEjecutados   │
│ -historialDeshechos    │
│ +ejecutarComando()     │
│ +deshacerUltimo()      │
│ +rehacerUltimo()       │
└────────────────────────┘
```

---

## ✅ Tests y Validación

### Probar Observer

1. Ir a la pestaña "Observer"
2. Hacer clic en "Verificar Todos los Stocks"
3. Ver notificaciones generadas
4. Simular consumo de granos para generar más notificaciones

### Probar Strategy

1. Ir a la pestaña "Strategy"
2. Configurar un pedido (distancia, peso, prioridad)
3. Hacer clic en "Selección Automática"
4. Hacer clic en "Comparar Estrategias" para ver todas las opciones

### Probar Command

1. Ir a la pestaña "Command"
2. Seleccionar "Agregar Producto"
3. Llenar los datos y ejecutar
4. Hacer clic en "Deshacer" para revertir
5. Hacer clic en "Rehacer" para volver a aplicar

---

## 🎓 Conclusiones

Esta implementación demuestra:

✅ **Aplicación correcta de patrones de comportamiento**
✅ **Adherencia a principios SOLID**
✅ **Código limpio y mantenible**
✅ **Separación de responsabilidades**
✅ **Extensibilidad sin modificación**
✅ **Reutilización de código**
✅ **Testing amigable**

Los patrones implementados hacen que el sistema sea:
- **Flexible**: Fácil de extender con nuevas funcionalidades
- **Mantenible**: Cada clase tiene una responsabilidad clara
- **Testeable**: Componentes independientes fáciles de probar
- **Escalable**: Puede crecer sin afectar código existente

---

**Desarrollado con ❤️ para Café Gourmet**

