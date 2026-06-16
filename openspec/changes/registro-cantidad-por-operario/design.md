## Context

Actualmente `ProcesoXTarjeta` tiene `cantidadRegistrada` como acumulado total, y `OperarioXProcesoXTarjeta` solo asigna operarios al proceso sin tracking de cantidades individuales. Cuando se reporta cantidad vía `registrar-parada` o `finalizar`, no se persiste qué operario reportó, por lo que todos los operarios asignados aparecen como responsables de toda la cantidad.

## Goals / Non-Goals

**Goals:**
- Persistir cada reporte de cantidad asociado al operario que lo realizó
- Permitir consultar el desglose por operario de un proceso
- Asociar cada parada al operario que la reportó
- Mantener `cantidadRegistrada` en `ProcesoXTarjeta` como acumulado total (no se rompe lógica existente)
- Mínimo impacto en frontend: solo agregar dropdown de selección

**Non-Goals:**
- No se modifica el flujo de inicio de proceso
- No se cambia la lógica de detección de proceso completo/tarjeta finalizada
- No se agrega autenticación de operarios (la selección es manual por ahora)

## Decisions

### Decisión 1: Nueva entidad `RegistroDeCantidad` en lugar de extender `OperarioXProcesoXTarjeta`

**Alternativa A (descartada):** Agregar `cantidadReportada` a `OperarioXProcesoXTarjeta`.
- Problema: Un operario puede reportar múltiples veces en distintas sesiones. Con un solo campo acumulativo se pierde el histórico de cada reporte.

**Alternativa B (elegida):** Nueva entidad `RegistroDeCantidad`.
- Cada reporte de cantidad (vía parada o finalización) crea un nuevo registro.
- Permite auditoría completa: quién, cuánto, cuándo, y si fue producción o parada.
- `cantidadRegistrada` en `ProcesoXTarjeta` se sigue actualizando igual que hoy —el `RegistroDeCantidad` es el detalle, no el total.

### Decisión 2: Agregar `operarioId` a `Parada`

**Alternativa A (descartada):** No agregar `operarioId` a `Parada`, derivar operario desde `RegistroDeCantidad`.
- Requeriría join por `procesoXTarjetaId` + `fecha` para emparejar, frágil e impreciso.

**Alternativa B (elegida):** Agregar `operarioId` como FK en `Parada`.
- La parada sabe directamente qué operario la reportó.
- Consulta simple: `GET /paradas` ya incluye operario sin joins complejos.

**Alternativa C (descartada):** Reemplazar `Parada` con `RegistroDeCantidad.tipo='parada'`.
- Demasiado invasivo. `Parada` ya tiene su propio modelo, repositorio y relaciones. Mejor extenderla ligeramente que reemplazarla.

### Decisión 3: `cantidadRegistrada` se mantiene como campo directo

Se sigue actualizando igual que hoy. No se vuelve calculado. `RegistroDeCantidad` es solo para desglose por operario. Esto evita cambiar lógica existente de detección de procesos completos y finalización de tarjetas.

## Riesgos / Trade-offs

| Riesgo | Mitigación |
|---|---|
| Frontend debe modificar 2 formularios para agregar dropdown de operario | El cambio es solo agregar un `<select>` con los operarios del proceso; la data ya se obtiene de `operarioXProcesoXTarjetas` |
| Datos existentes no tienen operario en paradas ni registros | Los registros anteriores quedan con `operarioId = NULL`. No se exige migrar datos históricos. |
| `operarioId` requerido en requests puede romper integraciones existentes | Se marca como requerido en los specs, pero el backend puede aceptarlo como opcional con validación suave inicialmente |

## Migración Plan

1. Crear tabla `RegistroDeCantidad`
2. Agregar columna `operarioId` (nullable) a `Parada`
3. Actualizar modelo `Parada` en LoopBack con nueva relación belongsTo a `Operario`
4. Actualizar lógica de `registrar-parada` y `finalizar`
5. Agregar endpoint `GET /registros-cantidad`
6. Frontend: agregar dropdown en formularios

Rollback: Eliminar columna `operarioId` de `Parada`, eliminar tabla `RegistroDeCantidad`, revertir cambios de frontend.

## Open Questions

- ¿El dropdown debe mostrar solo los operarios asignados al proceso (`OperarioXProcesoXTarjeta`) o cualquier operario del sistema? Por ahora asumimos solo los asignados al proceso.
- ¿El campo `operarioId` debe ser requerido u opcional en los endpoints? Por ahora requerido para nuevos reportes.
