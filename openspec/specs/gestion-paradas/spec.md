## Requirements

### Requirement: Modelo Parada con histórico de paradas
El sistema DEBE tener una entidad `Parada` que registre cada evento de parada ocurrido durante la ejecución de un proceso. La entidad DEBE contener: `id` (autogenerado), `procesoXTarjetaId` (FK a ProcesoXTarjeta), `codigoDeParadaId` (FK a CodigoDeParada), `cantidadReportada` (number, cuánto reportó el operario en esta parada), `fecha` (datetime, cuándo ocurrió la parada). `Parada` DEBE pertenecer a `ProcesoXTarjeta` (belongsTo) y a `CodigoDeParada` (belongsTo).

#### Scenario: Estructura del modelo Parada
- **WHEN** se inspecciona el modelo `Parada`
- **THEN** DEBE tener propiedades `id`, `procesoXTarjetaId`, `codigoDeParadaId`, `cantidadReportada`, `fecha`
- **AND** `procesoXTarjetaId` DEBE ser FK a `ProcesoXTarjeta`
- **AND** `codigoDeParadaId` DEBE ser FK a `CodigoDeParada`

#### Scenario: Persistencia de parada
- **WHEN** se crea un registro `Parada` con datos válidos
- **THEN** el sistema DEBE persistirlo en la base de datos
- **AND** DEBE asignar un `id` autogenerado

### Requirement: Campos de cantidad en ProcesoXTarjeta
El modelo `ProcesoXTarjeta` DEBE tener los campos: `cantidad` (number, meta total del proceso, heredada de la tarjeta), `cantidadRealizada` (number, último delta reportado en una parada), `cantidadRegistrada` (number, acumulado histórico de todas las paradas del proceso, nunca decrece).

#### Scenario: Modelo incluye campos de cantidad
- **WHEN** se inspecciona el modelo `ProcesoXTarjeta`
- **THEN** DEBE existir propiedad `cantidad` de tipo `number`
- **AND** DEBE existir propiedad `cantidadRealizada` de tipo `number`
- **AND** DEBE existir propiedad `cantidadRegistrada` de tipo `number`

#### Scenario: Valores iniciales de cantidad
- **WHEN** se crea un `ProcesoXTarjeta`
- **THEN** `cantidad` DEBE heredar el valor de `TarjetaDeProduccion.cantidad`
- **AND** `cantidadRealizada` DEBE inicializarse en `0`
- **AND** `cantidadRegistrada` DEBE inicializarse en `0`

### Requirement: POST /proceso-x-tarjeta/{id}/registrar-parada
El sistema DEBE exponer `POST /proceso-x-tarjeta/{id}/registrar-parada` que registra una parada intermedia sin finalizar el proceso. El body DEBE contener `{ cantidadReportada: number, codigoDeParadaId: number }`. El endpoint DEBE: crear un registro en `Parada`, actualizar `cantidadRealizada = cantidadReportada`, actualizar `cantidadRegistrada = cantidadRegistrada + cantidadReportada`. NO DEBE asignar `fechaFinal` ni cambiar el estado de la tarjeta.

#### Scenario: Registrar parada exitosamente
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/registrar-parada` con `{ cantidadReportada: 40, codigoDeParadaId: 3 }` para un proceso en ejecución
- **THEN** el sistema DEBE crear un registro en `Parada` con `cantidadReportada = 40` y `codigoDeParadaId = 3`
- **AND** DEBE actualizar `ProcesoXTarjeta.cantidadRealizada = 40`
- **AND** DEBE actualizar `ProcesoXTarjeta.cantidadRegistrada += 40`
- **AND** NO DEBE modificar `fechaFinal` del proceso
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

### Requirement: Eliminar codigoDeParadaId de ProcesoXTarjeta
El modelo `ProcesoXTarjeta` NO DEBE tener el campo `codigoDeParadaId`. Los códigos de parada se gestionan exclusivamente a través de la entidad `Parada`.

#### Scenario: Migración de datos existentes
- **WHEN** se ejecuta la migración
- **THEN** los valores existentes en `ProcesoXTarjeta.codigoDeParadaId` DEBEN copiarse a la tabla `Parada` antes de eliminar la columna
- **AND** la columna `codigoDeParadaId` DEBE ser eliminada de la tabla `ProcesoXTarjeta`

#### Scenario: Modelo sin codigoDeParadaId
- **WHEN** se inspecciona el modelo `ProcesoXTarjeta`
- **THEN** NO DEBE existir la propiedad `codigoDeParadaId`

### Requirement: GET /proceso-x-tarjeta/{id}/paradas
El sistema DEBE exponer `GET /proceso-x-tarjeta/{id}/paradas` que devuelve todas las paradas de un proceso, ordenadas por `fecha ASC`. Cada parada DEBE incluir el objeto `CodigoDeParada` relacionado (`id`, `codigo`, `descripcion`) anidado en la propiedad `codigoDeParada`.

#### Scenario: Obtener paradas de un proceso
- **WHEN** se envía `GET /proceso-x-tarjeta/{id}/paradas`
- **THEN** el sistema DEBE retornar un array con todas las `Parada` del proceso
- **AND** DEBEN estar ordenadas por `fecha ASC`
- **AND** cada elemento DEBE incluir `codigoDeParada` con el objeto `CodigoDeParada` relacionado `{ id, codigo, descripcion }`

#### Scenario: Proceso sin paradas
- **WHEN** se envía `GET /proceso-x-tarjeta/{id}/paradas` para un proceso sin paradas
- **THEN** el sistema DEBE retornar un array vacío
