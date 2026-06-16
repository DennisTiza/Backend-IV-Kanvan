## MODIFIED Requirements

### Requirement: Modelo Parada con operario

El sistema DEBE tener una entidad `Parada` que registre cada evento de parada ocurrido durante la ejecución de un proceso. La entidad DEBE contener: `id` (autogenerado), `procesoXTarjetaId` (FK a ProcesoXTarjeta), `codigoDeParadaId` (FK a CodigoDeParada), `cantidadReportada` (number, cuánto reportó el operario en esta parada), `fecha` (datetime, cuándo ocurrió la parada), `operarioId` (FK a Operario, qué operario reportó la parada). `Parada` DEBE pertenecer a `ProcesoXTarjeta` (belongsTo), a `CodigoDeParada` (belongsTo) y a `Operario` (belongsTo).

#### Scenario: Estructura del modelo Parada con operario
- **WHEN** se inspecciona el modelo `Parada`
- **THEN** DEBE tener propiedades `id`, `procesoXTarjetaId`, `codigoDeParadaId`, `cantidadReportada`, `fecha`, `operarioId`
- **AND** `procesoXTarjetaId` DEBE ser FK a `ProcesoXTarjeta`
- **AND** `codigoDeParadaId` DEBE ser FK a `CodigoDeParada`
- **AND** `operarioId` DEBE ser FK a `Operario`

#### Scenario: Persistencia de parada con operario
- **WHEN** se crea un registro `Parada` con datos válidos incluyendo `operarioId`
- **THEN** el sistema DEBE persistirlo en la base de datos
- **AND** DEBE asignar un `id` autogenerado
- **AND** DEBE guardar el `operarioId` correctamente

### Requirement: POST /proceso-x-tarjeta/{id}/registrar-parada con operario

El sistema DEBE exponer `POST /proceso-x-tarjeta/{id}/registrar-parada` que registra una parada intermedia sin finalizar el proceso. El body DEBE contener `{ cantidadReportada: number, codigoDeParadaId: number, operarioId: number }`. El endpoint DEBE: crear un registro en `Parada` con `operarioId` incluido, crear un `RegistroDeCantidad` con `tipo = 'parada'`, actualizar `cantidadRealizada = cantidadReportada`, actualizar `cantidadRegistrada = cantidadRegistrada + cantidadReportada`. NO DEBE asignar `fechaFinal` ni cambiar el estado de la tarjeta.

#### Scenario: Registrar parada exitosamente con operario
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/registrar-parada` con `{ cantidadReportada: 40, codigoDeParadaId: 3, operarioId: 1 }` para un proceso en ejecución
- **THEN** el sistema DEBE crear un registro en `Parada` con `cantidadReportada = 40`, `codigoDeParadaId = 3`, `operarioId = 1`
- **AND** DEBE crear un `RegistroDeCantidad` con `procesoXTarjetaId = id`, `operarioId = 1`, `cantidad = 40`, `tipo = 'parada'`, `codigoDeParadaId = 3`
- **AND** DEBE actualizar `ProcesoXTarjeta.cantidadRealizada = 40`
- **AND** DEBE actualizar `ProcesoXTarjeta.cantidadRegistrada += 40`
- **AND** NO DEBE modificar `fechaFinal` del proceso
- **AND** NO DEBE cambiar el estado de la tarjeta

#### Scenario: Registrar parada sin operarioId
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/registrar-parada` sin incluir `operarioId`
- **THEN** el sistema DEBE retornar error 422 Unprocessable Entity

### Requirement: GET /proceso-x-tarjeta/{id}/paradas con operario

El sistema DEBE exponer `GET /proceso-x-tarjeta/{id}/paradas` que devuelve todas las paradas de un proceso, ordenadas por `fecha ASC`. Cada parada DEBE incluir los objetos `CodigoDeParada` relacionado (`id`, `codigo`, `descripcion`) y `Operario` relacionado (`id`, `nombre`, `apellido`) anidados.

#### Scenario: Obtener paradas de un proceso con operario
- **WHEN** se envía `GET /proceso-x-tarjeta/{id}/paradas`
- **THEN** el sistema DEBE retornar un array con todas las `Parada` del proceso
- **AND** DEBEN estar ordenadas por `fecha ASC`
- **AND** cada elemento DEBE incluir `codigoDeParada` con el objeto `CodigoDeParada` relacionado `{ id, codigo, descripcion }`
- **AND** cada elemento DEBE incluir `operario` con el objeto `Operario` relacionado `{ id, nombre, apellido }`

#### Scenario: Proceso sin paradas
- **WHEN** se envía `GET /proceso-x-tarjeta/{id}/paradas` para un proceso sin paradas
- **THEN** el sistema DEBE retornar un array vacío
