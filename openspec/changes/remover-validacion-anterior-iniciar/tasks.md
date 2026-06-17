## 1. Backend

- [x] 1.1 Eliminar bloque de validación de proceso anterior en `iniciar()` de `proceso-x-tarjeta.controller.ts` (líneas 163-175: búsqueda de hermanos y validación de `cantidadRegistrada` del proceso anterior)

## 2. Specs

- [x] 2.1 Actualizar `openspec/specs/proceso-xtarjeta-transiciones/spec.md`: eliminar escenario "Iniciar proceso saltando el orden secuencial" y remover la condición `AND el proceso anterior ... tiene cantidadRegistrada > 0` del escenario "Iniciar proceso pendiente exitosamente"

## 3. Verify

- [x] 3.1 Compilar y verificar que no hay errores de tipo: `npm run build`
- [x] 3.2 Probar que `POST /proceso-x-tarjeta/{id}/iniciar` ahora permite iniciar un proceso sin que el anterior tenga `cantidadRegistrada > 0`
