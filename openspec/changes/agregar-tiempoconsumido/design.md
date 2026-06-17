## Context

El cambio `parada-acumula-tiempo` introdujo acumulación de tiempo en el campo `tiempo` de `ProcesoXTarjeta`, asumiendo que era tiempo en segundos. Sin embargo, el campo `tiempo` ya era usado por el frontend como estimado en minutos para countdown (`tiempo * 60 * 1000`). Esto causó que el countdown mostrara valores incorrectos.

Se requiere separar los dos conceptos:
- `tiempo`: estimado en minutos (existente, no cambiar)
- `tiempoConsumido`: tiempo real consumido en segundos (nuevo)

## Goals / Non-Goals

**Goals:**
- Agregar campo `tiempoConsumido` a `ProcesoXTarjeta` (segundos)
- Migrar acumulación de tiempo de `tiempo` a `tiempoConsumido` en `registrarParada` y `finalizar`
- Migración automática vía `npm run migrate` (alter mode)
- Actualizar especificaciones delta

**Non-Goals:**
- No cambiar el campo `tiempo` ni su semántica (sigue siendo estimado en minutos)
- No cambiar bodies de endpoints
- No crear migraciones SQL manuales
- No afectar el frontend existente

## Decisions

1. **Nuevo campo en lugar de reutilizar `tiempo`**
   - Alternativa: cambiar `tiempo` a segundos y actualizar frontend. Se descarta porque requeriría cambios en frontend y coordinación.
   - Decisión: campo nuevo `tiempoConsumido: number` en segundos. El frontend existente no se toca.

2. **Tipo number sin formato especial**
   - Se almacena en segundos como integer. El frontend puede formatearlo como necesite (minutos, horas, etc.).

3. **Migración automática (alter mode)**
   - LoopBack detecta la nueva propiedad y agrega la columna `tiempo_consumido` automáticamente con `npm run migrate`.
   - Sin SQL manual, sin scripts de migración.

## Risks / Trade-offs

- [Riesgo] Datos existentes en `tiempo` podrían tener valores incorrectos (mezcla de minutos y segundos del cambio anterior) → Mitigación: no se modifican; el frontend sigue mostrando `tiempo` como countdown. Los valores incorrectos se corrigen manualmente si es necesario.
- [Riesgo] La columna `tiempo_consumido` se creará con NULL para registros existentes → Mitigación: aceptable, el campo es opcional y se va poblando a medida que se registran paradas o se finalizan procesos.

## Migration Plan

1. Agregar `tiempoConsumido` al modelo `ProcesoXTarjeta`
2. Actualizar `registrarParada` y `finalizar` para usar `tiempoConsumido`
3. Ejecutar `npm run migrate` (alter mode agrega la columna automáticamente)
4. Verificar compilación con `npm run build`
