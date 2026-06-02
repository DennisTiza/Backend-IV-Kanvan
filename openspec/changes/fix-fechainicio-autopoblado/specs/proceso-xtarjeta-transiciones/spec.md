## ADDED Requirements

### Requirement: fechaInicio solo se asigna en iniciar
El sistema DEBE garantizar que `fechaInicio` en `proceso_x_tarjeta` sea NULL al crear el registro y solo se asigne cuando el operario ejecuta `POST /proceso-x-tarjeta/{id}/iniciar`. Ni la creación del registro ni la base de datos deben auto-asignar un valor.

#### Scenario: Crear proceso_x_tarjeta sin fechaInicio automática
- **WHEN** se crea un `ProcesoXTarjeta` sin especificar `fechaInicio`
- **THEN** el campo `fechaInicio` en la base de datos DEBE quedar como `NULL`
- **AND** la base de datos NO DEBE tener `DEFAULT CURRENT_TIMESTAMP` en la columna

#### Scenario: Iniciar asigna fechaInicio correctamente
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/iniciar` para un proceso con `fechaInicio = null`
- **THEN** el sistema DEBE asignar `fechaInicio` a la fecha/hora actual en formato `YYYY-MM-DD HH:mm:ss`
- **AND** el valor DEBE ser el momento del clic en Iniciar, no el de creación del registro

## MODIFIED Requirements

### Requirement: Iniciar proceso atómicamente

> Versión original: El sistema DEBE exponer `POST /proceso-x-tarjeta/{id}/iniciar` que establece `fechaInicio` a la fecha/hora actual.

Versión modificada: El sistema DEBE exponer `POST /proceso-x-tarjeta/{id}/iniciar` que establece `fechaInicio` a la fecha/hora actual en formato compatible con MySQL DATETIME (`YYYY-MM-DD HH:mm:ss`). El sistema DEBE garantizar que `fechaInicio` sea `null` antes de esta operación (es decir, al crear el registro no se asigna).

#### Scenario: Iniciar proceso pendiente exitosamente (modificado)
- **WHEN** se envía `POST /proceso-x-tarjeta/{id}/iniciar` para un proceso con `fechaInicio = null`
- **AND** el proceso anterior en la tarjeta (si existe) tiene `fechaFinal` seteada
- **AND** `fechaInicio` era `null` desde la creación del registro (no se auto-pobló)
- **THEN** el sistema DEBE establecer `fechaInicio` a la fecha/hora actual en formato `YYYY-MM-DD HH:mm:ss`
- **AND** DEBE retornar el `ProcesoXTarjeta` actualizado con código 200
