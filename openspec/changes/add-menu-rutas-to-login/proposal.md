## Why

El endpoint `POST /identificar-usuario` devuelve el rol del usuario y los permisos booleanos del menú, pero no incluye las rutas de navegación. El frontend necesita saber a qué pantalla redirigir tras el login, y actualmente debe mapear manualmente el rolId a una ruta, lo que es frágil y no escalable.

## What Changes

- Agregar columna `ruta` (string) al modelo `Menu`
- Agregar columna `icono` (string, opcional) al modelo `Menu` para uso futuro del frontend
- Actualizar `POST /identificar-usuario` para devolver los menús con sus rutas en la respuesta
- El frontend podrá usar la primera ruta del menú del usuario como destino de redirección post-login

## Capabilities

### New Capabilities
- `menu-rutas`: agregar campo de ruta e icono al modelo Menu, permitiendo que menús apunten a URLs específicas del frontend

### Modified Capabilities

<!-- No existing specs to modify -->

## Impact

- **Modelo**: `Menu` gana dos columnas (`ruta`, `icono`)
- **Base de datos**: migración para new columns en tabla `menu`
- **Controlador**: `usuario.controller.ts` - endpoint `identificar-usuario` actualizado para incluir rutas en respuesta
- **Frontend**: recibe `menu` con `ruta` para decidir redirección post-login
