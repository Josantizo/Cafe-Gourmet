-- Tabla para el proceso de producción de café
CREATE TABLE IF NOT EXISTS proceso_produccion (
  idProceso INT NOT NULL AUTO_INCREMENT,
  idGranos INT NOT NULL,
  cantidadGramos DOUBLE NOT NULL,
  tipoGrano VARCHAR(45) NOT NULL,
  region VARCHAR(45) NOT NULL,
  estadoActual ENUM('cosecha', 'tostado', 'molido', 'empaquetado', 'venta') NOT NULL DEFAULT 'cosecha',
  fechaInicio DATE NOT NULL,
  fechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  observaciones TEXT,
  PRIMARY KEY (idProceso),
  FOREIGN KEY (idGranos) REFERENCES granos(idGranos) ON DELETE CASCADE,
  INDEX idx_estado (estadoActual),
  INDEX idx_fecha_inicio (fechaInicio),
  INDEX idx_tipo_grano (tipoGrano),
  INDEX idx_region (region)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insertar datos de ejemplo para testing
INSERT INTO proceso_produccion (idGranos, cantidadGramos, tipoGrano, region, estadoActual, fechaInicio, observaciones) VALUES
(1, 1000, 'Arabico', 'Antigua', 'cosecha', '2024-01-15', 'Granos recién cosechados de la región de Antigua'),
(2, 1500, 'Bourbon', 'Acatenango', 'tostado', '2024-01-20', 'Granos en proceso de tostado'),
(3, 800, 'Catuai', 'Amatitlán', 'molido', '2024-02-01', 'Granos tostados siendo molidos'),
(4, 1200, 'Arabico', 'Antigua', 'empaquetado', '2024-02-10', 'Café molido siendo empaquetado'),
(5, 2000, 'Bourbon', 'Acatenango', 'venta', '2024-02-15', 'Producto listo para venta');
