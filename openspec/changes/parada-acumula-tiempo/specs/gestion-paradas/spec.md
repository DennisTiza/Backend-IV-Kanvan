## MODIFIED Requirements

### Requirement: POST /proceso-x-tarjeta/{id}/registrar-parada
El sistema DEBE exponer `POST /proceso-x-tarjeta/{id}/registrar-parada` que registra una parada intermedia. El body DEBE contener `{ cantidadReportada: number, codigoDeParadaId: number }`. El endpoint DEBE: crear un registro en `Parada`, calcular `duracionSesion = (ahora - fechaInicio) / 1000` y sumarlo a `ProcesoXTarjeta.tiempo`, establecer `ProcesoXTarjeta.fechaInicio = null` (proceso pausado), actualizar `cantidadRealizada = cantidadReportada`, actualizar `cantidadRegistrada += cantidadReportada`. Si `cantidadRegistrada >= cantidad` después de la suma, DEBE establecer `fechaFinal = now`. NO DEBE cambiar el estado de la tarjeta.

#### Scenario: Registrar parada exitosamente
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/registrar-parada` con `{ cantidadReportada: 40, codigoDeParadaId: 3 }` para un proceso en ejecución
- **THEN** el sistema DEBE crear un registro en `Parada` con `cantidadReportada = 40` y `codigoDeParadaId = 3`
- **AND** DEBE calcular `duracionSesion = (now - fechaInicio) / 1000`
- **AND** DEBE sumar `duracionSesion` a `ProcesoXTarjeta.tiempo`
- **AND** DEBE establecer `ProcesoXTarjeta.fechaInicio = null`
- **AND** DEBE actualizar `ProcesoXTarjeta.cantidadRealizada = 40`
- **AND** DEBE actualizar `ProcesoXTarjeta.cantidadRegistrada += 40`
- **AND** el proceso queda en pausa (sin `fechaFinal`, `fechaInicio = null`)
- **AND** NO DEBE cambiar el estado de la tarjeta

#### Scenario: Registrar parada completando la cantidad
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/registrar-parada` para un proceso con `cantidad = 100` y `cantidadRegistrada = 60`
- **AND** `cantidadReportada = 40`
- **THEN** el sistema DEBE actualizar `cantidadRegistrada = 100`
- **AND** DEBE establecer `fechaFinal = now` (auto-finalizar)
- **AND** NO DEBE cambiar el estado de la tarjeta

#### Scenario: Registrar parada supera cantidad total
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/registrar-parada` con `cantidadReportada + cantidadRegistrada > cantidad`
- **THEN** el sistema DEBE retornar error 422 Unprocessable Entity

#### Scenario: Registrar parada en proceso no iniciado
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/registrar-parada` para un proceso sin `fechaInicio`
- **THEN** el sistema DEBE retornar error 409 Conflict

#### Scenario: Registrar parada en proceso ya finalizado
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/registrar-parada` para un proceso con `fechaFinal`
- **THEN** el sistema DEBE retornar error 409 Conflict

#### Scenario: Registrar parada con ID inexistente
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/registrar-parada` con un `id` que no existe
- **THEN** el sistema DEBE retornar error 404 Not Found
