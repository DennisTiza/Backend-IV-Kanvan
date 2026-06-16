## ADDED Requirements

### Requirement: Modelo RegistroDeCantidad con trazabilidad por operario

El sistema DEBE tener una entidad `RegistroDeCantidad` que persista cada reporte de cantidad realizado por un operario sobre un proceso. La entidad DEBE contener: `id` (autogenerado), `procesoXTarjetaId` (FK a ProcesoXTarjeta), `operarioId` (FK a Operario), `cantidad` (number, cantidad reportada en este registro), `tipo` (enum: 'produccion' | 'parada'), `codigoDeParadaId` (FK a CodigoDeParada, nullable — solo si tipo = 'parada'), `fecha` (datetime, cuándo se hizo el reporte). `RegistroDeCantidad` DEBE pertenecer a `ProcesoXTarjeta` (belongsTo), a `Operario` (belongsTo), y opcionalmente a `CodigoDeParada` (belongsTo).

#### Scenario: Estructura del modelo RegistroDeCantidad
- **WHEN** se inspecciona el modelo `RegistroDeCantidad`
- **THEN** DEBE tener propiedades `id`, `procesoXTarjetaId`, `operarioId`, `cantidad`, `tipo`, `codigoDeParadaId`, `fecha`
- **AND** `procesoXTarjetaId` DEBE ser FK a `ProcesoXTarjeta`
- **AND** `operarioId` DEBE ser FK a `Operario`
- **AND** `codigoDeParadaId` DEBE ser FK a `CodigoDeParada` (nullable)

#### Scenario: Persistencia de registro de cantidad
- **WHEN** se crea un `RegistroDeCantidad` con datos válidos
- **THEN** el sistema DEBE persistirlo en la base de datos
- **AND** DEBE asignar un `id` autogenerado

### Requirement: GET /proceso-x-tarjeta/{id}/registros-cantidad

El sistema DEBE exponer `GET /proceso-x-tarjeta/{id}/registros-cantidad` que devuelve todos los registros de cantidad de un proceso, ordenados por `fecha ASC`. Cada registro DEBE incluir los objetos `Operario` y `CodigoDeParada` relacionados anidados.

#### Scenario: Obtener registros de cantidad de un proceso
- **WHEN** se envía `GET /proceso-x-tarjeta/{id}/registros-cantidad`
- **THEN** el sistema DEBE retornar un array con todos los `RegistroDeCantidad` del proceso
- **AND** DEBEN estar ordenados por `fecha ASC`
- **AND** cada elemento DEBE incluir `operario` con el objeto `Operario` relacionado `{ id, nombre, apellido }`
- **AND** si `tipo = 'parada'`, DEBE incluir `codigoDeParada` con el objeto `CodigoDeParada` relacionado

#### Scenario: Proceso sin registros
- **WHEN** se envía `GET /proceso-x-tarjeta/{id}/registros-cantidad` para un proceso sin registros
- **THEN** el sistema DEBE retornar un array vacío

### Requirement: Consulta de cantidad total producida por operario

El sistema DEBE permitir consultar, para un proceso dado, cuánta cantidad total ha reportado cada operario, sumando todos sus registros de cantidad (tanto de tipo 'produccion' como 'parada').

#### Scenario: Sumar cantidad por operario
- **WHEN** se consultan los registros de cantidad de un proceso
- **THEN** DEBE ser posible agrupar por `operarioId` y sumar `cantidad` para obtener el total por operario
