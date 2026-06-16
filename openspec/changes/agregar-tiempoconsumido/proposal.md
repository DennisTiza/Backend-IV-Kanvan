## Why

El cambio anterior (`parada-acumula-tiempo`) reutilizó el campo `tiempo` de `ProcesoXTarjeta` para acumular segundos de tiempo consumido, pero `tiempo` originalmente es el estimado del proceso en minutos que el frontend usa como `tiempo * 60 * 1000` para countdown. Esto rompió la funcionalidad del temporizador regresivo.

## What Changes

- Agregar nuevo campo `tiempoConsumido` (number, segundos) a `ProcesoXTarjeta` para almacenar el tiempo real consumido
- `tiempo` se conserva como está: estimado en minutos, sin cambios
- Mover la acumulación de tiempo de `tiempo` a `tiempoConsumido` en:
  - `POST /proceso-x-tarjeta/{id}/registrar-parada`
  - `POST /proceso-x-tarjeta/{id}/finalizar`
- Body de endpoints no cambia
- Migración automática vía `npm run migrate` (alter mode)
- Sin cambios en SQL manuales

## Capabilities

### New Capabilities
- *(ninguna)*

### Modified Capabilities
- `gestion-paradas`: El modelo `ProcesoXTarjeta` ahora incluye `tiempoConsumido`. El requirement `POST /registrar-parada` acumula en `tiempoConsumido` en lugar de `tiempo`.
- `proceso-xtarjeta-transiciones`: El requirement `Finalizar proceso atómicamente` acumula en `tiempoConsumido` en lugar de `tiempo`.

## Impact

- **Modelo**: `ProcesoXTarjeta` — nuevo campo `tiempoConsumido: number`
- **Controlador**: solo `proceso-x-tarjeta.controller.ts` — cambiar `tiempo` → `tiempoConsumido` en `registrarParada` y `finalizar`
- **Base de datos**: se agrega columna `tiempo_consumido` mediante `npm run migrate`
- **Frontend**: `tiempo` sigue siendo el estimado en minutos (countdown), no afecta. `tiempoConsumido` es nuevo campo disponible para mostrar tiempo real consumido.
