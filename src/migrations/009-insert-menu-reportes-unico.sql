-- Migration: Insertar menú único "Reportes" para gerentes
--
-- Reemplaza a 008-insert-menus-reportes.sql (4 menús separados).
-- Ahora es 1 menú "Reportes" que agrupa los 4 reportes en tabs.
--
-- Run: mysql -u <user> -p <database> < src/migrations/009-insert-menu-reportes-unico.sql

INSERT INTO menu (Nombre, Comentario) VALUES
('Reportes', 'Reportes gerenciales de producción');

INSERT INTO menu_del_rol (Listar, Guardar, Editar, Eliminar, Descargar, menuId, rolId)
SELECT 1, 0, 0, 0, 0, id, 3 FROM menu WHERE Nombre = 'Reportes';
