## Why

Al iniciar el primer proceso de una tarjeta, el backend no actualiza `TarjetaDeProduccion.estado = 'en_proceso'` porque la condición `proceso.orden === 1` falla si el orden comienza desde 0 (depende de cómo se ingresaron los datos en `ProductoXProceso.orden`).

## What Changes

- Cambiar la condición para detectar el primer proceso de `proceso.orden === 1` a `idx === 0`, usando el índice del array ya ordenado
- Esto funciona sin importar si `orden` comienza en 0, 1, o cualquier valor

## Capabilities

### New Capabilities
*(ninguna)*

### Modified Capabilities
- `proceso-xtarjeta-transiciones`: La condición para detectar el primer proceso DEBE usar el índice en la lista ordenada, no el valor absoluto de `orden`

## Impact

- `src/controllers/proceso-x-tarjeta.controller.ts`: línea 159 — cambiar condición
- No afecta API contract
