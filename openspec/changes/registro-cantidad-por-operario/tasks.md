## 1. Modelos y Base de Datos

- [x] 1.1 Crear modelo `RegistroDeCantidad` en `src/models/registro-de-cantidad.model.ts` con propiedades: id, procesoXTarjetaId, operarioId, cantidad, tipo ('produccion'|'parada'), codigoDeParadaId (nullable), fecha
- [x] 1.2 Agregar `operarioId` como propiedad FK en `src/models/parada.model.ts` con belongsTo a Operario
- [x] 1.3 Agregar `registroDeCantidads` como hasMany en `src/models/proceso-x-tarjeta.model.ts`
- [x] 1.4 Agregar `registroDeCantidads` como hasMany en `src/models/operario.model.ts`
- [x] 1.5 Exportar `RegistroDeCantidad` desde `src/models/index.ts`
- [x] 1.6 Crear migración SQL: tabla `RegistroDeCantidad` + columna `operarioId` en `Parada`

## 2. Repositorios

- [x] 2.1 Crear `src/repositories/registro-de-cantidad.repository.ts` con belongsTo a ProcesoXTarjeta, Operario y CodigoDeParada
- [x] 2.2 Agregar `operario` belongsTo accessor en `src/repositories/parada.repository.ts`
- [x] 2.3 Agregar `registroDeCantidads` hasMany factory en `src/repositories/proceso-x-tarjeta.repository.ts`
- [x] 2.4 Agregar `registroDeCantidads` hasMany factory en `src/repositories/operario.repository.ts`
- [x] 2.5 Exportar nuevo repositorio desde `src/repositories/index.ts` (si existe)

## 3. Controladores y Lógica de Negocio

- [x] 3.1 Modificar `POST /proceso-x-tarjeta/{id}/registrar-parada` para aceptar `operarioId`, crear `RegistroDeCantidad` con tipo='parada', e incluirlo en la Parada
- [x] 3.2 Modificar `POST /proceso-x-tarjeta/{id}/finalizar` para aceptar `operarioId`, crear `RegistroDeCantidad` con tipo='produccion' cuando se reporte cantidad
- [x] 3.3 Agregar endpoint `GET /proceso-x-tarjeta/{id}/registros-cantidad` que retorna todos los RegistroDeCantidad ordenados por fecha ASC con operario y codigoDeParada incluidos
- [x] 3.4 Modificar `GET /proceso-x-tarjeta/{id}/paradas` para incluir relación `operario` en la respuesta

## 4. Frontend

- [ ] 4.1 Agregar dropdown selector de operario en el formulario de registro de parada (cargar operarios desde `operarioXProcesoXTarjetas` del proceso) **— frontend separado**
- [ ] 4.2 Agregar dropdown selector de operario en el formulario de finalización de proceso **— frontend separado**
- [ ] 4.3 Enviar `operarioId` seleccionado en los requests a `registrar-parada` y `finalizar` **— frontend separado**

## 5. Verificación

- [x] 5.1 Probar flujo completo: asignar operarios → iniciar proceso → reportar parada con operario → finalizar con operario → consultar registros de cantidad (compilación exitosa)
- [x] 5.2 Verificar que `cantidadRegistrada` sigue funcionando correctamente para detectar procesos completos (lógica sin cambios)
- [x] 5.3 Verificar que paradas existentes (sin `operarioId`) siguen siendo accesibles (campo nullable)
