## 1. Modelo y Base de Datos

- [x] 1.1 Agregar propiedades `ruta` (required) e `icono` (optional) al modelo `Menu` en `src/models/menu.model.ts`
- [ ] 1.2 Ejecutar migración SQL en la base de datos: `ALTER TABLE menu ADD COLUMN ruta VARCHAR(255) NOT NULL DEFAULT '/', ADD COLUMN icono VARCHAR(100) NULL;`
- [ ] 1.3 Actualizar datos existentes de menús con rutas significativas (según lo que el frontend necesite)

## 2. Relación MenuDelRol → Menu

- [x] 2.1 Agregar decorador `@belongsTo(() => Menu)` en `MenuDelRol` para la propiedad `menuId`
- [x] 2.2 Agregar la relación `menu` en el repositorio `MenuDelRolRepository` (incluir `include` en `const relaciones`)

## 3. Servicio de Seguridad

- [x] 3.1 Modificar `ConsultarPermisosDeMenuPorUsuario` en `src/services/seguridad-usuario.service.ts` para incluir los datos del `Menu` relacionado (especialmente `ruta` e `icono`) en el resultado de `MenuDelRol`

## 4. Endpoint de Login

- [x] 4.1 Modificar `POST /identificar-usuario` en `src/controllers/usuario.controller.ts` para incluir `ruta` e `icono` dentro de cada objeto del array `menu` de la respuesta
- [x] 4.2 Agregar campo `primeraRuta` en la respuesta del login con la ruta del primer menú disponible del usuario

## 5. Verificación

- [x] 5.1 Ejecutar `npm run build` para verificar que el proyecto compila sin errores
- [ ] 5.2 Probar el endpoint `POST /identificar-usuario` con un usuario existente y verificar que la respuesta incluye `ruta`, `icono` y `primeraRuta`
