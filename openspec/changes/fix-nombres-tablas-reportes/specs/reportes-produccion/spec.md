## MODIFIED Requirements

### Requirement: Queries SQL usan nombres de tabla correctos

El sistema DEBE usar los nombres de tabla reales en MySQL para las consultas SQL de los reportes. Los nombres corresponden al modelo LoopBack 4, almacenados en minúscula sin separadores.

| Modelo | Tabla en MySQL |
|---|---|
| `RegistroDeCantidad` | `registrodecanidad` |
| `ProcesoXTarjeta` | `procesoxtarjeta` |
| `CodigoDeParada` | `codigodeparada` |
| `TarjetaDeProduccion` | `tarjetadeproduccion` |
| `Operario` | `operario` |
| `Proceso` | `proceso` |
| `Parada` | `parada` |

#### Scenario: Endpoint total-por-dia usa tabla correcta

- **WHEN** se ejecuta `GET /reportes/total-por-dia`
- **THEN** la consulta SQL DEBE usar `registrodecanidad` como nombre de tabla para `RegistroDeCantidad`

#### Scenario: Endpoint por-operario usa tablas correctas

- **WHEN** se ejecuta `GET /reportes/por-operario`
- **THEN** la consulta SQL DEBE usar registrodecanidad, procesoxtarjeta, operario, proceso como nombres de tabla

#### Scenario: Endpoint tiempos usa tablas correctas

- **WHEN** se ejecuta `GET /reportes/tiempos`
- **THEN** la consulta SQL DEBE usar procesoxtarjeta, proceso, tarjetadeproduccion como nombres de tabla

#### Scenario: Endpoint paradas usa tabla correcta

- **WHEN** se ejecuta `GET /reportes/paradas`
- **THEN** la consulta SQL DEBE usar codigodeparada y parada como nombres de tabla

#### Scenario: Endpoints devuelven 200 en lugar de 500

- **WHEN** se consulta cualquiera de los 4 endpoints de reportes
- **THEN** el sistema DEBE retornar un HTTP 200 con los datos correspondientes
- **AND** NO DEBE retornar un error 500 por tabla inexistente
