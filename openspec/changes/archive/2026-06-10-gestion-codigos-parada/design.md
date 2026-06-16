## Context

El sistema actual (LoopBack 4 + MySQL) maneja producción mediante `TarjetaDeProduccion` que contiene procesos (`ProcesoXTarjeta`) ejecutados secuencialmente por operarios. Los códigos de parada (`CodigoDeParada`) solo pueden asociarse al finalizar un proceso vía `POST /finalizar`. No existe registro histórico de paradas, ni control de avance parcial por proceso.

Se necesita:
- Registrar paradas en medio de un proceso sin finalizarlo
- Llevar histórico de todas las paradas de cada proceso
- Controlar cantidad realizada vs cantidad total por proceso
- Permitir reanudar procesos detenidos
- Permitir iniciar el siguiente proceso si el anterior tiene avance (`cantidadRegistrada > 0`)
- La tarjeta solo se finaliza cuando todos los procesos tienen `cantidadRegistrada == cantidad`

## Goals / Non-Goals

**Goals:**
- Crear entidad `Parada` con histórico de todas las paradas por proceso
- Agregar `cantidad`, `cantidadRealizada`, `cantidadRegistrada` a `ProcesoXTarjeta`
- Nuevo endpoint `POST /registrar-parada` que no finaliza el proceso
- Modificar `POST /iniciar` para validar por `cantidadRegistrada > 0` en vez de `fechaFinal`
- Modificar `POST /finalizar` para usar `cantidadRegistrada == cantidad` como condición de tarjeta finalizada
- Mantener estado de tarjeta como `por_hacer → en_proceso → finalizada` (las paradas no cambian estado)

**Non-Goals:**
- No se modifican los modelos `TarjetaDeProduccion`, `CodigoDeParada`, `Proceso`, `Operario`
- No se implementa lógica de notificaciones en tiempo real sobre paradas
- No se modifican los endpoints CRUD genéricos de `ProcesoXTarjeta` (PATCH, PUT, DELETE)
- No se aborda el frontend (solo API)

## Decisions

### 1. Nueva entidad `Parada` en vez de array JSON o tabla de eventos
- **Opción**: Crear tabla `Parada` con FK a `ProcesoXTarjeta` y `CodigoDeParada`
- **Alternativa**: Usar columna JSON en `ProcesoXTarjeta` para almacenar histórico
- **Decisión**: Entidad independiente. Permite consultas SQL directas, índices, integridad referencial, y es más fácil de mantener y reportear

### 2. `cantidad` en `ProcesoXTarjeta` se hereda de `TarjetaDeProduccion`
- Al crear los `ProcesoXTarjeta` desde la tarjeta, se copia `TarjetaDeProduccion.cantidad` a cada `ProcesoXTarjeta.cantidad`
- Esto permite que cada proceso tenga su propia meta sin depender de la tarjeta si en el futuro cambian

### 3. `codigoDeParadaId` se elimina de `ProcesoXTarjeta`
- Se migra a la entidad `Parada` que tiene su propio `codigoDeParadaId`
- Esto elimina la limitación de una sola parada por proceso
- **Breaking change**: Clientes que usen `codigoDeParadaId` en `ProcesoXTarjeta` deben migrar a consultar `Parada`

### 4. Reinicio de proceso vía `POST /iniciar` sin validar duplicado
- Se modifica la validación de "proceso ya iniciado": si el proceso tiene `fechaInicio` Y `cantidadRegistrada < cantidad`, se permite reiniciar (se actualiza `fechaInicio`)
- Si el proceso ya está completo (`cantidadRegistrada == cantidad`), se rechaza

### 5. Estado `en_proceso` constante
- Las paradas no afectan el estado de la tarjeta
- El frontend determina visualmente si hay paradas activas consultando los procesos y sus paradas

## Decisions

### 6. Secuencialidad por avance en vez de finalización
- Actual: proceso anterior debe tener `fechaFinal` para iniciar el siguiente
- Nuevo: proceso anterior debe tener `cantidadRegistrada > 0` para iniciar el siguiente
- Esto permite solapamiento parcial: P2 puede empezar aunque P1 no haya terminado, mientras P1 tenga avance

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|------------|
| Datos existentes en `codigoDeParadaId` de `ProcesoXTarjeta` se pierden al migrar | Migración SQL copia los valores existentes a la tabla `Parada` antes de eliminar la columna |
| Operarios inician procesos sin haber avanzado el anterior (confusión) | La validación `cantidadRegistrada > 0` es clara y el frontend puede mostrar tooltips |
| Múltiples reanudaciones pierden el registro de cuándo se trabajó realmente | Cada `registrar-parada` captura fecha exacta; cada `iniciar` actualiza `fechaInicio` |
| El modelo se vuelve más complejo con la nueva entidad | Se mantiene la entidad simple (4 campos) y se expone vía endpoints específicos |
