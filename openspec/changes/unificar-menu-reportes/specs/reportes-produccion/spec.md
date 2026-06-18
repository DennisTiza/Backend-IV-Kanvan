## MODIFIED Requirements

### Requirement: Inserts de menú y permisos para gerente

El sistema DEBE incluir scripts SQL para crear **una única entrada** de menú "Reportes" y su permiso asociado para el rol de gerente (id=3) con `Listar = 1`. Los 4 reportes se navegan internamente mediante tabs.

#### Scenario: Menú de reportes existe en base de datos

- **WHEN** se ejecutan los inserts de menú
- **THEN** DEBE existir 1 registro en la tabla `menu` con `Nombre = 'Reportes'`
- **AND** DEBE existir 1 registro en `menu_del_rol` con `rolId = 3` y `Listar = 1`

#### Scenario: Gerente puede acceder a reportes

- **WHEN** un usuario con `rolId = 3` inicia sesión
- **THEN** el menú devuelto DEBE incluir "Reportes" con `Listar = 1`
