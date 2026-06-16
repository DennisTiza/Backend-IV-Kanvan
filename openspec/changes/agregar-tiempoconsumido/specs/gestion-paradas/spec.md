## ADDED Requirements

### Requirement: Campo tiempoConsumido en ProcesoXTarjeta
El modelo `ProcesoXTarjeta` DEBE tener el campo `tiempoConsumido` de tipo `number` que almacena el tiempo real consumido en segundos, acumulado a través de paradas y finalizaciones. El campo `tiempo` existente se conserva como estimado en minutos.

#### Scenario: Modelo incluye tiempoConsumido
- **WHEN** se inspecciona el modelo `ProcesoXTarjeta`
- **THEN** DEBE existir propiedad `tiempoConsumido` de tipo `number`

## MODIFIED Requirements

### Requirement: Campos de cantidad en ProcesoXTarjeta
El modelo `ProcesoXTarjeta` DEBE tener los campos: `cantidad` (number, meta total del proceso, heredada de la tarjeta), `cantidadRealizada` (number, último delta reportado en una parada), `cantidadRegistrada` (number, acumulado histórico de todas las paradas del proceso, nunca decrece), `tiempoConsumido` (number, tiempo real consumido en segundos).

#### Scenario: Modelo incluye campos de cantidad
- **WHEN** se inspecciona el modelo `ProcesoXTarjeta`
- **THEN** DEBE existir propiedad `cantidad` de tipo `number`
- **AND** DEBE existir propiedad `cantidadRealizada` de tipo `number`
- **AND** DEBE existir propiedad `cantidadRegistrada` de tipo `number`
- **AND** DEBE existir propiedad `tiempoConsumido` de tipo `number`

#### Scenario: Valores iniciales de cantidad
- **WHEN** se crea un `ProcesoXTarjeta`
- **THEN** `cantidad` DEBE heredar el valor de `TarjetaDeProduccion.cantidad`
- **AND** `cantidadRealizada` DEBE inicializarse en `0`
- **AND** `cantidadRegistrada` DEBE inicializarse en `0`
- **AND** `tiempoConsumido` DEBE inicializarse en `0`

### Requirement: POST /proceso-x-tarjeta/{id}/registrar-parada
El sistema DEBE exponer `POST /proceso-x-tarjeta/{id}/registrar-parada` que registra una parada intermedia sin finalizar el proceso. El body DEBE contener `{ cantidadReportada: number, codigoDeParadaId: number }`. El endpoint DEBE: crear un registro en `Parada`, actualizar `cantidadRealizada = cantidadReportada`, actualizar `cantidadRegistrada = cantidadRegistrada + cantidadReportada`, calcular `duracionSesion = (ahora - fechaInicio) / 1000` y acumularlo en `tiempoConsumido`, establecer `fechaInicio = null`. Si `cantidadRegistrada >= cantidad` después de la actualización, DEBE asignar `fechaFinal = ahora`. NO DEBE cambiar el estado de la tarjeta.

#### Scenario: Registrar parada exitosamente
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/registrar-parada` con `{ cantidadReportada: 40, codigoDeParadaId: 3 }` para un proceso en ejecución
- **THEN** el sistema DEBE crear un registro en `Parada` con `cantidadReportada = 40` y `codigoDeParadaId = 3`
- **AND** DEBE actualizar `ProcesoXTarjeta.cantidadRealizada = 40`
- **AND** DEBE actualizar `ProcesoXTarjeta.cantidadRegistrada += 40`
- **AND** DEBE acumular la duración de la sesión en `tiempoConsumido`
- **AND** DEBE establecer `fechaInicio = null`
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

#### Scenario: Registrar parada que completa la cantidad auto-asigna fechaFinal
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/registrar-parada` con `cantidadReportada` tal que `cantidadRegistrada + cantidadReportada >= cantidad`
- **THEN** el sistema DEBE asignar `fechaFinal = ahora`
