## ADDED Requirements

### Requirement: fechaInicio debe ser NULL hasta que se inicie el proceso
El campo `fechaInicio` en `proceso_x_tarjeta` DEBE ser NULL al crear el registro. Solo se asigna cuando el operario ejecuta `POST /proceso-x-tarjeta/{id}/iniciar`.

#### Scenario: Crear proceso_x_tarjeta sin fechaInicio
- **WHEN** se crea una `TarjetaDeProduccion` y el sistema genera los registros `ProcesoXTarjeta` hijos
- **THEN** cada `ProcesoXTarjeta` DEBE tener `fechaInicio = null`

#### Scenario: Consultar proceso pendiente retorna fechaInicio null
- **WHEN** se consulta un `ProcesoXTarjeta` que no ha sido iniciado
- **THEN** el campo `fechaInicio` DEBE ser `null`

### Requirement: El modelo TypeScript debe reflejar nulabilidad
El modelo `ProcesoXTarjeta` DEBE declarar `fechaInicio` como campo opcional (nullable) para que LoopBack no lo incluya en el INSERT durante la creación.

#### Scenario: Tipo de fechaInicio es opcional
- **WHEN** se crea un `ProcesoXTarjeta` sin `fechaInicio`
- **THEN** TypeScript NO DEBE requerir el campo
- **AND** LoopBack NO DEBE incluirlo en la sentencia INSERT
