const { initDatabase, closeDatabase } = require('./db');

console.log('🚀 Inicializando base de datos...');

// Inicializar la base de datos
initDatabase();

// Cerrar la conexión después de un tiempo
setTimeout(() => {
  closeDatabase();
  console.log('✅ Inicialización completada');
  process.exit(0);
}, 3000);
