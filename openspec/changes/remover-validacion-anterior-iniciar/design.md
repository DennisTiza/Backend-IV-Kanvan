## Context

El endpoint `POST /proceso-x-tarjeta/{id}/iniciar` actualmente valida que el proceso anterior en la misma tarjeta tenga `cantidadRegistrada > 0` antes de permitir iniciar. Esta validación pertenecía al flujo batch donde cada proceso debía completarse antes de que el siguiente comenzara.

El frontend ahora implementa flujo serial: cada proceso puede iniciar independientemente. El control de cantidades se delega a `getMaxPermitido()`, que limita el input del operario al `cantidadRegistrada` del proceso anterior — sin necesidad de validación en el backend al iniciar.

## Goals / Non-Goals

**Goals:**
- Eliminar la validación de proceso anterior en `POST /proceso-x-tarjeta/{id}/iniciar`
- Mantener la validación existente de proceso completo (`cantidadRegistrada === cantidad` → 409)
- Mantener la actualización de estado de tarjeta a `en_proceso` cuando se inicia el primer proceso

**Non-Goals:**
- No cambiar el endpoint `POST /proceso-x-tarjeta/{id}/finalizar`
- No cambiar el modelo de datos
- No cambiar `getMaxPermitido()` ni lógica del frontend

## Decisions

| Decisión | Opción elegida | Alternativas | Razón |
|---|---|---|---|
| Validación a eliminar | Bloque completo de búsqueda de hermanos (líneas 163-175) | Dejarlo pero hacerlo configurable, o cambiarlo a una advertencia en vez de error | El flujo serial no necesita ninguna validación entre procesos al iniciar. `getMaxPermitido()` en frontend ya controla el orden lógico de cantidades. Menos código = menos superficie de bugs. |
| Escenario a remover del spec | "Iniciar proceso saltando el orden secuencial" completo | Relajarlo a "solo warning" | El escenario ya no refleja el comportamiento deseado. Mantenerlo causaría confusión. |

## Risks / Trade-offs

- [Riesgo bajo] Un proceso podría iniciarse antes de que el anterior haya sido creado o asignado a la tarjeta → Mitigación: el frontend solo muestra procesos que ya están asociados a la tarjeta. El endpoint `findById` lanzará 404 si el proceso no existe.
- [Riesgo bajo] Se pierde la validación de orden secuencial a nivel backend → Mitigación: no es necesaria, el orden de los procesos se refleja en la UI y `getMaxPermitido()` garantiza que las cantidades reportadas respeten el progreso real.
