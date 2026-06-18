## Why

El sistema de producción registra datos de cantidad producida, tiempos de proceso, asignación de operarios y paradas, pero no existe una vista consolidada para que los gerentes tomen decisiones basadas en estos datos. Se necesita un módulo de reportes que exponga esta información de forma agregada y clara, restringido exclusivamente al rol de gerente.

## What Changes

- Nuevo controller `ReportesController` con 4 endpoints GET para reportes
- Reporte 1: Total producido por día (suma diaria de `registro_de_cantidad` con tipo `produccion`)
- Reporte 2: Producción por operario por proceso (cantidad total producida agrupada por operario y proceso)
- Reporte 3: Comparación tiempo estándar vs tiempo real por proceso de tarjeta
- Reporte 4: Paradas agrupadas por código de parada (frecuencia y cantidad perdida)
- Nuevas entradas en tabla `menu` para los 4 reportes
- Nuevas entradas en `menu_del_rol` para rol gerente (id=3) con permiso `Listar=1`
- Los reportes NO tienen filtros inicialmente — devuelven todos los datos disponibles

## Capabilities

### New Capabilities

- `reportes-produccion`: Reportes gerenciales de producción: total diario, producción por operario/proceso, tiempos estándar vs real, y paradas agregadas

### Modified Capabilities

*(ninguna — no se modifican requisitos de capacidades existentes)*

## Impact

- **Nuevo controller**: `src/controllers/reportes.controller.ts`
- **Nuevas tablas afectadas**: solo inserts en `menu` y `menu_del_rol` (no nuevos modelos)
- **Base de datos**: consultas SELECT con agregaciones sobre tablas existentes (`registro_de_cantidad`, `proceso_x_tarjeta`, `parada`, `operario`, `proceso`, `codigo_de_parada`, `tarjeta_de_produccion`)
- **No breaking**: no se modifican endpoints ni modelos existentes
