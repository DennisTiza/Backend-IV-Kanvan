## Context

Backend IV Kanvan (LoopBack 4 + MySQL). El modelo `Menu` actualmente solo tiene `id`, `Nombre`, `Comentario`. El endpoint `POST /identificar-usuario` devuelve `user`, `token` y `menu` (permisos booleanos), pero el frontend no puede determinar a qué pantalla redirigir porque los menús no tienen información de ruta.

## Goals / Non-Goals

**Goals:**
- Agregar columna `ruta` (obligatoria) al modelo `Menu` para que cada menú sepa su URL en el frontend
- Agregar columna `icono` (opcional) para facilitar la renderización de la UI
- Actualizar `POST /identificar-usuario` para devolver `menu` con las rutas incluidas
- El frontend puede usar el primer menú con `ruta` o el `rolId` para redirigir

**Non-Goals:**
- No se implementa autorización por ruta (solo navegación)
- No se modifican otros endpoints CRUD de `Menu` ni `MenuDelRol`
- No se agregan guards/middleware de autenticación
- No se toca la lógica de JWT

## Decisions

| Decisión | Opción elegida | Alternativa descartada |
|----------|---------------|------------------------|
| **Columna ruta requerida u opcional** | Requerida — sin ruta el menú no cumple su propósito | Opcional: generaría menús huérfanos sin navegación |
| **Columna icono** | Opcional — el frontend puede usar un default | Requerida: forzaría data migrada innecesariamente |
| **Dónde incluir ruta en la respuesta** | Dentro de cada objeto `MenuDelRol` en el array `menu` de la respuesta de login | Crear un campo separado `primeraRuta`: más work para el frontend y rompe la estructura existente |
| **Migración** | Migración manual SQL + actualizar modelo LoopBack | Usar migración automática de LoopBack (`npm run migrate`): no genera la columna si la tabla ya existe |

## Riesgos / Trade-offs

- **Menús existentes sin ruta** → La migración debe asignar un valor default o requerir que el administrador configure rutas manualmente. Mitigación: migración inicial asigna `/` como default.
- **Ruta hardcodeada vs. dinámica** → Decidimos que `ruta` es un string fijo (p.ej. `/produccion/tarjetas`). Si el frontend cambia, hay que actualizar la DB. Trade-off asumible para un backend que solo sirve datos.
- **Icono almacenado como string** → Podría ser nombre de icono de Material Icons o FontAwesome. Sin validación en backend. El frontend interpreta.

## Open Questions

- ¿Qué rutas concretas necesita el frontend? (depende de la implementación del frontend)
- ¿Los iconos se almacenan como nombre de clase CSS, URL SVG, o qué formato?
