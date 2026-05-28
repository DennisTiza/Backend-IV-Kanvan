## ADDED Requirements

### Requirement: Operario como usuario con rol
El sistema SHALL permitir que un usuario con rol "operario" sea asignado como responsable de un proceso en una tarjeta de producción.
El modelo `Operario` SHALL ser eliminado y reemplazado por `Usuario.usuarioId` en `ProcesoXTarjeta`.

#### Scenario: Asignar operario a un proceso de tarjeta
- **WHEN** se crea o actualiza un `ProcesoXTarjeta` con un `usuarioId` válido
- **THEN** el sistema asigna ese usuario como responsable del proceso

#### Scenario: Obtener datos del operario desde ProcesoXTarjeta
- **WHEN** se consulta un `ProcesoXTarjeta` incluyendo la relación "usuario"
- **THEN** el sistema retorna el nombre, apellido y correo del usuario asignado

### Requirement: Eliminación de entidad Operario
El sistema NO SHALL tener el modelo, repositorio, controlador ni endpoints de `Operario`.
Los endpoints `/operario/*` SHALL ser eliminados.

#### Scenario: Endpoint de operarios ya no existe
- **WHEN** se intenta acceder a `GET /operario`
- **THEN** el sistema retorna error 404

### Requirement: Usuarios con rol operario pueden listar tarjetas
El sistema SHALL permitir listar tarjetas de producción filtradas por estado mediante `GET /tarjeta-de-produccion?filter[where][estado]=valor`.

#### Scenario: Filtrar tarjetas por estado "por_hacer"
- **WHEN** se consulta `GET /tarjeta-de-produccion?filter[where][estado]=por_hacer`
- **THEN** el sistema retorna solo las tarjetas con estado "por_hacer"

#### Scenario: Filtrar tarjetas por estado "en_ejecucion"
- **WHEN** se consulta `GET /tarjeta-de-produccion?filter[where][estado]=en_ejecucion`
- **THEN** el sistema retorna solo las tarjetas con estado "en_ejecucion"

#### Scenario: Filtrar tarjetas por estado "finalizado"
- **WHEN** se consulta `GET /tarjeta-de-produccion?filter[where][estado]=finalizado`
- **THEN** el sistema retorna solo las tarjetas con estado "finalizado"
