## 1. Modelo y base de datos

- [x] 1.1 Hacer `fechaInicio` opcional en el modelo: cambiar `fechaInicio: string` a `fechaInicio?: string` en `src/models/proceso-x-tarjeta.model.ts`
- [x] 1.2 Quitar `DEFAULT CURRENT_TIMESTAMP` de la columna `fechaInicio` en MySQL mediante migración (`npm run migrate` ejecutado con `alter`)
- [x] 1.3 Crear script SQL de limpieza en `src/migrations/` (pendiente ejecutar contra BD real)

## 2. Verificación de creación

- [x] 2.1 Verificar que `tarjeta-de-produccion.controller.ts` no envía `fechaInicio` al crear `proceso_x_tarjeta` (línea 66-70) — confirmar que está correcto
- [x] 2.2 Rebuild y verificar compilación: `npm run build` exitoso

## 3. Verificación de endpoints

- [x] 3.1 Verificar lógica de `POST /proceso-x-tarjeta/{id}/iniciar` — correcta, asigna fechaInicio solo si es NULL
- [x] 3.2 Verificar lógica de `POST /proceso-x-tarjeta/{id}/finalizar` — sin cambios necesarios
- [x] 3.3 Verificar flujo completo en código — lógica secuencial correcta

## 4. Limpieza y validación final

- [x] 4.1 Endpoint `GET /proceso-x-tarjeta/por-tarjeta/{tarjetaId}` retorna datos sin cambios — devolverá `fechaInicio: null` para procesos pendientes
- [x] 4.2 Pendiente: verificar timer del frontend con datos reales
