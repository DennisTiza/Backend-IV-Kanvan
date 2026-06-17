## MODIFIED Requirements

### Requirement: Finalizar proceso atómicamente
El sistema DEBE exponer `POST /proceso-x-tarjeta/{id}/finalizar` que acepta un body opcional `{ cantidadReportada: number }`. Cuando se invoca, DEBE establecer `fechaFinal` a la fecha/hora actual en formato compatible con MySQL DATETIME (`YYYY-MM-DD HH:mm:ss`). Si el body incluye `cantidadReportada`, DEBE actualizar `cantidadRealizada = cantidadReportada` y sumar `cantidadReportada` a `cantidadRegistrada`, siempre que `cantidadRegistrada + cantidadReportada <= cantidad`. Si además el proceso está activo (`fechaInicio != null`), DEBE calcular `duracionSesion = (ahora - fechaInicio) / 1000` y acumularlo en `tiempoConsumido`. Si el proceso está en pausa (`fechaInicio == null` con `cantidadRegistrada > 0`), DEBE permitir finalizar sin acumular tiempo de sesión. Si no se provee `cantidadReportada`, NO DEBE modificar `cantidadRealizada` ni `cantidadRegistrada` ni `tiempoConsumido`. La tarjeta DEBE pasar a `finalizada` solo cuando TODOS los procesos de la tarjeta tengan `cantidadRegistrada == cantidad`.

#### Scenario: Finalizar proceso en ejecución exitosamente (sin cantidadReportada)
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/finalizar` para un proceso con `fechaInicio` seteada y `fechaFinal = null`
- **AND** el body NO incluye `cantidadReportada`
- **THEN** el sistema DEBE establecer `fechaFinal` a la fecha/hora actual en formato `YYYY-MM-DD HH:mm:ss`
- **AND** NO DEBE modificar `cantidadRealizada`, `cantidadRegistrada` ni `tiempoConsumido`
- **AND** DEBE retornar el `ProcesoXTarjeta` actualizado con código 200

#### Scenario: Finalizar proceso en ejecución con cantidadReportada
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/finalizar` para un proceso con `fechaInicio` seteada y `fechaFinal = null`
- **AND** el body incluye `{ cantidadReportada: 40 }`
- **THEN** el sistema DEBE establecer `fechaFinal` a la fecha/hora actual
- **AND** DEBE establecer `cantidadRealizada = 40`
- **AND** DEBE sumar 40 a `cantidadRegistrada`
- **AND** DEBE acumular la duración de la sesión en `tiempoConsumido`
- **AND** DEBE retornar el `ProcesoXTarjeta` actualizado con código 200

#### Scenario: Finalizar proceso con cantidadReportada que excede el total
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/finalizar` para un proceso con `cantidad = 100` y `cantidadRegistrada = 80`
- **AND** el body incluye `{ cantidadReportada: 30 }`
- **THEN** el sistema DEBE retornar error 422 Unprocessable Entity
- **AND** NO DEBE modificar `fechaFinal`, `cantidadRealizada`, `cantidadRegistrada` ni `tiempoConsumido`

#### Scenario: Finalizar proceso con parada registrada y sin cantidadReportada
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/finalizar` para un proceso que tiene paradas registradas
- **AND** `cantidadRegistrada < cantidad` (no se completó)
- **AND** el body NO incluye `cantidadReportada`
- **THEN** el sistema DEBE establecer `fechaFinal`
- **AND** `cantidadRegistrada` NO DEBE modificarse (queda como estaba)
- **AND** el proceso queda finalizado con la cantidad parcial

#### Scenario: Finalizar proceso en pausa con cantidadReportada
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/finalizar` para un proceso con `fechaInicio = null` y `cantidadRegistrada > 0`
- **AND** el body incluye `{ cantidadReportada: 10 }`
- **THEN** el sistema DEBE establecer `fechaFinal`
- **AND** DEBE actualizar cantidades
- **AND** NO DEBE acumular tiempo de sesión (no hay sesión activa)
- **AND** DEBE retornar el `ProcesoXTarjeta` actualizado con código 200

#### Scenario: Finalizar proceso no iniciado
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/finalizar` para un proceso con `fechaInicio = null` y `cantidadRegistrada = 0`
- **THEN** el sistema DEBE retornar error 409 Conflict

#### Scenario: Finalizar proceso ya finalizado
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/finalizar` para un proceso con `fechaFinal` ya seteada
- **THEN** el sistema DEBE retornar error 409 Conflict

#### Scenario: Finalizar último proceso actualiza tarjeta a finalizada
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/finalizar` para un proceso
- **AND** después de finalizar, todos los procesos de la tarjeta tienen `cantidadRegistrada == cantidad`
- **THEN** el sistema DEBE establecer `TarjetaDeProduccion.estado = 'finalizada'`

#### Scenario: Tarjeta no finaliza si hay procesos con cantidad incompleta
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/finalizar` para un proceso
- **AND** después de finalizar, algún proceso de la tarjeta tiene `cantidadRegistrada < cantidad`
- **THEN** el sistema NO DEBE cambiar el estado de la tarjeta (sigue en `en_proceso`)

#### Scenario: Finalizar proceso con ID inexistente
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/finalizar` con un `id` que no existe
- **THEN** el sistema DEBE retornar error 404 Not Found
