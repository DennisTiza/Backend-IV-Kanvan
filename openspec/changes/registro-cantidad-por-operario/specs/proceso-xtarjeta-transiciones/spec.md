## MODIFIED Requirements

### Requirement: Finalizar proceso atómicamente con operario

El sistema DEBE exponer `POST /proceso-x-tarjeta/{id}/finalizar` que acepta un body opcional `{ cantidadReportada: number, operarioId: number }`. Cuando se invoca, DEBE establecer `fechaFinal` a la fecha/hora actual en formato compatible con MySQL DATETIME (`YYYY-MM-DD HH:mm:ss`). Si el body incluye `cantidadReportada`, DEBE actualizar `cantidadRealizada = cantidadReportada` y sumar `cantidadReportada` a `cantidadRegistrada`, siempre que `cantidadRegistrada + cantidadReportada <= cantidad`. Si `cantidadReportada` está presente, DEBE crear un `RegistroDeCantidad` con `procesoXTarjetaId`, `operarioId`, `cantidad = cantidadReportada`, `tipo = 'produccion'` y `fecha` actual. Si no se provee `cantidadReportada`, NO DEBE modificar `cantidadRealizada` ni `cantidadRegistrada`, y NO DEBE crear `RegistroDeCantidad`. La tarjeta DEBE pasar a `finalizada` solo cuando TODOS los procesos de la tarjeta tengan `cantidadRegistrada == cantidad`.

#### Scenario: Finalizar proceso en ejecución con cantidadReportada y operarioId
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/finalizar` para un proceso con `fechaInicio` seteada y `fechaFinal = null`
- **AND** el body incluye `{ cantidadReportada: 40, operarioId: 1 }`
- **THEN** el sistema DEBE establecer `fechaFinal` a la fecha/hora actual
- **AND** DEBE establecer `cantidadRealizada = 40`
- **AND** DEBE sumar 40 a `cantidadRegistrada`
- **AND** DEBE crear un `RegistroDeCantidad` con `procesoXTarjetaId = id`, `operarioId = 1`, `cantidad = 40`, `tipo = 'produccion'`
- **AND** DEBE retornar el `ProcesoXTarjeta` actualizado con código 200

#### Scenario: Finalizar proceso en ejecución sin cantidadReportada
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/finalizar` para un proceso con `fechaInicio` seteada y `fechaFinal = null`
- **AND** el body NO incluye `cantidadReportada`
- **THEN** el sistema DEBE establecer `fechaFinal` a la fecha/hora actual en formato `YYYY-MM-DD HH:mm:ss`
- **AND** NO DEBE modificar `cantidadRealizada` ni `cantidadRegistrada`
- **AND** NO DEBE crear `RegistroDeCantidad`
- **AND** DEBE retornar el `ProcesoXTarjeta` actualizado con código 200

#### Scenario: Finalizar proceso con cantidadReportada que excede el total
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/finalizar` para un proceso con `cantidad = 100` y `cantidadRegistrada = 80`
- **AND** el body incluye `{ cantidadReportada: 30, operarioId: 1 }`
- **THEN** el sistema DEBE retornar error 422 Unprocessable Entity
- **AND** NO DEBE modificar `fechaFinal`, `cantidadRealizada`, `cantidadRegistrada`
- **AND** NO DEBE crear `RegistroDeCantidad`

#### Scenario: Finalizar proceso sin operarioId teniendo cantidadReportada
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/finalizar` con `cantidadReportada` presente
- **AND** el body NO incluye `operarioId`
- **THEN** el sistema DEBE retornar error 422 Unprocessable Entity
- **AND** NO DEBE crear `RegistroDeCantidad`
