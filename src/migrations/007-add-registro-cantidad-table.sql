-- Migration: Create RegistroDeCantidad table and add operarioId to Parada
--
-- 1. Creates the RegistroDeCantidad table to track per-operator quantity reports
-- 2. Adds operarioId FK column to Parada (nullable for historical data)
--
-- Run: mysql -u <user> -p <database> < src/migrations/007-add-registro-cantidad-table.sql

CREATE TABLE registro_de_cantidad (
  id INT AUTO_INCREMENT PRIMARY KEY,
  procesoXTarjetaId INT NOT NULL,
  operarioId INT NOT NULL,
  cantidad INT NOT NULL,
  tipo VARCHAR(20) NOT NULL,
  codigoDeParadaId INT NULL,
  fecha DATETIME NOT NULL,
  FOREIGN KEY (procesoXTarjetaId) REFERENCES proceso_x_tarjeta(id),
  FOREIGN KEY (operarioId) REFERENCES operario(id),
  FOREIGN KEY (codigoDeParadaId) REFERENCES codigo_de_parada(id)
);

ALTER TABLE parada ADD COLUMN operarioId INT NULL;
ALTER TABLE parada ADD FOREIGN KEY (operarioId) REFERENCES operario(id);
