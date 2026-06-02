## Why

El datasource de MySQL tiene `timezone: '-05:00'` que causa doble conversión de timezone en las fechas. El ORM interpreta los valores DATETIME como UTC-5 y los convierte a UTC internamente, pero luego al serializar JSON vuelve a aplicar el offset, resultando en fechas desplazadas 5 horas. El frontend recibe horas incorrectas y el timer de procesos muestra 00:00:00.

## What Changes

- Eliminar `timezone: '-05:00'` del datasource MySQL
- Las fechas DATETIME se almacenan sin timezone en MySQL y el servidor está en Colombia (UTC-5) — no necesita conversión explícita
- El frontend recibe fechas en formato ISO UTC (`...Z`) y las convierte a local con `new Date()` — sin el timezone del connector, el valor UTC será correcto

## Capabilities

### New Capabilities
- `api-datetime-contract`: Las fechas en la API DEBEN enviarse en formato ISO 8601 UTC (`...Z`) sin transformación del ORM

### Modified Capabilities
- *(ninguna — no cambia comportamiento de specs existentes, solo corrige serialización)*

## Impact

- `src/datasources/mysql.datasource.ts`: eliminar `timezone: '-05:00'` de la config
- `npm run build`: recompilar
- `npm run migrate`: no requiere cambios de esquema (solo lectura/escritura de datos)
- Datos existentes: no se modifican, pero al leerlos sin timezone se interpretarán como UTC correctamente
