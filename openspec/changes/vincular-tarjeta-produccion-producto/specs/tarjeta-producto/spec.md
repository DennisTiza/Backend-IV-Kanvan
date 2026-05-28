## ADDED Requirements

### Requirement: Tarjeta de producción vinculada a producto
El sistema SHALL permitir asociar cada `TarjetaDeProduccion` a un `Producto` mediante un campo `productoId`.
El sistema SHALL rechazar la creación de una tarjeta si el `productoId` no corresponde a un producto existente.

#### Scenario: Crear tarjeta con producto válido
- **WHEN** un administrador crea una tarjeta de producción con `productoId` de un producto existente
- **THEN** el sistema crea la tarjeta con el producto asociado

#### Scenario: Crear tarjeta con producto inexistente
- **WHEN** un administrador crea una tarjeta de producción con un `productoId` que no existe
- **THEN** el sistema retorna error 422

### Requirement: Recuperar producto desde tarjeta
El sistema SHALL permitir obtener el producto asociado a una tarjeta mediante la relación `belongsTo`.

#### Scenario: Obtener producto de una tarjeta
- **WHEN** se consulta una tarjeta de producción incluyendo la relación "producto"
- **THEN** el sistema retorna los datos del producto asociado

### Requirement: Generar ProcesoXTarjeta desde ProductoXProceso
El sistema NO SHALL generar automáticamente los ProcesoXTarjeta al crear la tarjeta (se crean paso por paso desde el frontend usando los endpoints de relación existentes).
El sistema SHALL permitir al frontend consultar los procesos de un producto (`ProductoXProceso`) para que el frontend sepa qué procesos crear.

#### Scenario: Consultar procesos de un producto para crear tarjeta
- **WHEN** el frontend consulta `GET /productos/{id}/producto-x-procesos?filter[include]=proceso`
- **THEN** el sistema retorna la lista de procesos con su orden, cantidad estimada y tiempo estimado
