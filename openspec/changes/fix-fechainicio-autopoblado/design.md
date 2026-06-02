## Context

Actualmente `fechaInicio` en `proceso_x_tarjeta` se auto-puebla con la hora actual en MySQL debido a `DEFAULT CURRENT_TIMESTAMP` en la columna. Esto ocurre al crear el registro desde `tarjeta-de-produccion.controller.ts` sin enviar `fechaInicio`. El endpoint `iniciar` chequea `if (proceso.fechaInicio)` y rechaza con 409 porque ya existe un valor. El frontend recibe datos inconsistentes (fecha de creación como si fuera fecha de inicio) y el timer muestra 00:00:00.

## Goals / Non-Goals

**Goals:**
- `fechaInicio` debe ser NULL al crear `proceso_x_tarjeta`
- `fechaInicio` solo debe asignarse cuando el operario hace clic en Iniciar (endpoint `POST /iniciar`)
- El endpoint `iniciar` debe funcionar sin 409 espurios
- El modelo TypeScript debe reflejar que `fechaInicio` es nullable

**Non-Goals:**
- No se cambia el endpoint `finalizar` (ya funciona correctamente)
- No se cambia la lógica de estado de tarjeta (`en_proceso`, `finalizada`)
- No se agrega autenticación ni autorización

## Decisions

### 1. Hacer `fechaInicio` nullable en el modelo
`fechaInicio` pasa de `string` a `string | undefined` (opcional) y sin `required: true`. Esto le indica a LoopBack que el campo puede ser NULL en BD y no debe enviarse al crear.

### 2. No tocar la creación de `proceso_x_tarjeta`
El código actual en `tarjeta-de-produccion.controller.ts:66-70` ya no envía `fechaInicio`. Con el modelo actualizado, LoopBack no lo incluirá en el INSERT y MySQL lo dejará como NULL (asumiendo que quitamos el DEFAULT).

### 3. Quitar `DEFAULT CURRENT_TIMESTAMP` de la columna en MySQL
Se requiere migración SQL para alterar la columna:
```sql
ALTER TABLE proceso_x_tarjeta 
MODIFY COLUMN fechaInicio DATETIME NULL DEFAULT NULL;
```

O si no hay datos sensibles, LoopBack puede auto-migrar con `fechaInicio?: string`.

### 4. Endpoint `iniciar` no requiere cambios
Ya asigna `fechaInicio = new Date().toLocaleString('sv-SE')` y hace `updateById`. Con el campo empezando como NULL, el chequeo `if (proceso.fechaInicio)` funcionará correctamente (pasará sin 409).

## Risks / Trade-offs

- **[Bajo] LoopBack auto-migración**: Si se usa auto-migrate, LoopBack regenerará la columna sin DEFAULT. Si hay datos existentes con fechaInicio poblada, esos registros mantendrán su valor (no se pierden).
- **[Bajo] Registros existentes**: Las `proceso_x_tarjeta` ya creadas que tienen `fechaInicio` poblada por defecto quedarán con ese valor. Si estaban en estado pendiente real pero tienen fechaInicio, quedarán inconsistentes. Se puede limpiar con:
  ```sql
  UPDATE proceso_x_tarjeta SET fechaInicio = NULL WHERE fechaFinal IS NULL;
  ```
- **[Medio] Sin transacción**: La creación de tarjeta + procesos hijos no está en una transacción. Si falla la creación de un proceso hijo, la tarjeta queda huérfana. Aceptado para MVP.
