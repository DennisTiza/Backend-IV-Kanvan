## 1. Modelo: Modificar ProcesoXTarjeta

- [x] 1.1 Agregar campo `cantidad` (number, required) al modelo `ProcesoXTarjeta`
- [x] 1.2 Agregar campo `cantidadRealizada` (number, default 0) al modelo `ProcesoXTarjeta`
- [x] 1.3 Agregar campo `cantidadRegistrada` (number, default 0) al modelo `ProcesoXTarjeta`
- [x] 1.4 Eliminar campo `codigoDeParadaId` (FK a CodigoDeParada) del modelo `ProcesoXTarjeta`
- [x] 1.5 Eliminar import de `CodigoDeParada` y relación `@belongsTo` en `ProcesoXTarjeta`
- [x] 1.6 `ProcesoOperarios` hereda de `ProcesoXTarjeta` — los nuevos campos se heredan automáticamente, no requiere cambios

## 2. Modelo: Crear entidad Parada

- [x] 2.1 Crear modelo `Parada` con campos: `id` (autogenerado), `procesoXTarjetaId` (FK), `codigoDeParadaId` (FK), `cantidadReportada` (number), `fecha` (datetime)
- [x] 2.2 Agregar relaciones `@belongsTo` a `ProcesoXTarjeta` y `CodigoDeParada`
- [x] 2.3 Agregar relación `@hasMany(() => Parada)` en `ProcesoXTarjeta`
- [x] 2.4 Agregar relación `@hasMany(() => Parada)` en `CodigoDeParada`
- [x] 2.5 Exportar `Parada` desde `src/models/index.ts`

## 3. Repositorio: Crear ParadaRepository

- [x] 3.1 Crear `ParadaRepository` extendiendo `DefaultCrudRepository`
- [x] 3.2 Agregar `HasManyRepositoryFactory` para las relaciones inversas desde `ProcesoXTarjetaRepository` y `CodigoDeParadaRepository`
- [x] 3.3 Exportar desde `src/repositories/index.ts`

## 4. Controlador: Modificar ProcesoXTarjetaController

- [x] 4.1 Modificar `POST /proceso-x-tarjeta/{id}/iniciar`:
  - Cambiar validación de secuencialidad de `anterior.fechaFinal` a `anterior.cantidadRegistrada > 0`
  - Permitir reinicio si proceso tiene `fechaInicio` Y `cantidadRegistrada < cantidad`
  - Rechazar si `cantidadRegistrada == cantidad`
- [x] 4.2 Modificar `POST /proceso-x-tarjeta/{id}/finalizar`:
  - Cambiar condición de tarjeta finalizada de "todos con fechaFinal" a "todos con `cantidadRegistrada == cantidad`"
- [x] 4.3 Agregar `POST /proceso-x-tarjeta/{id}/registrar-parada`:
  - Body: `{ cantidadReportada: number, codigoDeParadaId: number }`
  - Validar: proceso existe, tiene fechaInicio, no tiene fechaFinal
  - Validar: cantidadReportada + cantidadRegistrada <= cantidad
  - Crear registro en `Parada`
  - Actualizar `cantidadRealizada = cantidadReportada`
  - Actualizar `cantidadRegistrada += cantidadReportada`
  - No asignar fechaFinal ni cambiar estado de tarjeta
- [x] 4.4 Agregar `GET /proceso-x-tarjeta/{id}/paradas`:
  - Retornar todas las `Parada` del proceso ordenadas por `fecha ASC`

## 5. Controlador: Modificar TarjetaDeProduccionController

- [x] 5.1 En `POST /tarjeta-de-produccion` crear: al crear la tarjeta, crear automáticamente los registros `ProcesoXTarjeta` con `cantidad` heredada desde `TarjetaDeProduccion.cantidad` (actualmente solo consulta `ProductoXProceso` pero no crea los procesos)

## 6. Migración: Script SQL

- [x] 6.1 Crear migración para agregar columnas `cantidad`, `cantidadRealizada`, `cantidadRegistrada` a la tabla `ProcesoXTarjeta`
- [x] 6.2 Crear migración para crear tabla `Parada` con FK a `ProcesoXTarjeta` y `CodigoDeParada`
- [x] 6.3 Crear migración para copiar datos existentes de `ProcesoXTarjeta.codigoDeParadaId` a la tabla `Parada`
- [x] 6.4 Crear migración para eliminar columna `codigoDeParadaId` de `ProcesoXTarjeta`
