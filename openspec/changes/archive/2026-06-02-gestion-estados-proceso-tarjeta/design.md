## Context

Actualmente `ProcesoXTarjeta` no tiene campo `orden` — el orden de procesos existe solo en `ProductoXProceso.orden` y se usa al crear la tarjeta, pero no se persiste en los procesos de la tarjeta. El endpoint `GET /proceso-x-tarjeta/por-tarjeta/{id}` no aplica `ORDER BY`. No existen endpoints para transiciones de estado — el frontend tendría que hacer `PATCH` directo sobre `fechaInicio`/`fechaFinal` sin validación.

LoopBack 4, MySQL, sin serviços de aplicación — solo controllers → repositories.

## Goals / Non-Goals

**Goals:**
- Que `ProcesoXTarjeta` tenga `orden` y se ordene explícitamente
- Que iniciar/finalizar un proceso sea atómico y validado
- Que el estado de la tarjeta se actualice en cascada (1er proceso → `en_proceso`, último → `finalizada`)
- Que el flujo sea secuencial (no iniciar proceso si el anterior no terminó)

**Non-Goals:**
- No se agrega `estado` explícito a `ProcesoXTarjeta` — el estado sigue siendo implícito (fechaInicio/fechaFinal/codigoDeErrorId)
- No se implementa flujo de error/con_error en la tarjeta (pendiente de definición con los jefes)
- No se agrega autenticación/autorización a los endpoints (se maneja aparte)
- No se crean servicios de aplicación — la lógica va en los controladores

## Decisions

### 1. Campo `orden` en `ProcesoXTarjeta`
**Decisión:** Agregar `@property({ type: 'number', required: true }) orden` al modelo.
**Alternativa:** No agregarlo y hacer JOIN con `ProductoXProceso.orden` en cada consulta.
**Por qué:** El JOIN añade complejidad y fragilidad. Copiar el orden al crear la tarjeta es un costo único que simplifica todas las consultas posteriores.

### 2. Copiar `orden` al crear la tarjeta
**Decisión:** En `TarjetaDeProduccionController.create()`, al recorrer los `ProductoXProceso` ordenados por `orden ASC`, incluir `orden: pp.orden` en la creación del `ProcesoXTarjeta`.
**Por qué:** Es una línea adicional en el loop existente. El orden ya se calcula ahí, solo falta persistirlo.

### 3. Transiciones de estado atómicas
**Decisión:** Nuevos métodos en `ProcesoXTarjetaController`:
- `POST /proceso-x-tarjeta/{id}/iniciar` → setea `fechaInicio = now()`
- `POST /proceso-x-tarjeta/{id}/finalizar` → setea `fechaFinal = now()` y opcionalmente `codigoDeErrorId`

Ambos endpoints usan `async` y se benefician del auto-flush de LoopBack (cada `save()` es una transacción implícita a nivel de fila). Si en el futuro se necesita transacción multi-tabla, se puede agregar con `@loopback/repository` transactions.

### 4. Validación de flujo secuencial
**Decisión:** En `iniciar`, antes de setear `fechaInicio`:
1. Verificar que `fechaInicio` sea null (409 si ya iniciado)
2. Obtener todos los procesos de la misma tarjeta ordenados por `orden ASC`
3. Si no es el primero, verificar que el proceso anterior tenga `fechaFinal` seteada (409 si no)

### 5. Actualización en cascada de `TarjetaDeProduccion.estado`
**Decisión:** En los endpoints `iniciar`/`finalizar`, después de guardar el proceso:
- `iniciar`: si el proceso tiene `orden === 1` (es el primero), setear `tarjeta.estado = 'en_proceso'`
- `finalizar`: después de finalizar, verificar si TODOS los procesos de la tarjeta tienen `fechaFinal` seteada. Si sí, setear `tarjeta.estado = 'finalizada'`

La verificación de "todos finalizados" se hace consultando `count` de procesos de la tarjeta donde `fechaFinal IS NULL`.

### 6. Códigos de estado HTTP
| Situación | Código |
|-----------|--------|
| Proceso no encontrado | 404 |
| Proceso ya iniciado | 409 Conflict |
| Proceso anterior no finalizado | 409 Conflict |
| Proceso aún no iniciado al finalizar | 409 Conflict |
| Proceso ya finalizado | 409 Conflict |
| Éxito | 200 OK |

### 7. Orden en endpoint existente
**Decisión:** Agregar `order: ['orden ASC']` al `GET /proceso-x-tarjeta/por-tarjeta/{tarjetaId}` existente.

## Risks / Trade-offs

- **[Bajo] Migración de esquema**: LoopBack auto-migración con `alter` podría fallar si hay datos existentes sin `orden`. Mitigación: ejecutar script SQL manual para backfill con orden basado en `id` o ejecutar `migrate --rebuild` si es aceptable perder datos.
- **[Medio] Transacciones multi-tabla**: Si la cascada a `TarjetaDeProduccion` falla después de guardar el proceso, hay inconsistencia. Mitigación: el orden de operaciones primero guarda el proceso, luego actualiza la tarjeta. Si la tarjeta falla, el proceso queda con datos inconsistentes. Para este MVP se acepta el riesgo; en una fase posterior se puede envolver en transacción.
- **[Bajo] Sin historial de transiciones**: No se guarda quién inició/finalizó ni cuándo exactamente (solo `fechaInicio`/`fechaFinal`). Si se requiere auditoría en el futuro, habría que agregar una tabla de historial.
- **[Bajo] Estado `con_error` en tarjeta pendiente**: El endpoint `finalizar` con error setea `codigoDeErrorId` en el proceso pero no cambia el estado de la tarjeta (por ahora). Esto se definirá cuando los jefes respondan.

## Open Questions

- ¿Qué estado debe tomar `TarjetaDeProduccion` cuando un proceso finaliza con error? ¿`con_error`? ¿Se puede continuar con el siguiente proceso?
- ¿Se necesita poder "reabrir" un proceso finalizado (por ejemplo, si se registró un error por accidente)?
- ¿El campo `operarioId` en `ProcesoXTarjeta` se sigue usando o quedó de un diseño anterior? Hoy nadie lo asigna.
