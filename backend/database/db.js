const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Crear conexión a la base de datos
const dbPath = path.join(__dirname, 'cafe_gourmet.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.message);
  } else {
    console.log('✅ Conectado a la base de datos SQLite');
  }
});

// Crear tabla de granos de café
const createCoffeeTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS coffee_grains (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      origin_country TEXT NOT NULL,
      stock_quantity REAL NOT NULL,
      price_per_kg REAL NOT NULL,
      entry_date TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.run(sql, (err) => {
    if (err) {
      console.error('Error creando tabla coffee_grains:', err.message);
    } else {
      console.log('✅ Tabla coffee_grains creada exitosamente');
    }
  });
};

// Insertar datos de ejemplo
const insertSampleData = () => {
  const sampleData = [
    {
      name: 'Café Arábica Colombiano',
      type: 'Arábica',
      origin_country: 'Colombia',
      stock_quantity: 50.5,
      price_per_kg: 12.50,
      entry_date: '2024-01-15',
      description: 'Café de altura con notas dulces y acidez media'
    },
    {
      name: 'Café Robusta Vietnamita',
      type: 'Robusta',
      origin_country: 'Vietnam',
      stock_quantity: 75.0,
      price_per_kg: 8.75,
      entry_date: '2024-01-10',
      description: 'Café robusto con cuerpo fuerte y alto contenido de cafeína'
    },
    {
      name: 'Café Arábica Etiopiano',
      type: 'Arábica',
      origin_country: 'Etiopía',
      stock_quantity: 30.0,
      price_per_kg: 15.00,
      entry_date: '2024-01-20',
      description: 'Café de origen con notas florales y frutales'
    }
  ];

  const sql = `
    INSERT INTO coffee_grains (name, type, origin_country, stock_quantity, price_per_kg, entry_date, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  sampleData.forEach((coffee) => {
    db.run(sql, [
      coffee.name,
      coffee.type,
      coffee.origin_country,
      coffee.stock_quantity,
      coffee.price_per_kg,
      coffee.entry_date,
      coffee.description
    ], (err) => {
      if (err) {
        console.error('Error insertando dato de ejemplo:', err.message);
      } else {
        console.log(`✅ Dato de ejemplo insertado: ${coffee.name}`);
      }
    });
  });
};

// Inicializar base de datos
const initDatabase = () => {
  createCoffeeTable();
  
  // Esperar un poco para que se cree la tabla antes de insertar datos
  setTimeout(() => {
    // Verificar si ya hay datos
    db.get("SELECT COUNT(*) as count FROM coffee_grains", (err, row) => {
      if (err) {
        console.error('Error verificando datos existentes:', err.message);
      } else if (row.count === 0) {
        console.log('📝 Insertando datos de ejemplo...');
        insertSampleData();
      } else {
        console.log('✅ Base de datos ya contiene datos');
      }
    });
  }, 1000);
};

// Función para cerrar la conexión
const closeDatabase = () => {
  db.close((err) => {
    if (err) {
      console.error('Error cerrando la base de datos:', err.message);
    } else {
      console.log('✅ Conexión a la base de datos cerrada');
    }
  });
};

module.exports = {
  db,
  initDatabase,
  closeDatabase
};
