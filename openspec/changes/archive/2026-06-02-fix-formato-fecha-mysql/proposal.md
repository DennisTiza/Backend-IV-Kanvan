## Why

El endpoint `POST /proceso-x-tarjeta/{id}/iniciar` falla con error 500 porque `new Date().toISOString()` produce un formato (`2026-06-02T14:11:21.080Z`) que MySQL no acepta para columnas DATETIME. MySQL espera `YYYY-MM-DD HH:mm:ss`.

## What Changes

- Reemplazar `new Date().toISOString()` por el formato compatible con MySQL en los endpoints `iniciar` y `finalizar`
- Aplicar el mismo patrón ya usado en el proyecto (`usuario.controller.ts`): `new Date().toLocaleString('sv-SE')`

## Capabilities

### New Capabilities
*(ninguna)*

### Modified Capabilities
- `proceso-xtarjeta-transiciones`: El formato de fecha/hora enviado a MySQL DEBE ser compatible con DATETIME (`YYYY-MM-DD HH:mm:ss`)

## Impact

- `src/controllers/proceso-x-tarjeta.controller.ts`: líneas 154, 156 y 202 — cambiar formato de fecha
- No afecta API contract (el input/output sigue siendo string ISO, el cambio es interno al backend)
