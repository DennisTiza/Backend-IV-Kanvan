## MODIFIED Requirements

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
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/iniciar` para el proceso con el `orden` más bajo de la tarjeta
- **THEN** el sistema DEBE establecer `TarjetaDeProduccion.estado = 'en_proceso'`

#### Scenario: Iniciar proceso que no es el primero no cambia estado
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/iniciar` para un proceso que no es el primero (orden > mínimo)
- **THEN** el sistema NO DEBE cambiar el estado de la tarjeta

#### Scenario: Iniciar proceso con ID inexistente
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/iniciar` con un `id` que no existe
- **THEN** el sistema DEBE retornar error 404 Not Found
