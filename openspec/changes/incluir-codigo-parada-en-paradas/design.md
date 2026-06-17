## Context

`GET /proceso-x-tarjeta/{id}/paradas` retorna las paradas con solo el FK `codigoDeParadaId`. El frontend necesita el objeto `CodigoDeParada` anidado (`{ id, codigo, descripcion }`) para mostrar el código y descripción en la UI.

El repositorio `ParadaRepository` no registra ninguna relación — ni siquiera tiene un `BelongsToAccessor` para `CodigoDeParada`. LoopBack necesita este accessor registrado con su `inclusionResolver` para poder hacer eager-load de la relación.

## Goals / Non-Goals

**Goals:**
- Agregar `BelongsToAccessor<CodigoDeParada>` en `ParadaRepository` con su `inclusionResolver`
- Modificar `GET /proceso-x-tarjeta/{id}/paradas` para que incluya `codigoDeParada` en la respuesta
- Que el frontend reciba `parada.codigo` poblado con `{ id, codigo, descripcion }`

**Non-Goals:**
- No cambiar el modelo de datos
- No cambiar `POST /proceso-x-tarjeta/{id}/registrar-parada`
- No modificar el otro endpoint `GET /proceso-x-tarjetas/{id}/paradas` (plural)

## Decisions

| Decisión | Opción | Alternativa | Razón |
|---|---|---|---|
| Include fijo vs. dinámico | Hardcodear `include: ['codigoDeParada']` en el controller | Pasar filter param desde el frontend | Siempre se necesita el código de parada al listar paradas. Hardcodear evita ruido en la URL y hace el comportamiento predecible. |
| Inyección de repositorio | `@repository.getter('CodigoDeParadaRepository')` con Getter | Inyección directa con `@repository` | Los Getters son la práctica estándar de LoopBack para relaciones, evitan dependencias circulares. |

## Risks / Trade-offs

- [Bajo] La consulta ahora hace un JOIN adicional por cada request de paradas → impacto negligible, las paradas por proceso son pocas (< 1000).
- [Nulo] No hay breaking changes — la respuesta agrega un campo nuevo sin quitar ninguno existente.
