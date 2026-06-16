## Why

El endpoint `POST /finalizar` no permite reportar cantidad realizada, obligando al frontend a un two-step (registrar parada sin código + finalizar) cuando el operario termina un proceso sin haber tenido paradas. Esto es antinatural y fuerza a inventar códigos de parada inexistentes.

## What Changes

- `POST /proceso-x-tarjeta/{id}/finalizar` acepta body opcional `{ cantidadReportada: number }`:
  - Si llega `cantidadReportada`: actualiza `cantidadRealizada` y suma a `cantidadRegistrada`, además de asignar `fechaFinal`.
  - Si no llega: solo asigna `fechaFinal` (comportamiento actual).
- No hay cambios en `registrar-parada` — `codigoDeParadaId` sigue siendo obligatorio.
- No hay cambios en `iniciar`.

## Capabilities

### New Capabilities
- *(ninguna)*

### Modified Capabilities
- `proceso-xtarjeta-transiciones`: El requerimiento "Finalizar proceso atómicamente" se modifica para aceptar `cantidadReportada` opcional en el body.

## Impact

- **API**: Cambio backward-compatible en `POST /finalizar` (body opcional).
- **Modelos**: Sin cambios.
- **Controlador**: `finalizar()` en `proceso-x-tarjeta.controller.ts` — lógica condicional según body.
- **Tests/validaciones**: Se agregan escenarios para finalizar con y sin `cantidadReportada`.
