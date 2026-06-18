## Why

En el cambio anterior (`reportes-gerentes`) se crearon 4 menús separados en la tabla `menu`, uno por cada reporte. Esto satura la navegación con entradas individuales. Es más limpio tener un solo menú "Reportes" que agrupe los 4 reportes, con tabs/pestañas para cambiar entre ellos desde el frontend.

## What Changes

- **Reemplazar** los 4 menús individuales por **1 solo menú "Reportes"** en la tabla `menu`
- **Reemplazar** los 4 permisos en `menu_del_rol` por **1 solo permiso** con `Listar=1` para el rol gerente (id=3)
- Se elimina (`src/migrations/008-insert-menus-reportes.sql`) y se reemplaza por una nueva migración (`src/migrations/009-insert-menu-reportes-unico.sql`) con los inserts corregidos
- No se modifican los endpoints del controller (`reportes.controller.ts`) — los 4 endpoints siguen igual
- El frontend debe mostrar los 4 reportes como pestañas dentro de un mismo menú "Reportes"

## Capabilities

### New Capabilities

- `unificar-menu-reportes`: Un solo punto de entrada en el menú para acceder a los 4 reportes gerenciales mediante pestañas

### Modified Capabilities

- `reportes-produccion`: Se modifica el requisito de menú: de 4 entradas separadas a 1 entrada agrupada

## Impact

- `src/migrations/`: se elimina `008-insert-menus-reportes.sql` (o se deja obsoleto) y se crea `009-insert-menu-reportes-unico.sql`
- No se tocan controllers, modelos ni endpoints existentes
- El frontend necesita implementar un sistema de tabs/pestañas bajo el menú "Reportes"
