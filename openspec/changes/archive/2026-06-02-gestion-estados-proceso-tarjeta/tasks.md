## 1. Modelo — Campo orden en ProcesoXTarjeta

- [x] 1.1 Agregar propiedad `orden: number` (required) al modelo `ProcesoXTarjeta` (`src/models/proceso-x-tarjeta.model.ts`)
- [x] 1.2 Copiar `pp.orden` desde `ProductoXProceso` al crear `ProcesoXTarjeta` en `TarjetaDeProduccionController.create()` (`src/controllers/tarjeta-de-produccion.controller.ts:65-70`)
- [x] 1.3 Ejecutar migración (auto-migrate de LoopBack) para agregar columna `orden` a la tabla `proceso_x_tarjeta`

## 2. Ordenamiento en endpoints existentes

- [x] 2.1 Agregar `order: ['orden ASC']` al `find` en `GET /proceso-x-tarjeta/por-tarjeta/{tarjetaId}` (`src/controllers/proceso-x-tarjeta.controller.ts:98-118`)

## 3. Endpoint POST /proceso-x-tarjeta/{id}/iniciar

- [x] 3.1 Inyectar `TarjetaDeProduccionRepository` en `ProcesoXTarjetaController` para la actualización en cascada
- [x] 3.2 Implementar método `iniciar` en `ProcesoXTarjetaController` con ruta `POST /proceso-x-tarjeta/{id}/iniciar`
- [x] 3.3 Validar que el proceso existe — caso contrario retornar 404
- [x] 3.4 Validar que `fechaInicio` es null (proceso no iniciado previamente) — caso contrario retornar 409
- [x] 3.5 Validar secuencialidad: obtener procesos hermanos ordenados por `orden ASC`, verificar que el proceso anterior (si existe) tiene `fechaFinal` seteada — caso contrario retornar 409
- [x] 3.6 Setear `fechaInicio = new Date().toISOString()`, guardar y retornar el proceso actualizado
- [x] 3.7 Si el proceso tiene `orden === 1`, setear `tarjeta.estado = 'en_proceso'` y guardar la tarjeta

## 4. Endpoint POST /proceso-x-tarjeta/{id}/finalizar

- [x] 4.1 Implementar método `finalizar` en `ProcesoXTarjetaController` con ruta `POST /proceso-x-tarjeta/{id}/finalizar`
- [x] 4.2 Validar que el proceso existe — caso contrario retornar 404
- [x] 4.3 Validar que `fechaInicio` está seteada y `fechaFinal` es null (proceso en ejecución) — caso contrario retornar 409
- [x] 4.4 Aceptar `codigoDeErrorId` opcional en el body y asignarlo al proceso si se provee
- [x] 4.5 Setear `fechaFinal = new Date().toISOString()`, guardar y retornar el proceso actualizado
- [x] 4.6 Verificar si todos los procesos de la tarjeta tienen `fechaFinal` seteada
- [x] 4.7 Si todos están finalizados, setear `tarjeta.estado = 'finalizada'` y guardar la tarjeta
