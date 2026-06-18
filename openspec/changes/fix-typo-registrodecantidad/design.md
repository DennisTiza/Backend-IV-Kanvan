## Context

The `src/controllers/reportes.controller.ts` contains raw SQL queries that reference the table `registrodecanidad`. The actual table created by LoopBack's auto-migration from the `RegistroDeCantidad` model is `registrodecantidad`. This typo causes 500 errors on two report endpoints.

## Goals / Non-Goals

**Goals:**
- Fix the table name typo in the two SQL queries that fail
- Restore `GET /reportes/total-por-dia` and `GET /reportes/por-operario` functionality

**Non-Goals:**
- No changes to schema, models, or database migrations
- No changes to the other working report endpoints (`/reportes/tiempos`, `/reportes/paradas`)
- No refactoring of the SQL query approach

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Fix the typo vs rename the DB table | Fix the queries | The table name `registrodecantidad` is the correct LoopBack-generated name from the `RegistroDeCantidad` model. The queries had the typo. |
| One change per line or both at once | Both at once | Two occurrences of the same typo, same fix. Single atomic change. |

## Risks / Trade-offs

- **Low risk**: The change is a simple string replacement in SQL queries. The table `registrodecantidad` already exists and is populated.
- **No rollback needed**: Reverting the two lines restores previous behavior (broken state).
