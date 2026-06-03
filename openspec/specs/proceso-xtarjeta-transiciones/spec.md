## ADDED Requirements

### Requirement: Iniciar proceso atómicamente
El sistema DEBE exponer `POST /proceso-x-tarjeta/{id}/iniciar` que establece `fechaInicio` a la fecha/hora actual en formato compatible con MySQL DATETIME (`YYYY-MM-DD HH:mm:ss`).

#### Scenario: Iniciar proceso pendiente exitosamente
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/iniciar` para un proceso con `fechaInicio = null`
- **AND** el proceso anterior en la tarjeta (si existe) tiene `fechaFinal` seteada
- **THEN** el sistema DEBE establecer `fechaInicio` a la fecha/hora actual en formato `YYYY-MM-DD HH:mm:ss`
- **AND** DEBE retornar el `ProcesoXTarjeta` actualizado con código 200

#### Scenario: Iniciar proceso ya iniciado
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/iniciar` para un proceso con `fechaInicio` ya seteada
- **THEN** el sistema DEBE retornar error 409 Conflict

#### Scenario: Iniciar proceso saltando el orden secuencial
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/iniciar` para un proceso cuyo anterior (por `orden`) no tiene `fechaFinal` seteada
- **THEN** el sistema DEBE retornar error 409 Conflict

#### Scenario: Iniciar primer proceso actualiza tarjeta a en_proceso
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/iniciar` para el proceso con `orden = 1`
- **THEN** el sistema DEBE establecer `TarjetaDeProduccion.estado = 'en_proceso'`

#### Scenario: Iniciar proceso con ID inexistente
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/iniciar` con un `id` que no existe
- **THEN** el sistema DEBE retornar error 404 Not Found

### Requirement: Finalizar proceso atómicamente
El sistema DEBE exponer `POST /proceso-x-tarjeta/{id}/finalizar` que establece `fechaFinal` a la fecha/hora actual en formato compatible con MySQL DATETIME (`YYYY-MM-DD HH:mm:ss`).

#### Scenario: Finalizar proceso en ejecución exitosamente
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/finalizar` para un proceso con `fechaInicio` seteada y `fechaFinal = null`
- **THEN** el sistema DEBE establecer `fechaFinal` a la fecha/hora actual en formato `YYYY-MM-DD HH:mm:ss`
- **AND** DEBE retornar el `ProcesoXTarjeta` actualizado con código 200

#### Scenario: Finalizar proceso con código de error
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/finalizar` con body `{ "codigoDeErrorId": 5 }`
- **THEN** el sistema DEBE establecer `fechaFinal`
- **AND** DEBE establecer `codigoDeErrorId = 5`
- **AND** el proceso queda implícitamente en estado `con_error`

#### Scenario: Finalizar proceso no iniciado
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/finalizar` para un proceso con `fechaInicio = null`
- **THEN** el sistema DEBE retornar error 409 Conflict

#### Scenario: Finalizar proceso ya finalizado
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/finalizar` para un proceso con `fechaFinal` ya seteada
- **THEN** el sistema DEBE retornar error 409 Conflict

#### Scenario: Finalizar último proceso actualiza tarjeta a finalizada
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/finalizar` para un proceso
- **AND** después de finalizar, todos los procesos de la tarjeta tienen `fechaFinal` seteada
- **THEN** el sistema DEBE establecer `TarjetaDeProduccion.estado = 'finalizada'`

#### Scenario: Finalizar proceso intermedio no cambia estado de tarjeta
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/finalizar` para un proceso
- **AND** después de finalizar, aún hay procesos en la tarjeta sin `fechaFinal`
- **THEN** el sistema NO DEBE cambiar el estado de la tarjeta (sigue en `en_proceso`)

#### Scenario: Finalizar proceso con ID inexistente
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/finalizar` con un `id` que no existe
- **THEN** el sistema DEBE retornar error 404 Not Found
