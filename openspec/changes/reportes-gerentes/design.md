## Context

El sistema actual tiene datos de producción en `registro_de_cantidad`, `proceso_x_tarjeta`, `parada`, `operario`, `proceso`, `codigo_de_parada` y `tarjeta_de_produccion`. No existe ningún endpoint de reportes o agregaciones. La seguridad por menú existe en el frontend vía `menu_del_rol` pero no hay enforcement en backend.

Los reportes son solo para el rol gerente (id=3) y se controlan desde el frontend mediante los permisos de menú.

## Goals / Non-Goals

**Goals:**
- Exponer 4 endpoints GET de solo lectura bajo `/reportes/`
- Cada endpoint devuelve datos agregados desde tablas existentes
- Crear entradas de menú para que el frontend muestre/oculte los reportes según el rol
- No se requieren filtros iniciales — los endpoints devuelven todo el histórico

**Non-Goals:**
- No se implementa enforcement de permisos en backend (se delega al frontend vía menú)
- No se crean nuevos modelos ni tablas
- No se modifica ningún endpoint o modelo existente
- No se implementan filtros por fecha, proceso u operario (opcional futuro)
- No se genera PDF/Excel (solo JSON)

## Decisions

### 1. Endpoints vs Queries Raw SQL
Los reportes requieren agregaciones con JOINs y GROUP BY que LoopBack Repository no expone de forma natural. Se inyecta `DataSource` directamente en el controller y se ejecutan queries SQL nativos con `execute()`.

Alternativa considerada: usar el repositorio con `find()` y agregar en memoria. Descartada por ineficiente con volúmenes grandes de datos.

### 2. Controller separado
Se crea `ReportesController` en lugar de dispersar los endpoints en controllers existentes, porque son funcionalmente distintos (reportes vs CRUD).

### 3. 4 endpoints separados vs 1 endpoint dinámico
Un endpoint por reporte (en lugar de un solo `/reportes?tipo=X`) porque:
- Cada reporte tiene estructura de respuesta diferente
- Más fácil de documentar y mantener
- El frontend los consume como recursos independientes

### 4. Menús separados por reporte
Se crea una entrada en `menu` por cada reporte (4 en total), cada una con su registro en `menu_del_rol` para rol=3. Esto da granularidad para mostrar/ocultar individualmente en el frontend.

### 5. Tiempo estándar vs real
El tiempo estándar es `proceso_x_tarjeta.tiempo` (definido por el admin al crear la tarjeta). El tiempo real es `proceso_x_tarjeta.tiempoConsumido` (acumulado mientras el operario trabaja, excluye paradas porque el sistema pausa el reloj). El reporte incluye ambos, la diferencia y el porcentaje de cumplimiento.

## Risks / Trade-offs

- [SQL Injection] → Todas las consultas usan parámetros vinculados (`?` placeholders), no interpolación de strings
- [Rendimiento con muchos datos] → Las agregaciones son eficientes (GROUP BY con índices existentes). Si escala, añadir índices compuestos en `registro_de_cantidad.fecha` y `parada.fecha`
- [Sin paginación] → Los reportes devuelven todo el conjunto. Si hay miles de filas, considerar paginación futura
- [Tiempo estándar puede ser null] → El campo `tiempo` es opcional en `proceso_x_tarjeta`. El reporte 3 filtra los que tengan `tiempo IS NOT NULL`
