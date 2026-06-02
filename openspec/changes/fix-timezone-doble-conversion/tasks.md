## 1. Generar timestamps en UTC

- [x] 1.1 Cambiar `new Date().toLocaleString('sv-SE')` por `new Date().toISOString().replace('T', ' ').replace('Z', '')` en `proceso-x-tarjeta.controller.ts:154`
- [x] 1.2 Cambiar `new Date().toLocaleString('sv-SE')` por `new Date().toISOString().replace('T', ' ').replace('Z', '')` en `proceso-x-tarjeta.controller.ts:202`

## 2. Datasource

- [x] 2.1 Agregar `timezone: 'Z'` a `src/datasources/mysql.datasource.ts`

## 3. Migración de datos existentes

- [x] 3.1 Ejecutar migración: convertir fechas Colombia → UTC (+5h) — 14 registros actualizados

## 4. Build y verificación

- [x] 4.1 Rebuild con `npm run build`
- [ ] 4.2 Reiniciar servidor y probar flujo completo desde frontend
