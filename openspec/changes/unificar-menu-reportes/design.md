## Context

En el cambio `reportes-gerentes` se implementaron 4 endpoints de reportes y se planearon 4 entradas de menú individuales. El usuario prefiere un único punto de entrada "Reportes" con pestañas internas.

Los endpoints ya existen y no se modifican. El cambio es únicamente en la migración SQL y la presentación en frontend.

## Goals / Non-Goals

**Goals:**
- Reemplazar 4 menús individuales por 1 menú "Reportes"
- Reemplazar 4 permisos en `menu_del_rol` por 1 permiso
- Los 4 reportes se navegan mediante tabs/pestañas desde el frontend

**Non-Goals:**
- No se modifican los endpoints del backend
- No se modifican los modelos ni repositorios
- No se implementan los tabs en frontend (responsabilidad del frontend)

## Decisions

### 1. Migración independiente
Se crea `009-insert-menu-reportes-unico.sql` con los inserts corregidos. La migración anterior (`008-`) queda obsoleta (no se ejecuta o se revierte).

### 2. Un solo permiso de menú
Se inserta 1 fila en `menu` y 1 fila en `menu_del_rol`. El frontend, al detectar `Listar=1` en el menú "Reportes", muestra las pestañas con los 4 reportes.

### 3. El frontend maneja los tabs
Los 4 endpoints siguen siendo independientes. El frontend los consume según la pestaña activa. No hay un endpoint "combinado".

## Risks / Trade-offs

- [Menú único limita granularidad] → No se puede ocultar un reporte específico. Si se necesita en el futuro, se pueden crear submenús o la tabla `menu` se puede extender con jerarquía
- [Dependencia del frontend] → Los tabs son responsabilidad del frontend. El backend solo provee el punto de entrada único
