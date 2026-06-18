## Context

El `ReportesController` usa SQL nativo mediante `this.dataSource.execute()`. Las tablas en MySQL fueron creadas por LoopBack 4 usando los nombres de clase de los modelos (camelCase), pero las queries usan snake_case. MySQL en Windows con `lower_case_table_names=1` almacena los nombres en minúsculas pero conservando los underscores, por lo que `registro_de_cantidad` y `registrodecanidad` son tablas distintas.

## Goals / Non-Goals

**Goals:**
- Corregir los 4 nombres de tabla en las queries SQL del controller
- Los endpoints deben responder con datos (no 500)

**Non-Goals:**
- No se cambia la estructura de las queries ni la respuesta
- No se tocan modelos, repositorios ni migraciones

## Decisions

### 1. Usar el nombre exacto de la tabla en MySQL
Se reemplaza cada nombre snake_case por el nombre que LoopBack 4 asigna al modelo (camelCase), que MySQL en Windows almacena en minúscula sin separadores.

| SQL actual (roto) | SQL corregido |
|---|---|
| `registro_de_cantidad` | `registrodecanidad` |
| `proceso_x_tarjeta` | `procesoxtarjeta` |
| `codigo_de_parada` | `codigodeparada` |
| `tarjeta_de_produccion` | `tarjetadeproduccion` |

### 2. No se considera dejar ambas nomenclaturas
No vale la pena porque las tablas ya existen con un único nombre.

## Risks / Trade-offs

- [Si el servidor MySQL corre en Linux con case_sensitivity] → Los nombres sin underscores serían diferentes. Pero el entorno actual es Windows y siempre se ha usado esta convención.
- [Futuras migraciones que creen tablas con snake_case] → No es relevante, las migraciones SQL son manuales y `app.migrateSchema()` usa el nombre del modelo.
