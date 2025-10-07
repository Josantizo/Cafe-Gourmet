# ☕ Dashboard Café Gourmet

## Descripción
Dashboard completo para la gestión de inventario y creación de combos de café, implementado con React y Node.js.

## Características

### 🎯 Dashboard Principal
- **Navbar moderno** con navegación por pestañas
- **Diseño responsive** que se adapta a diferentes dispositivos
- **Interfaz intuitiva** con gradientes y animaciones suaves

### 📦 Gestión de Inventario (CRUD)
- **Crear** nuevos granos de café
- **Leer** lista completa de inventario
- **Actualizar** información de granos existentes
- **Eliminar** granos del inventario
- **Validación** de formularios en tiempo real

### ☕ Creador de Combos
- **3 tipos de combos** disponibles:
  - **Tradicional**: Café Arábica + Taza Pequeña + Filtro de Papel
  - **Plus**: Café Bourbon + Taza Mediana + Filtro de Tela
  - **Premium**: Café Catuai + Taza Grande + Filtro de Metal
- **Integración con backend** usando el patrón Factory
- **Interfaz visual** atractiva para selección de combos
- **Consejos de preparación** incluidos

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx          # Componente principal del dashboard
│   │   ├── Dashboard.css          # Estilos del dashboard
│   │   ├── ComboCreator.jsx       # Creador de combos
│   │   ├── ComboCreator.css       # Estilos del creador
│   │   └── InventarioCRUD.jsx     # CRUD de inventario (existente)
│   ├── services/
│   │   └── inventoryService.js    # Servicios de API
│   └── App.js                     # Aplicación principal

backend/
├── Fabricas/
│   ├── CombosServer.js            # Servidor de combos
│   ├── FabricaDeCombos.js         # Factory pattern para combos
│   ├── CoffeeFactory.js           # Factory para café
│   ├── Coffee.js                  # Clase Coffee
│   ├── Taza.js                    # Clase Taza
│   └── Filtro.js                  # Clase Filtro
└── ...
```

## Instalación y Ejecución

### 1. Backend (Puerto 5000)
```bash
cd backend
npm install
node server.js
```

### 2. Frontend (Puerto 3000)
```bash
cd frontend
npm install
npm start
```

### 3. Servidor de Combos (Puerto 5000)
```bash
cd backend/Fabricas
node CombosServer.js
```

## Uso del Dashboard

### Navegación
- **Inventario**: Gestiona el CRUD de granos de café
- **Crear Combos**: Selecciona y crea combos personalizados
- **Reportes**: Sección en desarrollo
- **Configuración**: Sección en desarrollo

### Crear un Combo
1. Haz clic en la pestaña "Crear Combos"
2. Selecciona el tipo de combo deseado
3. El sistema creará automáticamente el combo usando el patrón Factory
4. Visualiza los detalles del combo creado
5. Usa los botones de acción para guardar, imprimir o compartir

### Gestionar Inventario
1. Haz clic en la pestaña "Inventario"
2. Usa los botones "Crear" o "Actualizar" para cambiar el modo
3. Completa el formulario con los datos del grano
4. Para actualizar, selecciona un grano de la tabla primero
5. Usa el botón "Eliminar" para remover granos del inventario

## Tecnologías Utilizadas

### Frontend
- **React 18** - Framework principal
- **CSS3** - Estilos personalizados con gradientes y animaciones
- **Fetch API** - Comunicación con el backend

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **Factory Pattern** - Patrón de diseño para creación de objetos
- **MySQL** - Base de datos (para el CRUD)

## Patrones de Diseño Implementados

### Factory Pattern
- **FabricaDeCombos**: Clase abstracta para crear combos
- **ComboTradicional, ComboPlus, ComboPremium**: Implementaciones concretas
- **CoffeeFactory**: Factory para crear objetos Coffee

### Responsive Design
- **Mobile First**: Diseño optimizado para dispositivos móviles
- **Grid Layout**: Sistema de grillas flexible
- **Breakpoints**: Adaptación a diferentes tamaños de pantalla

## Características de UX/UI

- **Gradientes modernos** en colores azul y púrpura
- **Animaciones suaves** en hover y transiciones
- **Iconos emoji** para mejor experiencia visual
- **Feedback visual** para acciones del usuario
- **Estados de carga** con spinners animados
- **Mensajes de error** claros y útiles

## Próximas Mejoras

- [ ] Sección de Reportes con gráficos
- [ ] Configuración de usuario
- [ ] Historial de combos creados
- [ ] Exportación de datos
- [ ] Notificaciones push
- [ ] Modo oscuro
