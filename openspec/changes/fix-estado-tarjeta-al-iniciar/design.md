## Context

El endpoint `iniciar` ya calcula `idx = hermanos.findIndex(p => p.id === id)` después de ordenar los procesos hermanos por `orden ASC`. Pero la condición para actualizar la tarjeta usa `proceso.orden === 1`, que es frágil porque depende del valor concreto de `orden`.

## Goals / Non-Goals

**Goals:**
- Que cambiar al primer proceso de cualquier tarjeta actualice su estado a `en_proceso`

**Non-Goals:**
- No se cambia la lógica de `finalizar` (allí no hay este problema)

## Decisions

**Decisión:** Reemplazar `if (proceso.orden === 1)` por `if (idx === 0)`.

`idx` se calcula en la línea 144 sobre el array `hermanos` que ya está ordenado por `orden ASC`. Por lo tanto:
- `idx === 0` → primer proceso en la secuencia, siempre
- No importa si `orden` es 0, 1, o cualquier valor

## Risks / Trade-offs

- **[Bajo]**: Si `hermanos` estuviera vacío (no debería ocurrir), `findIndex` retorna -1 y la condición falla. Esto es seguro.
