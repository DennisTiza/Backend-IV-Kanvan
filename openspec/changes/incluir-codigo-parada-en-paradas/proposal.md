## Why

`GET /proceso-x-tarjeta/{id}/paradas` devuelve las paradas sin incluir el objeto `CodigoDeParada` relacionado. El frontend muestra "Sin código" porque `parada.codigo` es `undefined` — el endpoint solo retorna el FK `codigoDeParadaId` sin hacer el join.

## What Changes

- **ParadaRepository**: agregar `BelongsToAccessor` para `codigoDeParada` con su inclusion resolver, necesarios para que LoopBack pueda hacer eager-load de la relación.
- **GET /proceso-x-tarjeta/{id}/paradas**: modificar el `find()` para que incluya la relación `codigoDeParada` en la respuesta.
- **Spec `gestion-paradas`**: actualizar el requerimiento del endpoint para que especifique que la respuesta debe incluir el objeto `CodigoDeParada` anidado.

## Capabilities

### New Capabilities
*(none)*

### Modified Capabilities
- `gestion-paradas`: actualizar requerimiento `GET /proceso-x-tarjeta/{id}/paradas` para que la respuesta incluya la relación `codigoDeParada`.

## Impact

- `src/repositories/parada.repository.ts` — agregar relación belongsTo y su inclusion resolver.
- `src/controllers/proceso-x-tarjeta.controller.ts` — método `getParadas()`: agregar `include: ['codigoDeParada']` al `find()`.
- `openspec/specs/gestion-paradas/spec.md` — actualizar escenario "Obtener paradas de un proceso".
