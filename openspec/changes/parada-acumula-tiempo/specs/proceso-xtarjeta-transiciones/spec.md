## MODIFIED Requirements

### Requirement: Finalizar proceso atómicamente
El sistema DEBE exponer `POST /proceso-x-tarjeta/{id}/finalizar` que acepta un body opcional `{ cantidadReportada: number }`. Cuando se invoca, DEBE establecer `fechaFinal` a la fecha/hora actual. DEBE permitir finalizar procesos en ejecución (con `fechaInicio != null`) y procesos en pausa (con `fechaInicio == null` y `cantidadRegistrada > 0`). Si el body incluye `cantidadReportada`: si el proceso está activo (`fechaInicio != null`), DEBE calcular `duracionSesion = (ahora - fechaInicio) / 1000` y sumarlo a `tiempo`, actualizar `cantidadRealizada = cantidadReportada`, sumar `cantidadReportada` a `cantidadRegistrada`. Si el proceso está en pausa (`fechaInicio == null`), solo actualizar `cantidadRealizada` y `cantidadRegistrada` sin calcular tiempo. Si no se provee `cantidadReportada`, NO DEBE modificar `cantidadRealizada` ni `cantidadRegistrada`. La tarjeta DEBE pasar a `finalizada` solo cuando TODOS los procesos tengan `cantidadRegistrada == cantidad`.

#### Scenario: Finalizar proceso activo con cantidadReportada
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/finalizar` con `{ cantidadReportada: 40 }` para un proceso con `fechaInicio != null`
- **THEN** el sistema DEBE calcular `duracionSesion = (now - fechaInicio) / 1000`
- **AND** DEBE sumar `duracionSesion` a `tiempo`
- **AND** DEBE establecer `cantidadRealizada = 40`
- **AND** DEBE sumar 40 a `cantidadRegistrada`
- **AND** DEBE establecer `fechaFinal = now`

#### Scenario: Finalizar proceso en pausa con cantidadReportada
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/finalizar` con `{ cantidadReportada: 40 }` para un proceso con `fechaInicio == null` y `cantidadRegistrada > 0`
- **THEN** el sistema DEBE establecer `cantidadRealizada = 40`
- **AND** DEBE sumar 40 a `cantidadRegistrada`
- **AND** NO DEBE modificar `tiempo`
- **AND** DEBE establecer `fechaFinal = now`

#### Scenario: Finalizar proceso en pausa sin cantidadReportada
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/finalizar` para un proceso con `fechaInicio == null` y `cantidadRegistrada > 0`
- **AND** el body NO incluye `cantidadReportada`
- **THEN** el sistema DEBE establecer `fechaFinal = now`
- **AND** NO DEBE modificar `tiempo`, `cantidadRealizada` ni `cantidadRegistrada`

#### Scenario: Finalizar proceso activo sin cantidadReportada
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/finalizar` para un proceso con `fechaInicio != null` y `fechaFinal == null`
- **AND** el body NO incluye `cantidadReportada`
- **THEN** el sistema DEBE establecer `fechaFinal = now`
- **AND** NO DEBE modificar `tiempo`, `cantidadRealizada` ni `cantidadRegistrada`

#### Scenario: Finalizar proceso no iniciado
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/finalizar` para un proceso con `fechaInicio == null` y `cantidadRegistrada == 0`
- **THEN** el sistema DEBE retornar error 409 Conflict

#### Scenario: Finalizar proceso ya finalizado
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/finalizar` para un proceso con `fechaFinal` seteada
- **THEN** el sistema DEBE retornar error 409 Conflict

#### Scenario: Finalizar último proceso actualiza tarjeta a finalizada
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/finalizar` para un proceso
- **AND** después de finalizar, todos los procesos tienen `cantidadRegistrada == cantidad`
- **THEN** el sistema DEBE establecer `TarjetaDeProduccion.estado = 'finalizada'`

#### Scenario: Tarjeta no finaliza si hay procesos incompletos
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/finalizar` para un proceso
- **AND** después de finalizar, algún proceso tiene `cantidadRegistrada < cantidad`
- **THEN** el sistema NO DEBE cambiar el estado de la tarjeta

#### Scenario: Finalizar proceso con ID inexistente
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/finalizar` con un `id` que no existe
- **THEN** el sistema DEBE retornar error 404 Not Found
