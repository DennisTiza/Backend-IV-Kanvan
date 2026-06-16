## 1. Repositorio

- [x] 1.1 Agregar BelongsToAccessor para `codigoDeParada` en `ParadaRepository`: inyectar `CodigoDeParadaRepository` via Getter, crear accessor, registrar inclusion resolver

## 2. Controller

- [x] 2.1 Modificar `GET /proceso-x-tarjeta/{id}/paradas` en `proceso-x-tarjeta.controller.ts` para incluir `{include: ['codigoDeParada']}` en el `find()`

## 3. Specs

- [x] 3.1 Actualizar `openspec/specs/gestion-paradas/spec.md`: modificar requerimiento `GET /proceso-x-tarjeta/{id}/paradas` para que especifique que la respuesta incluye `codigoDeParada`

## 4. Verify

- [x] 4.1 Compilar: `npm run build`
- [x] 4.2 Verificar que `GET /proceso-x-tarjeta/{id}/paradas` retorna `codigoDeParada` poblado
