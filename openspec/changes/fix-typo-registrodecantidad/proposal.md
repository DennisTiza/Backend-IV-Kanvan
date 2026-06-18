## Why

The reportes endpoint `/reportes/total-por-dia` and `/reportes/por-operario` fail with 500 error because the SQL queries reference `registrodecanidad` (missing the letter `t`) while the actual table created by LoopBack is `registrodecantidad` (from the model `RegistroDeCantidad`). This typo was introduced in a previous fix attempt (`fix-nombres-tablas-reportes`).

## What Changes

- Fix the table name in two SQL queries within `src/controllers/reportes.controller.ts`:
  - Line 32: `registrodecanidad` → `registrodecantidad`
  - Line 67: `registrodecanidad` → `registrodecantidad`

## Capabilities

### New Capabilities
None — this is a bug fix, no new capabilities.

### Modified Capabilities
None — no requirement changes, purely a code correction.

## Impact

- **File modified**: `src/controllers/reportes.controller.ts` (2 lines changed)
- **APIs affected**: `GET /reportes/total-por-dia` and `GET /reportes/por-operario`
- **No schema, model, or database changes**
