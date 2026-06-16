## Why

El timer del frontend se resetea a cero cada vez que se reanuda un proceso, porque `fechaInicio` se sobrescribe sin acumular el tiempo previo. Además, al registrar una parada que completa la cantidad, el proceso queda sin `fechaFinal` — estado inconsistente. Se necesita que las paradas acumulen tiempo, congelen el timer y auto-finalicen cuando corresponda.

## What Changes

- `POST /registrar-parada`: calcular `ahora - fechaInicio`, sumar a `tiempo`, establecer `fechaInicio = null` (proceso pausado), auto-asignar `fechaFinal = now` si `cantidadRegistrada >= cantidad`
- `POST /finalizar`: permitir finalizar procesos con `fechaInicio == null` siempre que tengan `cantidadRegistrada > 0` (procesos en pausa)
- Sin cambios en modelos ni migraciones — el campo `tiempo` ya existe en `ProcesoXTarjeta`

## Capabilities

### New Capabilities
- *(ninguna)*

### Modified Capabilities
- `gestion-paradas`: El requirement `POST /proceso-x-tarjeta/{id}/registrar-parada` se modifica para acumular tiempo en `tiempo`, establecer `fechaInicio = null`, y auto-finalizar si completó la cantidad.
- `proceso-xtarjeta-transiciones`: El requirement `Finalizar proceso atómicamente` se modifica para permitir finalizar procesos en pausa (`fechaInicio == null` con `cantidadRegistrada > 0`).

## Impact

- **API**: `POST /registrar-parada` — comportamiento ampliado (backward-compatible, body no cambia). `POST /finalizar` — menos restrictivo.
- **Controlador**: solo `proceso-x-tarjeta.controller.ts` (métodos `registrarParada` y `finalizar`).
- **Modelos/BD**: sin cambios — `tiempo` ya existe en `ProcesoXTarjeta`.
- **Frontend**: ahora puede mostrar timer correcto: `fechaInicio != null` → corriendo (`tiempo + ahora - fechaInicio`), `fechaInicio == null` → congelado (`tiempo`), `fechaFinal != null` → fijo (`tiempo`).
