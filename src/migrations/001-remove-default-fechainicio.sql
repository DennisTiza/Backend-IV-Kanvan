-- Migration: Remove DEFAULT CURRENT_TIMESTAMP from proceso_x_tarjeta.fechaInicio
-- 
-- This column should NOT have a default value. fechaInicio must remain NULL
-- until the operator explicitly calls POST /proceso-x-tarjeta/{id}/iniciar.
--
-- Run: mysql -u <user> -p <database> < src/migrations/001-remove-default-fechainicio.sql

ALTER TABLE proceso_x_tarjeta
MODIFY COLUMN fechaInicio DATETIME NULL DEFAULT NULL;
