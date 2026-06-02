## Why

La columna `fechaInicio` en `proceso_x_tarjeta` se auto-puebla con `DEFAULT CURRENT_TIMESTAMP` al crear el registro, en lugar de quedar NULL. Esto causa que el endpoint `POST /proceso-x-tarjeta/{id}/iniciar` rechace la petición con 409 ("El proceso ya fue iniciado") porque ya existe un valor. El frontend entonces muestra el timer en 00:00:00 usando la fecha de creación como si fuera la de inicio real.

## What Changes

- Hacer que `fechaInicio` sea nullable en la base de datos y opcional en el modelo (TypeScript)
- Al crear `proceso_x_tarjeta`, no asignar `fechaInicio` (debe quedar NULL)
- El endpoint `POST /iniciar` ya asigna `fechaInicio = NOW()` correctamente — solo necesita que el campo empiece como NULL
- Actualizar el spec `proceso-xtarjeta-transiciones` para documentar que `fechaInicio` se asigna exclusivamente en iniciar, no en creación

## Capabilities

### New Capabilities
- `proceso-xtarjeta-fechainicio-nullable`: `fechaInicio` debe ser NULL hasta que el operario inicie el proceso explícitamente

### Modified Capabilities
- `proceso-xtarjeta-transiciones`: Se agrega la regla de que `fechaInicio` solo se asigna en el endpoint `iniciar`, no en la creación del registro

## Impact

- `openspec/specs/proceso-xtarjeta-transiciones/spec.md`: agregar regla sobre asignación exclusiva de `fechaInicio` en iniciar
- `src/models/proceso-x-tarjeta.model.ts`: hacer `fechaInicio?: string` (opcional/nullable)
- `src/controllers/tarjeta-de-produccion.controller.ts`: no enviar `fechaInicio` al crear (ya está así, pero asegurar)
- Base de datos: quitar `DEFAULT CURRENT_TIMESTAMP` de la columna `fechaInicio`
