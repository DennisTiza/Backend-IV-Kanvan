## ADDED Requirements

### Requirement: Las fechas en la API deben enviarse en ISO 8601 UTC
La API DEBE devolver todos los campos de tipo DATETIME en formato ISO 8601 con indicador UTC (`...Z`). El ORM NO DEBE aplicar conversión de timezone a los valores antes de serializarlos.

#### Scenario: Fecha almacenada como DATETIME se recibe como UTC
- **WHEN** el backend consulta un registro con `fechaInicio` = `"2026-06-02 11:17:52"` (hora Colombia)
- **THEN** la respuesta JSON DEBE contener `"fechaInicio": "2026-06-02T16:17:52.000Z"`
- **AND** el valor DEBE ser el UTC correcto (sin doble conversión)

### Requirement: El datasource no debe tener configuración de timezone
El datasource MySQL NO DEBE incluir la propiedad `timezone` en su configuración. Los valores DATETIME se almacenan sin timezone en MySQL y deben leerse/escribirse sin transformación del conector.

#### Scenario: Datasource sin timezone
- **WHEN** se inspecciona la configuración del datasource MySQL
- **THEN** la propiedad `timezone` NO DEBE estar presente
- **AND** el conector DEBE tratar los DATETIME como strings sin conversión

### Requirement: El frontend puede asumir UTC en las respuestas
El frontend DEBE interpretar todas las fechas de la API como UTC. Puede usar `new Date(fechaString)` para convertirlas a la hora local del navegador.

#### Scenario: Frontend recibe fecha UTC
- **WHEN** el frontend recibe `"fechaInicio": "2026-06-02T16:17:52.000Z"`
- **AND** ejecuta `new Date("2026-06-02T16:17:52.000Z").getTime()`
- **THEN** el timestamp DEBE ser equivalente a `2026-06-02 11:17:52` en Colombia (UTC-5)
