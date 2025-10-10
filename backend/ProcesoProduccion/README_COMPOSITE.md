# Patrón Composite para Operaciones de Producción

Este documento describe la implementación del patrón Composite para modelar operaciones de producción compuestas en el sistema de café gourmet.

## Arquitectura del Patrón Composite

### Estructura de Clases

```
OperacionProduccion (Interfaz Base)
├── OperacionSimple (Hoja)
│   ├── Tostado
│   ├── Molido
│   └── Envasado
└── OperacionCompuesta (Nodo)
    ├── LoteCompleto
    └── ProcesoEspecial
```

### Componentes Principales

#### 1. OperacionProduccion (Interfaz Base)
- Define la interfaz común para todas las operaciones
- Métodos: `ejecutar()`, `obtenerTiempoEstimado()`, `obtenerCostoEstimado()`, `validar()`

#### 2. OperacionSimple (Hoja)
- Representa operaciones individuales que no pueden dividirse
- Implementa la lógica específica de cada operación
- Ejemplos: Tostado, Molido, Envasado

#### 3. OperacionCompuesta (Nodo)
- Contiene múltiples operaciones (simples y compuestas)
- Ejecuta operaciones de forma secuencial
- Ejemplos: LoteCompleto, ProcesoEspecial

#### 4. GestorOperacionesComposite
- Gestiona la creación, programación y ejecución de operaciones
- Mantiene historial y estadísticas
- Integra con el sistema existente

## Operaciones Disponibles

### Operaciones Simples

#### Tostado
- **Descripción**: Proceso de tostado de granos de café
- **Tiempo**: 30 minutos
- **Costo**: 15.00 quetzales
- **Parámetros**: Tipo de grano, temperatura, nivel de tostado
- **Resultado**: Granos tostados con pérdida de peso calculada

#### Molido
- **Descripción**: Proceso de molido de granos tostados
- **Tiempo**: 15 minutos
- **Costo**: 8.00 quetzales
- **Parámetros**: Tipo de preparación, grosor de molido
- **Resultado**: Café molido con grosor específico

#### Envasado
- **Descripción**: Proceso de envasado de café molido
- **Tiempo**: 20 minutos
- **Costo**: 12.00 quetzales
- **Parámetros**: Tipo de empaque, cantidad de paquetes
- **Resultado**: Paquetes listos para venta

### Operaciones Compuestas

#### LoteCompleto
- **Descripción**: Proceso completo: Tostado → Molido → Envasado
- **Tiempo**: 65 minutos + 10 minutos de transición
- **Costo**: 35.00 quetzales + 5.00 quetzales de materiales
- **Operaciones**: Tostado, Molido, Envasado
- **Uso**: Producción estándar de lotes de café

#### ProcesoEspecial
- **Descripción**: Proceso especializado con configuraciones personalizadas
- **Tipos disponibles**:
  - **Premium**: Control de calidad estricto, +15 min, +20.00 Q
  - **Express**: Producción rápida, -10 min, -5.00 Q
  - **Artesanal**: Técnicas tradicionales, +30 min, +25.00 Q
  - **Experimental**: Técnicas innovadoras, +20 min, +15.00 Q

## Uso del Sistema

### 1. Crear Operación

```javascript
const facade = new FacadeDeProduccion();

// Crear operación simple
const operacionTostado = facade.gestorOperacionesComposite.crearOperacion('tostado');

// Crear operación compuesta
const loteCompleto = facade.gestorOperacionesComposite.crearOperacion('lote_completo');

// Crear proceso especial
const procesoPremium = facade.gestorOperacionesComposite.crearOperacion('proceso_especial', {
  tipoProceso: 'premium'
});
```

### 2. Programar y Ejecutar

```javascript
// Contexto de producción
const contexto = {
  cantidadGramos: 1000,
  tipoGrano: 'Arabico',
  region: 'Antigua',
  tipoPreparacion: 'filtro',
  fechaVencimiento: '2024-12-31'
};

// Programar operación
const idOperacion = facade.gestorOperacionesComposite.programarOperacion(operacion, contexto);

// Ejecutar operación
const resultado = await facade.gestorOperacionesComposite.ejecutarOperacion(idOperacion, contexto);
```

### 3. Gestión de Operaciones

```javascript
// Obtener estado de operación
const estado = facade.gestorOperacionesComposite.obtenerEstadoOperacion(idOperacion);

// Obtener operaciones programadas
const operaciones = facade.gestorOperacionesComposite.obtenerOperacionesProgramadas();

// Cancelar operación
const cancelada = facade.gestorOperacionesComposite.cancelarOperacion(idOperacion);

// Obtener historial
const historial = facade.gestorOperacionesComposite.obtenerHistorial({
  tipoOperacion: 'lote_completo',
  fechaInicio: '2024-01-01'
});

// Obtener estadísticas
const estadisticas = facade.gestorOperacionesComposite.obtenerEstadisticas();
```

## Integración con Facade Existente

El patrón Composite se integra perfectamente con el `FacadeDeProduccion` existente:

### Métodos Agregados al Facade

```javascript
// Crear operación composite
const resultado = facade.crearOperacionComposite('lote_completo');

// Programar operación
const idOperacion = facade.programarOperacionComposite(operacion, contexto);

// Ejecutar operación
const resultado = await facade.ejecutarOperacionComposite(idOperacion, contexto);

// Obtener estado
const estado = facade.obtenerEstadoOperacionComposite(idOperacion);

// Obtener operaciones programadas
const operaciones = facade.obtenerOperacionesProgramadas();

// Cancelar operación
const cancelada = facade.cancelarOperacionComposite(idOperacion);

// Obtener historial
const historial = facade.obtenerHistorialOperaciones(filtros);

// Obtener estadísticas
const estadisticas = facade.obtenerEstadisticasOperaciones();

// Obtener tipos disponibles
const tipos = facade.obtenerTiposOperacionesDisponibles();

// Obtener información de tipo
const info = facade.obtenerInformacionTipoOperacion('lote_completo');
```

## Ejemplos de Uso

### Ejemplo 1: Operación Simple

```javascript
const EjemplosComposite = require('./ejemplos/EjemplosComposite');
const ejemplos = new EjemplosComposite();

// Ejecutar ejemplo de tostado
await ejemplos.ejecutarEjemplo('simple');
```

### Ejemplo 2: Lote Completo

```javascript
// Ejecutar ejemplo de lote completo
await ejemplos.ejecutarEjemplo('lote');
```

### Ejemplo 3: Proceso Especial

```javascript
// Ejecutar ejemplo de proceso premium
await ejemplos.ejecutarEjemplo('premium');

// Ejecutar ejemplo de proceso express
await ejemplos.ejecutarEjemplo('express');

// Ejecutar ejemplo de proceso artesanal
await ejemplos.ejecutarEjemplo('artesanal');
```

### Ejemplo 4: Múltiples Operaciones

```javascript
// Ejecutar múltiples operaciones simultáneas
await ejemplos.ejecutarEjemplo('multiples');
```

### Ejemplo 5: Gestión Completa

```javascript
// Ejecutar ejemplo de gestión de operaciones
await ejemplos.ejecutarEjemplo('gestion');
```

### Ejemplo 6: Integración con Facade

```javascript
// Ejecutar ejemplo de integración
await ejemplos.ejecutarEjemplo('integracion');
```

### Ejecutar Todos los Ejemplos

```javascript
// Ejecutar todos los ejemplos
await ejemplos.ejecutarTodosLosEjemplos();
```

## Validaciones y Manejo de Errores

### Validaciones por Operación

#### Tostado
- Cantidad mínima: 100g
- Cantidad máxima: 5000g
- Tipos válidos: Arabico, Bourbon, Catuai

#### Molido
- Cantidad mínima: 50g
- Cantidad máxima: 2000g
- Tipos de preparación válidos: espresso, filtro, francesa, chemex, v60

#### Envasado
- Cantidad mínima: 100g
- Cantidad máxima: 10000g
- Requiere estado anterior: molido

#### Lote Completo
- Cantidad mínima: 200g
- Cantidad máxima: 3000g
- Requiere estado inicial: cosecha

#### Proceso Especial
- **Premium/Artesanal**: Cantidad mínima 300g, máxima 2000g
- **Express/Experimental**: Cantidad mínima 100g, máxima 5000g

### Manejo de Errores

- **Validación fallida**: Se detiene la ejecución
- **Error crítico**: Se detiene la ejecución
- **Error no crítico**: Se registra y continúa (según configuración)
- **Operación fallida**: Se registra en historial con detalles del error

## Estados de Operaciones

### Estados Posibles
- **pendiente**: Operación creada pero no iniciada
- **en_progreso**: Operación en ejecución
- **completada**: Operación finalizada exitosamente
- **fallida**: Operación terminó con error
- **cancelada**: Operación cancelada antes de completarse

### Transiciones de Estado
- pendiente → en_progreso (al iniciar ejecución)
- en_progreso → completada (al finalizar exitosamente)
- en_progreso → fallida (al ocurrir error)
- pendiente → cancelada (al cancelar)
- en_progreso → cancelada (al cancelar durante ejecución)

## Métricas y Estadísticas

### Métricas Disponibles
- **Tiempo total**: Tiempo estimado vs tiempo real
- **Costo total**: Costo estimado vs costo real
- **Tasa de éxito**: Porcentaje de operaciones exitosas
- **Distribución por tipo**: Cantidad de operaciones por tipo
- **Tiempo promedio**: Tiempo promedio por tipo de operación
- **Costo promedio**: Costo promedio por tipo de operación

### Estadísticas por Tipo
- Total de operaciones
- Operaciones exitosas
- Operaciones fallidas
- Operaciones canceladas
- Tasa de éxito

## Ventajas del Patrón Composite

### 1. Flexibilidad
- Permite crear operaciones complejas combinando operaciones simples
- Fácil agregar nuevos tipos de operaciones
- Configuración personalizable para procesos especiales

### 2. Reutilización
- Operaciones simples pueden reutilizarse en diferentes contextos
- Operaciones compuestas pueden combinarse para crear procesos más complejos
- Lógica común centralizada en la interfaz base

### 3. Escalabilidad
- Fácil agregar nuevos tipos de operaciones
- Estructura jerárquica clara y mantenible
- Separación de responsabilidades

### 4. Consistencia
- Interfaz uniforme para todas las operaciones
- Comportamiento predecible
- Validaciones consistentes

### 5. Integración
- Se integra perfectamente con el sistema existente
- No interfiere con la funcionalidad actual
- Extiende las capacidades del sistema

## Casos de Uso Típicos

### 1. Producción Estándar
- Lote completo para producción regular
- Proceso express para pedidos urgentes

### 2. Producción Especializada
- Proceso premium para productos de alta calidad
- Proceso artesanal para productos tradicionales
- Proceso experimental para nuevos productos

### 3. Gestión de Operaciones
- Programación de múltiples operaciones
- Monitoreo de progreso
- Gestión de recursos

### 4. Análisis y Reportes
- Historial de operaciones
- Estadísticas de producción
- Análisis de rendimiento

## Próximos Pasos

1. **Integración con Frontend**: Crear componentes React para gestión de operaciones
2. **API REST**: Exponer endpoints para operaciones composite
3. **Persistencia**: Guardar operaciones en base de datos
4. **Notificaciones**: Sistema de alertas para operaciones
5. **Dashboard**: Interfaz para monitoreo en tiempo real
6. **Optimización**: Algoritmos para optimización de procesos
7. **Machine Learning**: Predicción de tiempos y costos
8. **Integración IoT**: Conexión con equipos de producción

## Conclusión

El patrón Composite proporciona una base sólida y flexible para modelar operaciones de producción compuestas. Su implementación permite:

- **Modelar procesos complejos** de manera intuitiva
- **Reutilizar operaciones** en diferentes contextos
- **Escalar el sistema** fácilmente
- **Mantener consistencia** en el comportamiento
- **Integrar** con el sistema existente sin problemas

Esta implementación establece las bases para un sistema de producción más robusto, flexible y escalable.
