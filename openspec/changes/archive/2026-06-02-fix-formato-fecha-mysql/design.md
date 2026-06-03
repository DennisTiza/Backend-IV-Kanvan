## Context

MySQL DATETIME columns require format `YYYY-MM-DD HH:mm:ss`. JavaScript's `Date.toISOString()` returns `2026-06-02T14:11:21.080Z` which is rejected. The project already solved this in `usuario.controller.ts:232` using `toLocaleString('sv-SE')` which produces the correct format.

## Goals / Non-Goals

**Goals:**
- Que `POST /proceso-x-tarjeta/{id}/iniciar` y `POST /proceso-x-tarjeta/{id}/finalizar` funcionen sin error 500
- Usar el mismo patrón de formato que el resto del proyecto

**Non-Goals:**
- No se cambia el modelo ni el tipo de datos de las columnas
- No se agrega una función utilitaria compartida (se puede hacer en el futuro si el patrón se repite)

## Decisions

### 1. Formato de fecha
Se reemplaza `new Date().toISOString()` por `new Date().toLocaleString('sv-SE')` en los 3 lugares donde se asigna fecha en `iniciar` y `finalizar`.

**Alternativas consideradas:**
- **`moment` o `date-fns`**: Dependencia externa innecesaria para un formato simple
- **`toISOString()` con replace**: `new Date().toISOString().replace('T', ' ').replace(/\.\d+Z$/, '')` — más frágil y menos legible
- **Utilidad compartida**: Podría ir a un helper pero solo hay 3 usos hoy

**Por qué `toLocaleString('sv-SE')`:** Es el patrón existente en el proyecto, no requiere nuevas dependencias, y produce `YYYY-MM-DD HH:mm:ss` exactamente.

## Risks / Trade-offs

- **[Bajo] Zona horaria**: `toISOString()` usa UTC, `toLocaleString('sv-SE')` usa la zona local del servidor. Si el servidor no está en hora Colombia, los registros tendrán la hora del servidor. Mitigación: el proyecto ya usa este patrón en `usuario.controller.ts` con el mismo comportamiento.
