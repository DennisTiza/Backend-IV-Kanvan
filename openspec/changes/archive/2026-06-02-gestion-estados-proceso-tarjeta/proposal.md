## Why

El frontend necesita visualizar las tarjetas de producción con sus procesos en orden secuencial y permitir a los operarios iniciar/finalizar cada proceso de forma atómica. Actualmente el backend no expone el orden de los procesos en `ProcesoXTarjeta`, no garantiza ordenamiento en sus endpoints, y carece de operaciones transicionales para iniciar y finalizar procesos, obligando al frontend a manejar lógica de estado que debería estar en el backend.

## What Changes

- Agregar campo `orden` al modelo `ProcesoXTarjeta` y copiarlo desde `ProductoXProceso.orden` al crear una tarjeta de producción
- Agregar `order: ['orden ASC']` al endpoint `GET /proceso-x-tarjeta/por-tarjeta/{tarjetaId}`
- Crear endpoint `POST /proceso-x-tarjeta/{id}/iniciar` que establece `fechaInicio` con validaciones de flujo secuencial
- Crear endpoint `POST /proceso-x-tarjeta/{id}/finalizar` que establece `fechaFinal` y opcionalmente `codigoDeErrorId`
- Actualizar `TarjetaDeProduccion.estado` en cascada: `por_hacer → en_proceso` al iniciar el primer proceso, `en_proceso → finalizada` al finalizar el último proceso

## Capabilities

### New Capabilities
- `proceso-xtarjeta-orden`: Campo orden en ProcesoXTarjeta, copiado desde ProductoXProceso al crear la tarjeta, y ordenamiento explícito en los endpoints que devuelven procesos de una tarjeta
- `proceso-xtarjeta-transiciones`: Endpoints atómicos para iniciar y finalizar procesos, con validación de flujo secuencial y actualización en cascada del estado de la tarjeta

### Modified Capabilities
*(ninguna — no existen specs previas para estas capacidades)*

## Impact

- `src/models/proceso-x-tarjeta.model.ts`: nuevo campo `orden`
- `src/controllers/tarjeta-de-produccion.controller.ts`: copiar `orden` al crear ProcesoXTarjeta
- `src/controllers/proceso-x-tarjeta.controller.ts`: nuevo endpoint `iniciar`, nuevo endpoint `finalizar`, y ordenar resultado de `por-tarjeta` por `orden`
- `src/controllers/tarjeta-de-produccion.controller.ts`: posible actualización de estado en cascada
- Base de datos: nueva columna `orden` en tabla `proceso_x_tarjeta` (auto-migración LoopBack)
