## ADDED Requirements

### Requirement: Menu tiene campo ruta
El modelo `Menu` DEBE incluir un campo `ruta` de tipo string obligatorio que represente la URL del frontend a la que navega ese menú.

#### Scenario: Crear menu con ruta
- **WHEN** se crea un nuevo `Menu` con `ruta: "/produccion/tarjetas"`
- **THEN** el registro se guarda correctamente con la ruta asociada

#### Scenario: Crear menu sin ruta
- **WHEN** se intenta crear un `Menu` sin proporcionar `ruta`
- **THEN** el sistema rechaza la operación con error de validación

### Requirement: Menu tiene campo icono (opcional)
El modelo `Menu` DEBE incluir un campo `icono` de tipo string opcional que represente el icono visual del menú.

#### Scenario: Crear menu con icono
- **WHEN** se crea un `Menu` con `icono: "dashboard"`
- **THEN** el registro se guarda correctamente con el icono asociado

#### Scenario: Crear menu sin icono
- **WHEN** se crea un `Menu` sin proporcionar `icono`
- **THEN** el registro se guarda exitosamente con `icono` como null

### Requirement: Login devuelve menus con rutas e iconos
El endpoint `POST /identificar-usuario` DEBE devolver los objetos `MenuDelRol` incluyendo los campos `ruta` e `icono` del `Menu` relacionado.

#### Scenario: Login exitoso con menus
- **WHEN** un usuario con rol asociado inicia sesión exitosamente
- **THEN** la respuesta incluye un array `menu` donde cada objeto contiene `ruta` e `icono` del Menu correspondiente

#### Scenario: Menu sin icono en login
- **WHEN** un usuario tiene un menú sin `icono` definido
- **THEN** la respuesta incluye ese menú con `icono` como null

### Requirement: Redireccion post-login
El endpoint `POST /identificar-usuario` DEBE devolver un campo `primeraRuta` con la ruta del primer menú disponible del usuario, para que el frontend pueda redirigir inmediatamente.

#### Scenario: Usuario con menus redirige al primero
- **WHEN** un usuario con permisos inicia sesión
- **THEN** la respuesta incluye `primeraRuta` con el valor del primer menú en el array
