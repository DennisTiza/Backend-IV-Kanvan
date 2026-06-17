## Why

El flujo de producción cambió de batch a serie: los procesos ya no esperan a que el anterior termine todo el lote, sino que trabajan concurrentemente sobre unidades individuales. Sin embargo, `POST /proceso-x-tarjeta/{id}/iniciar` aún valida que el proceso anterior tenga `cantidadRegistrada > 0`, lo que impide iniciar un proceso aunque `getMaxPermitido()` en el frontend ya controla que no se reporte más de lo registrado por el anterior.

## What Changes

- **Remover validación de proceso anterior** en `POST /proceso-x-tarjeta/{id}/iniciar`: eliminar el bloque que busca los procesos hermanos y rechaza si el anterior no tiene `cantidadRegistrada > 0`.
- El endpoint solo validará que el proceso no esté completo (`cantidadRegistrada === cantidad`) y que exista.
- **BREAKING**: Cambia el comportamiento del endpoint — procesos ya no requieren que el anterior haya registrado cantidad para iniciar.

## Capabilities

### New Capabilities
*(none)*

### Modified Capabilities
- `proceso-xtarjeta-transiciones`: eliminar el escenario "Iniciar proceso saltando el orden secuencial" y actualizar el escenario "Iniciar proceso pendiente exitosamente" para que no requiera `cantidadRegistrada > 0` del proceso anterior.

## Impact

- `src/controllers/proceso-x-tarjeta.controller.ts` — método `iniciar()`: eliminar líneas 163-175 (búsqueda de hermanos y validación de proceso anterior).
- `openspec/specs/proceso-xtarjeta-transiciones/spec.md` — actualizar requirements y scenarios.
