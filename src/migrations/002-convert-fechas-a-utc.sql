-- Migration: Convert existing Colombia-time DATETIME values to UTC
-- 
-- Previously, dates were stored in Colombia time (UTC-5) via
-- toLocaleString('sv-SE'). Now they are stored in UTC.
-- This migrates existing records by adding 5 hours.
--
-- Run: mysql -u <user> -p <database> < src/migrations/002-convert-fechas-a-utc.sql

UPDATE procesoxtarjeta
SET fechaInicio = DATE_ADD(fechaInicio, INTERVAL 5 HOUR),
    fechaFinal = DATE_ADD(fechaFinal, INTERVAL 5 HOUR)
WHERE fechaInicio IS NOT NULL OR fechaFinal IS NOT NULL;
