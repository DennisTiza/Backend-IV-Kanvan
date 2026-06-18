## ADDED Requirements

### Requirement: Menú único "Reportes" con tabs

El sistema DEBE tener un único menú "Reportes" que agrupe los 4 reportes gerenciales. El frontend DEBE mostrar los reportes como pestañas (tabs) dentro de este menú: "Total por Día", "Por Operario", "Tiempos" y "Paradas".

#### Scenario: Menú único en base de datos

- **WHEN** se ejecutan los inserts de migración
- **THEN** DEBE existir 1 registro en la tabla `menu` con `Nombre = 'Reportes'`
- **AND** DEBE existir 1 registro en `menu_del_rol` con `rolId = 3` y `Listar = 1`

#### Scenario: Gerente ve menú Reportes

- **WHEN** un usuario con `rolId = 3` inicia sesión
- **THEN** el menú devuelto DEBE incluir "Reportes" con `Listar = 1`

#### Scenario: Los 4 reportes son accesibles desde el menú

- **WHEN** el usuario navega al menú "Reportes"
- **THEN** DEBE poder ver los 4 reportes como pestañas seleccionables
- **AND** cada pestaña DEBE cargar su endpoint correspondiente
