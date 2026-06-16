-- Migration: Create parada table for stop code history
--
-- Each record represents a single stop event during a process execution.
-- A process can have multiple paradas, providing full traceability.
--
-- Run: mysql -u <user> -p <database> < src/migrations/004-create-parada-table.sql

CREATE TABLE parada (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cantidadReportada INT NOT NULL,
  fecha DATETIME NULL DEFAULT NULL,
  procesoXTarjetaId INT NOT NULL,
  codigoDeParadaId INT NOT NULL,
  CONSTRAINT fk_parada_proceso FOREIGN KEY (procesoXTarjetaId) REFERENCES proceso_x_tarjeta(id) ON DELETE CASCADE,
  CONSTRAINT fk_parada_codigo FOREIGN KEY (codigoDeParadaId) REFERENCES codigo_de_parada(id) ON DELETE CASCADE
);

CREATE INDEX idx_parada_proceso ON parada(procesoXTarjetaId);
CREATE INDEX idx_parada_codigo ON parada(codigoDeParadaId);
