-- Migration: Migrate existing codigoDeParadaId values from proceso_x_tarjeta to parada
--
-- For each proceso_x_tarjeta record that has a codigoDeParadaId set,
-- create a corresponding parada record so no historical data is lost.
--
-- Run: mysql -u <user> -p <database> < src/migrations/005-migrate-codigodeparada-data.sql

INSERT INTO parada (cantidadReportada, fecha, procesoXTarjetaId, codigoDeParadaId)
SELECT
  0,
  COALESCE(fechaFinal, fechaInicio, NOW()),
  id,
  codigoDeParadaId
FROM proceso_x_tarjeta
WHERE codigoDeParadaId IS NOT NULL;
