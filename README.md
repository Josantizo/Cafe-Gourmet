# Sistema de Gestión de Inventario de Granos de Café

Un sistema completo para la gestión y control del inventario de granos de café, desarrollado con React y Node.js.

## 🚀 Características

- **CRUD completo** para granos de café
- **Interfaz moderna** y responsive
- **API RESTful** con Node.js y Express
- **Base de datos** SQLite para desarrollo
- **Validación** de datos en frontend y backend
- **Gestión de stock** con alertas de inventario bajo

## 📋 Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd cafe-gourmet-inventory
   ```

2. **Instalar dependencias**
   ```bash
   npm run install-all
   ```

3. **Ejecutar el proyecto**
   ```bash
   npm run dev
   ```

## 📁 Estructura del Proyecto

```
cafe-gourmet-inventory/
├── frontend/          # Aplicación React
├── backend/           # API Node.js
├── package.json       # Configuración principal
└── README.md
```

## 🎯 Funcionalidades del CRUD

### Granos de Café
- ✅ **Crear** nuevo grano de café
- ✅ **Leer** lista de granos disponibles
- ✅ **Actualizar** información de granos
- ✅ **Eliminar** granos del inventario

### Campos del Grano
- Nombre del grano
- Tipo de café (Arábica, Robusta, etc.)
- País de origen
- Cantidad en stock (kg)
- Precio por kg
- Fecha de ingreso
- Descripción

## 🔧 Tecnologías Utilizadas

### Frontend
- React 18
- React Router
- Axios
- Tailwind CSS
- React Hook Form
- React Icons

### Backend
- Node.js
- Express.js
- SQLite3
- CORS
- Helmet
- Morgan

## 📱 Uso

1. El frontend se ejecuta en `http://localhost:3000`
2. El backend se ejecuta en `http://localhost:5000`
3. Accede a la aplicación y comienza a gestionar tu inventario

## 🔮 Próximas Funcionalidades

- [ ] Sistema de usuarios y autenticación
- [ ] Reportes y estadísticas
- [ ] Alertas de stock bajo
- [ ] Historial de movimientos
- [ ] Exportación de datos
- [ ] Dashboard con gráficos

## 📄 Licencia

MIT License
