## 1. Crear controller de reportes

- [x] 1.1 Crear `src/controllers/reportes.controller.ts` con inyección de `DataSource` (MySQL) y repositorios necesarios
- [x] 1.2 Implementar endpoint `GET /reportes/total-por-dia` con query SQL que suma `cantidad` de `RegistroDeCantidad` WHERE `tipo = 'produccion'` agrupado por `DATE(fecha)` ordenado por fecha ASC
- [x] 1.3 Implementar endpoint `GET /reportes/por-operario` con query SQL que cruza `RegistroDeCantidad`, `Operario`, `ProcesoXTarjeta` y `Proceso` para obtener total producido por operario y proceso
- [x] 1.4 Implementar endpoint `GET /reportes/tiempos` con query SQL que selecciona `tiempo` (estándar) y `tiempoConsumido` (real) de `ProcesoXTarjeta`, calculando diferencia y porcentaje, excluyendo WHERE `tiempo IS NULL`
- [x] 1.5 Implementar endpoint `GET /reportes/paradas` con query SQL que agrupa `Parada` por `codigoDeParadaId`, contando frecuencia y sumando `cantidadPerdida`, ordenado por frecuencia DESC

## 2. Agregar menús y permisos

- [x] 2.1 Crear archivo SQL `src/migrations/008-insert-menus-reportes.sql` con inserts para 4 menús en tabla `menu`
- [x] 2.2 Agregar inserts en el mismo archivo para `menu_del_rol` con rol gerente (id=3) y `Listar = 1` para cada reporte
