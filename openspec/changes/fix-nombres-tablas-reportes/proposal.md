## Why

Los 4 endpoints de reportes (`reportes.controller.ts`) fallan con error 500 porque las consultas SQL nativas usan nombres de tablas en snake_case (ej. `registro_de_cantidad`), pero las tablas reales en MySQL fueron creadas por LoopBack con los nombres de clase del modelo (ej. `RegistroDeCantidad`, almacenado como `registrodecanidad` en Windows). Ningún reporte funciona hasta corregir los nombres.

## What Changes

- Corregir los nombres de tabla en las 4 queries SQL del `ReportesController`
- `registro_de_cantidad` → `registrodecanidad`
- `proceso_x_tarjeta` → `procesoxtarjeta`
- `codigo_de_parada` → `codigodeparada`
- `tarjeta_de_produccion` → `tarjetadeproduccion`
- Las tablas de una sola palabra (`operario`, `proceso`, `parada`) ya funcionan y no se tocan

## Capabilities

### New Capabilities

*(ninguna — solo corrección de bug)*

### Modified Capabilities

- `reportes-produccion`: Se corrige el nombre de tablas en las consultas SQL del controlador

## Impact

- Solo se modifica `src/controllers/reportes.controller.ts`
- No se crean ni modifican modelos, migraciones, o endpoints
- Los 4 endpoints mantienen su ruta y estructura de respuesta
