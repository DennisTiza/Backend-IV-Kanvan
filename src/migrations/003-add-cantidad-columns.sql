-- Migration: Add cantidad, cantidadRealizada, cantidadRegistrada to proceso_x_tarjeta
--
-- These columns track production progress per process step:
--   cantidad: total target quantity (inherited from the production card)
--   cantidadRealizada: last reported delta (how much the operator reported in the most recent stop)
--   cantidadRegistrada: historical accumulated total of all reported quantities (never decreases)
--
-- Run: mysql -u <user> -p <database> < src/migrations/003-add-cantidad-columns.sql

ALTER TABLE proceso_x_tarjeta
  ADD COLUMN cantidad INT NOT NULL DEFAULT 0 AFTER orden,
  ADD COLUMN cantidadRealizada INT NULL DEFAULT 0 AFTER cantidad,
  ADD COLUMN cantidadRegistrada INT NULL DEFAULT 0 AFTER cantidadRealizada;
