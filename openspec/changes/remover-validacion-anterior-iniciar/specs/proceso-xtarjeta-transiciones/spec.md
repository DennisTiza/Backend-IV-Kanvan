## MODIFIED Requirements

### Requirement: Iniciar proceso atómicamente
El sistema DEBE exponer `POST /proceso-x-tarjeta/{id}/iniciar` que establece `fechaInicio` a la fecha/hora actual en formato compatible con MySQL DATETIME (`YYYY-MM-DD HH:mm:ss`). Si el proceso ya fue iniciado previamente (tiene `fechaInicio`) pero no está completo (`cantidadRegistrada < cantidad`), DEBE permitir reiniciarlo actualizando `fechaInicio`.

#### Scenario: Iniciar proceso pendiente exitosamente
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/iniciar` para un proceso con `fechaInicio = null`
- **AND** el proceso no está completo (`cantidadRegistrada < cantidad`)
- **THEN** el sistema DEBE establecer `fechaInicio` a la fecha/hora actual en formato `YYYY-MM-DD HH:mm:ss`
- **AND** DEBE retornar el `ProcesoXTarjeta` actualizado con código 200

#### Scenario: Reiniciar proceso con paradas
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/iniciar` para un proceso con `fechaInicio` seteada, sin `fechaFinal`, y con `cantidadRegistrada < cantidad`
- **THEN** el sistema DEBE actualizar `fechaInicio` a la fecha/hora actual
- **AND** DEBE retornar el `ProcesoXTarjeta` actualizado con código 200

#### Scenario: Iniciar proceso que ya está completo
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/iniciar` para un proceso con `cantidadRegistrada == cantidad`
- **THEN** el sistema DEBE retornar error 409 Conflict

#### Scenario: Iniciar primer proceso actualiza tarjeta a en_proceso
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/iniciar` para el proceso con `orden = 1`
- **THEN** el sistema DEBE establecer `TarjetaDeProduccion.estado = 'en_proceso'`

#### Scenario: Iniciar proceso con ID inexistente
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/iniciar` con un `id` que no existe
- **THEN** el sistema DEBE retornar error 404 Not Found

## REMOVED Requirements

### Requirement: Iniciar proceso saltando el orden secuencial
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/iniciar` para un proceso cuyo anterior (por `orden`) no tiene `cantidadRegistrada > 0`
- **THEN** el sistema DEBE retornar error 409 Conflict

**Reason**: El flujo de producción cambió de batch a serie. Los procesos pueden iniciar independientemente; `getMaxPermitido()` en el frontend controla que no se reporte más de lo registrado por el proceso anterior.

**Migration**: Clientes que dependían del error 409 para ordenar procesos deben ajustar su lógica. El backend ya no rechazará `iniciar` por esta causa.
