# Sistema de Proceso de Producción de Café

Este sistema implementa un patrón Facade para gestionar el proceso completo de producción de café, desde la cosecha hasta la venta, con un sistema de informes integrado.

## Arquitectura

### Clases Principales

1. **ProcesoProduccion**: Maneja la lógica de negocio del proceso de producción
2. **FacadeDeProduccion**: Facade que simplifica la interacción con el sistema
3. **ProcesoProduccionController**: Controlador para las rutas HTTP
4. **Rutas**: Endpoints REST para la API

### Estados del Proceso

- **cosecha**: Granos recién cosechados
- **tostado**: Granos en proceso de tostado
- **molido**: Granos tostados siendo molidos
- **empaquetado**: Café molido siendo empaquetado
- **venta**: Producto listo para venta

## Instalación y Configuración

### 1. Crear la tabla en la base de datos

```sql
-- Ejecutar el archivo backend/database/proceso_produccion.sql
source backend/database/proceso_produccion.sql;
```

### 2. Instalar dependencias

```bash
cd backend
npm install
```

### 3. Configurar variables de entorno

Crear archivo `.env` en la carpeta backend:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=123456789
DB_NAME=cafeteria
DB_PORT=3306
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

## Uso de la API

### Endpoints Principales

#### 1. Iniciar Proceso Completo

```http
POST /api/proceso-produccion/iniciar
Content-Type: application/json

{
  "tipoGrano": "Arabico",
  "region": "Antigua",
  "cantidadGramos": 1000,
  "precio": 25.50,
  "fechaVencimiento": "2024-12-31"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Proceso de producción iniciado exitosamente",
  "data": {
    "grano": {
      "idGranos": 1,
      "columnasInsertadas": 6
    },
    "proceso": {
      "idProceso": 1,
      "estadoActual": "cosecha",
      "mensaje": "Proceso de producción iniciado en estado: cosecha"
    }
  }
}
```

#### 2. Avanzar Proceso

```http
PUT /api/proceso-produccion/1/avanzar
Content-Type: application/json

{
  "observaciones": "Tostado completado exitosamente"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Proceso avanzado exitosamente",
  "data": {
    "idProceso": 1,
    "estadoAnterior": "cosecha",
    "estadoNuevo": "tostado",
    "procesoCompletado": false
  }
}
```

#### 3. Obtener Estado del Proceso

```http
GET /api/proceso-produccion/1/estado
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "idProceso": 1,
    "estadoActual": "tostado",
    "tipoGrano": "Arabico",
    "region": "Antigua",
    "cantidadGramos": 1000,
    "fechaInicio": "2024-01-15",
    "diasEnProceso": 5
  }
}
```

#### 4. Obtener Todos los Procesos

```http
GET /api/proceso-produccion?estado=tostado&tipoGrano=Arabico
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "total": 2,
    "procesos": [
      {
        "idProceso": 1,
        "tipoGrano": "Arabico",
        "region": "Antigua",
        "cantidadGramos": 1000,
        "estadoActual": "tostado",
        "fechaInicio": "2024-01-15"
      }
    ]
  }
}
```

### Endpoints de Informes

#### 1. Informe Mensual

```http
GET /api/proceso-produccion/informes/mensual/2024/1
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "informe": {
      "resumen": {
        "año": 2024,
        "mes": 1,
        "nombreMes": "Enero",
        "totalProcesos": 5,
        "estados": {
          "cosecha": {
            "cantidad": 2,
            "gramos": 2000,
            "valor": 51.00
          },
          "tostado": {
            "cantidad": 1,
            "gramos": 1000,
            "valor": 25.50
          }
        },
        "totalGramos": 5000,
        "valorEstimado": 127.50
      },
      "procesos": [...]
    }
  }
}
```

#### 2. Estadísticas Anuales

```http
GET /api/proceso-produccion/informes/estadisticas/2024
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "año": 2024,
    "estadisticas": {
      "2024": {
        "1": {
          "mes": 1,
          "nombreMes": "Enero",
          "estados": {
            "cosecha": {
              "cantidad": 2,
              "totalGramos": 2000,
              "promedioGramos": 1000
            }
          }
        }
      }
    }
  }
}
```

#### 3. Resumen Ejecutivo

```http
GET /api/proceso-produccion/informes/resumen-ejecutivo?año=2024
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "resumen": {
      "año": 2024,
      "totalProcesos": 10,
      "procesosCompletados": 3,
      "procesosEnProceso": 7,
      "tasaCompletacion": "30.00%",
      "totalGramos": 10000,
      "gramosVendidos": 3000,
      "distribucionEstados": {
        "cosecha": 3,
        "tostado": 2,
        "molido": 1,
        "empaquetado": 1,
        "venta": 3
      }
    }
  }
}
```

### Endpoints de Utilidad

#### 1. Estados Disponibles

```http
GET /api/proceso-produccion/estados
```

#### 2. Procesos Próximos a Vencer

```http
GET /api/proceso-produccion/proximos-vencer?dias=30
```

#### 3. Métricas del Dashboard

```http
GET /api/proceso-produccion/dashboard/metricas?año=2024
```

## Uso Programático

### Ejemplo de Uso del Facade

```javascript
const FacadeDeProduccion = require('./ProcesoProduccion/FacadeDeProduccion');

const facade = new FacadeDeProduccion();

// Iniciar proceso completo
async function iniciarProceso() {
  try {
    const resultado = await facade.iniciarProcesoCompleto({
      tipoGrano: 'Arabico',
      region: 'Antigua',
      cantidadGramos: 1000,
      precio: 25.50,
      fechaVencimiento: '2024-12-31'
    });
    
    console.log('Proceso iniciado:', resultado);
    return resultado.proceso.idProceso;
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Avanzar proceso
async function avanzarProceso(idProceso) {
  try {
    const resultado = await facade.avanzarProceso(idProceso, 'Tostado completado');
    console.log('Proceso avanzado:', resultado);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Generar informe mensual
async function generarInforme() {
  try {
    const informe = await facade.generarInformeMensual(2024, 1);
    console.log('Informe generado:', informe);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## Validaciones

### Datos Requeridos para Iniciar Proceso

- `tipoGrano`: Tipo de grano (Arabico, Bourbon, Catuai)
- `region`: Región de origen (Antigua, Acatenango, Amatitlán)
- `cantidadGramos`: Cantidad en gramos (debe ser > 0)
- `precio`: Precio por gramo (debe ser > 0)
- `fechaVencimiento`: Fecha de vencimiento del producto

### Transiciones de Estado Válidas

- cosecha → tostado
- tostado → molido
- molido → empaquetado
- empaquetado → venta

## Manejo de Errores

El sistema incluye manejo de errores robusto:

- Validación de datos de entrada
- Verificación de transiciones de estado válidas
- Manejo de errores de base de datos
- Respuestas HTTP apropiadas

## Características del Sistema

1. **Patrón Facade**: Simplifica la interacción con el sistema complejo
2. **Estados de Producción**: Gestión completa del ciclo de vida del café
3. **Sistema de Informes**: Reportes detallados por mes y año
4. **Validaciones**: Verificación de datos y transiciones
5. **API REST**: Endpoints bien documentados
6. **Integración con Inventario**: Conexión con el sistema de granos existente

## Próximos Pasos

1. Ejecutar el script SQL para crear la tabla
2. Probar los endpoints con Postman o similar
3. Integrar con el frontend existente
4. Agregar más validaciones según necesidades específicas
5. Implementar notificaciones para procesos próximos a vencer
