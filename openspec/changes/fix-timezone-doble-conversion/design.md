## Context

El datasource MySQL tiene `timezone: '-05:00'` configurado. Esto le indica al conector LoopBack que los valores DATETIME en la BD están en UTC-5 (Colombia). El conector:
1. Al leer: interpreta el valor raw como UTC-5 y lo convierte a UTC internamente
2. Al serializar JSON: vuelve a aplicar la conversión de timezone

El resultado es que las fechas se desplazan 5 horas: la BD guarda la hora correcta (Colombia), pero el frontend recibe un valor UTC incorrecto.

## Goals / Non-Goals

**Goals:**
- Eliminar la doble conversión de timezone
- Las fechas DATETIME deben viajar sin transformación del ORM
- El frontend debe recibir fechas ISO UTC correctas

**Non-Goals:**
- No se cambia el tipo de columna (sigue siendo DATETIME, no TIMESTAMP)
- No se modifica la lógica de los endpoints
- No se migran datos existentes

## Decisions

### 1. Quitar `timezone: '-05:00'` del datasource
Es la solución más simple y directa. Sin esta configuración, el conector MySQL trata los DATETIME como strings sin conversión de timezone. La serialización a JSON usará `.toISOString()` que produce UTC correcto.

Alternativa considerada: Cambiar a `timezone: 'Z'` o `timezone: '+00:00'` — pero quitarlo directamente logra el mismo resultado sin config redundante.

### 2. No cambiar el formato de fecha en los endpoints
Los endpoints usan `new Date().toLocaleString('sv-SE')` para asignar fechas (formato `YYYY-MM-DD HH:mm:ss` sin timezone). Esto funciona porque MySQL DATETIME acepta ese formato. Sin el `timezone` en el connector, el valor se almacena y se lee sin conversión.

### 3. El frontend no requiere cambios
`new Date("2026-06-02T16:17:52.000Z")` interpreta correctamente UTC y muestra la hora local. Con el fix, el valor UTC será correcto y el frontend mostrará la hora exacta del servidor.

## Risks / Trade-offs

- **[Bajo] Datos existentes**: Los registros con fechas previas pueden haberse almacenado con el offset de timezone aplicado. Al leerlos sin `timezone`, se interpretarán como UTC directo. Si antes se guardó `11:17` (Colombia, que se convertía a `16:17` UTC), ahora se leerá como `11:17` UTC. Pero dado que el servidor siempre estuvo en Colombia (UTC-5) y las fechas se generan con `new Date().toLocaleString('sv-SE')` (hora local), los datos existentes ya están en hora Colombia. Coinciden. No hay desfase.
- **[Bajo] Sin rollback**: Si se necesita revertir, solo volver a agregar `timezone: '-05:00'`. No hay migración de datos involucrada.
