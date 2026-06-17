## Why

Cuando un proceso en una tarjeta de producción tiene múltiples operarios asignados, al reportar cantidad (vía parada o finalización) no se registra qué operario específico realizó ese trabajo. Esto impide saber cuánto produjo cada operario, distorsiona métricas de rendimiento individual y no permite trazabilidad por operario.

## What Changes

- Crear nueva entidad `RegistroDeCantidad` que persista cada reporte de cantidad con su operario, proceso y timestamp
- Agregar `operarioId` a la entidad `Parada` para asociar cada parada al operario que la reportó
- Modificar `POST /proceso-x-tarjeta/{id}/registrar-parada` para aceptar `operarioId` y crear un `RegistroDeCantidad`
- Modificar `POST /proceso-x-tarjeta/{id}/finalizar` para aceptar `operarioId` y crear un `RegistroDeCantidad`
- Modificar `GET /proceso-x-tarjeta/{id}/paradas` para incluir datos del operario
- Agregar endpoint `GET /proceso-x-tarjeta/{id}/registros-cantidad` para consultar todos los registros de cantidad de un proceso
- En el frontend, agregar un dropdown de selección de operario en los formularios de reporte de cantidad (parada y finalización)

## Capabilities

### New Capabilities
- `registro-cantidad-operario`: Persistencia y consulta de reportes de cantidad por operario en procesos de tarjetas de producción

### Modified Capabilities
- `proceso-xtarjeta-transiciones`: Los endpoints `finalizar` y `registrar-parada` cambian su contrato para requerir `operarioId` y crear registros de cantidad
- `gestion-paradas`: `Parada` ahora incluye `operarioId` como FK al operario que reportó la parada

## Impact

- Backend: Nuevo modelo `RegistroDeCantidad`, migración de BD (nueva tabla `RegistroDeCantidad`, columna `operarioId` en `Parada`), modificación de 2 endpoints existentes, 1 nuevo endpoint
- Frontend: Modificar formularios de reporte de cantidad para incluir selector de operario
- BD: Migración con nueva tabla y columna
