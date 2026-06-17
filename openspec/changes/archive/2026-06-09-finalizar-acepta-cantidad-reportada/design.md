## Context

El endpoint `POST /proceso-x-tarjeta/{id}/finalizar` actualmente solo asigna `fechaFinal`. No actualiza `cantidadRealizada` ni `cantidadRegistrada`, lo que obliga al frontend a hacer un two-step (registrar parada sin código + finalizar) cuando el operario termina un proceso sin paradas. El cambio es pequeño y backward-compatible.

## Goals / Non-Goals

**Goals:**
- `POST /finalizar` acepta body opcional `{ cantidadReportada: number }`
- Si llega `cantidadReportada`: actualiza `cantidadRealizada` y suma a `cantidadRegistrada`, además de asignar `fechaFinal`
- Si no llega: comportamiento actual (solo `fechaFinal`)
- Que los escenarios con y sin parada fluyan naturalmente desde el frontend

**Non-Goals:**
- No cambiar el modelo ni la base de datos
- No cambiar `registrar-parada` (sigue requiriendo `codigoDeParadaId`)
- No cambiar `iniciar`
- No cambiar la lógica de transición de tarjeta a `finalizada`

## Decisions

| Decisión | Opción elegida | Alternativas | Razón |
|----------|---------------|--------------|-------|
| Body opcional vs dos endpoints | Body opcional en `finalizar` | Crear `POST /reportar-avance` separado | Menos endpoints, mismo controlador, lógica simple. El body es literalmente el mismo campo que en `registrar-parada` pero sin `codigoDeParadaId` |
| Validación de desborde | `cantidadRegistrada + cantidadReportada <= cantidad` | Permitir sobrepasar | Misma validación que en `registrar-parada`. No tiene sentido permitir reportar más del total |
| Reuso de lógica | Condicional inline en `finalizar` | Extraer helper `actualizarCantidades()` | Solo hay un lugar de uso. Si apareciera un tercer endpoint se refactoriza |

## Risks / Trade-offs

- **[Backward compatibility]** Cualquier cliente que llame `POST /finalizar` sin body sigue funcionando exactamente igual → riesgo bajo.
- **[Confusión frontend]** El equipo frontend debe decidir cuándo usar `finalizar` con `cantidadReportada` vs `registrar-parada`. La regla es simple: si hay parada real → `registrar-parada`; si solo se reporta avance al terminar → `finalizar` con `cantidadReportada`.
