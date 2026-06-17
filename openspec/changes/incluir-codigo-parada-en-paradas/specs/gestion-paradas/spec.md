## MODIFIED Requirements

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
