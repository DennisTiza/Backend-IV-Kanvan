## ADDED Requirements

### Requirement: ProcesoXTarjeta tiene campo orden
El modelo `ProcesoXTarjeta` DEBE tener un campo `orden` de tipo `number` que indique la posición secuencial del proceso dentro de la tarjeta de producción.

#### Scenario: Modelo incluye campo orden
- **WHEN** se inspecciona el modelo `ProcesoXTarjeta`
- **THEN** DEBE existir una propiedad `orden` de tipo `number`

#### Scenario: Creación de tarjeta copia orden desde ProductoXProceso
- **WHEN** se crea una `TarjetaDeProduccion` con `productoId` válido
- **THEN** el sistema DEBE crear los registros `ProcesoXTarjeta` correspondientes
- **AND** cada `ProcesoXTarjeta` DEBE tener el valor `orden` copiado desde `ProductoXProceso.orden`

### Requirement: Endpoint por-tarjeta devuelve procesos ordenados
El endpoint `GET /proceso-x-tarjeta/por-tarjeta/{tarjetaId}` DEBE devolver los procesos ordenados por `orden ASC`.

#### Scenario: Procesos ordenados ascendentemente
- **WHEN** se consulta `GET /proceso-x-tarjeta/por-tarjeta/{tarjetaId}`
- **THEN** los resultados DEBEN estar ordenados por `orden` de forma ascendente

#### Scenario: Múltiples tarjetas no se mezclan
- **WHEN** se consulta `GET /proceso-x-tarjeta/por-tarjeta/{tarjetaId}`
- **THEN** solo DEBE devolver procesos pertenecientes a la tarjeta especificada

### Requirement: GET /tarjeta-de-produccion con include respeta orden
El endpoint `GET /tarjeta-de-produccion` con filter `include` DEBE permitir ordenar los `procesoXTarjetas` por `orden ASC` cuando el frontend lo especifique en el scope del include.

#### Scenario: Include con orden funciona
- **WHEN** se consulta `GET /tarjeta-de-produccion?filter={"include":[{"relation":"procesoXTarjetas","scope":{"order":["orden ASC"]}}]}`
- **THEN** los `procesoXTarjetas` incluidos DEBEN aparecer ordenados por `orden ASC`

#### Scenario: Include anidado con operario y proceso funciona
- **WHEN** se consulta `GET /tarjeta-de-produccion?filter={"include":[{"relation":"procesoXTarjetas","scope":{"include":["operario","proceso"],"order":["orden ASC"]}}]}`
- **THEN** los `procesoXTarjetas` DEBEN incluir los objetos `operario` y `proceso` anidados
- **AND** DEBEN estar ordenados por `orden ASC`
