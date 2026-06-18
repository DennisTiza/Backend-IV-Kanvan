-- Migration: Insertar menús de reportes para gerentes
--
-- 1. Crea 4 entradas en la tabla menu para los reportes gerenciales
-- 2. Asigna permisos de solo lectura (Listar=1) para el rol gerente (id=3)
--
-- Run: mysql -u <user> -p <database> < src/migrations/008-insert-menus-reportes.sql

INSERT INTO menu (Nombre, Comentario) VALUES
('Reporte - Producción Diaria',        'Total producido por día'),
('Reporte - Producción por Operario',  'Producción de cada operario por proceso'),
('Reporte - Tiempos',                  'Tiempo estándar vs tiempo real'),
('Reporte - Paradas',                  'Paradas de producción');

-- Asignar permisos al gerente (rolId = 3) para cada reporte
-- Los menuId asumidos son los IDs generados secuencialmente.
-- Si la tabla ya tenía datos, ajustar menuId según los IDs reales.
INSERT INTO menu_del_rol (Listar, Guardar, Editar, Eliminar, Descargar, menuId, rolId)
SELECT 1, 0, 0, 0, 0, id, 3 FROM menu WHERE Nombre LIKE 'Reporte -%';
