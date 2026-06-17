-- Migration: Drop codigoDeParadaId column from proceso_x_tarjeta
--
-- This column is replaced by the parada table which supports multiple
-- stop codes per process (1:N). Make sure to run migration 005 first
-- to migrate existing data.
--
-- Run: mysql -u <user> -p <database> < src/migrations/006-drop-codigodeparada-column.sql

SET @constraint_name = (
  SELECT CONSTRAINT_NAME
  FROM information_schema.KEY_COLUMN_USAGE
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'proceso_x_tarjeta'
    AND COLUMN_NAME = 'codigoDeParadaId'
    AND REFERENCED_TABLE_NAME IS NOT NULL
  LIMIT 1
);

SET @drop_fk = IF(@constraint_name IS NOT NULL,
  CONCAT('ALTER TABLE proceso_x_tarjeta DROP FOREIGN KEY ', @constraint_name),
  'SELECT 1'
);
PREPARE stmt FROM @drop_fk;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

ALTER TABLE proceso_x_tarjeta DROP COLUMN codigoDeParadaId;
