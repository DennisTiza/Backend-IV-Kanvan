## Context

El endpoint `POST /registrar-parada` actualmente solo actualiza cantidades sin tocar `tiempo` ni `fechaInicio`. Esto causa que: (1) el timer del frontend se resetea al reanudar, (2) si una parada completa la cantidad, el proceso queda sin `fechaFinal`. El modelo `ProcesoXTarjeta` ya tiene un campo `tiempo` sin usar.

## Goals / Non-Goals

**Goals:**
- `registrar-parada` acumula tiempo de la sesión en `tiempo` y pone `fechaInicio = null`
- `registrar-parada` auto-asigna `fechaFinal` si `cantidadRegistrada >= cantidad`
- `finalizar` permite finalizar procesos en pausa (`fechaInicio == null` con `cantidadRegistrada > 0`)
- Que el frontend pueda mostrar timer exacto usando `tiempo + (ahora - fechaInicio)`

**Non-Goals:**
- No crear nuevos campos ni migraciones BD
- No cambiar la estructura del body de `registrar-parada`
- No cambiar `iniciar` (ya funciona correctamente)

## Decisions

| Decisión | Opción elegida | Alternativas | Razón |
|----------|---------------|--------------|-------|
| Unidad de tiempo | Segundos (number) | Minutos, milisegundos | El campo `tiempo` ya existe como `number` sin tipo definido. Segundos es estándar y suficiente para display. |
| Cálculo de duración | `(new Date() - fechaInicio) / 1000` en segundos | Floor/ceil | Precisión de segundos es suficiente para un timer industrial |
| Manejo de borde en finalizar | Permitir `fechaInicio == null` solo si `cantidadRegistrada > 0` | Permitir siempre | Un proceso con 0 registrado y sin inicio no debería finalizarse — no tiene sentido |
| Auto-finalizar | `fechaFinal = now` si `cantidadRegistrada >= cantidad` después de sumar | Dejar sin fechaFinal | El frontend preguntó explícitamente: sin auto-finalizar queda un estado inconsistente |

## Riesgos / Trade-offs

- **[Proceso pausado sin fechaInicio pero activo]** Si el servidor se cae después de `registrar-parada` (que pone `fechaInicio = null`) pero antes de que el frontend lo sepa, el proceso se ve como pausado. Al recargar, el frontend lo muestra correctamente porque consulta el estado actual.
- **[Precisión del timer]** Usar `tiempo + (now - fechaInicio)` para el display activo significa que el timer avanza aunque el proceso esté pausado si el frontend no distingue estados. El frontend debe mostrar `tiempo` (fijo) cuando `fechaInicio == null`.
