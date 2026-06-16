## Why

El sistema actual solo permite asociar códigos de parada al finalizar un proceso (`POST /finalizar`), sin posibilidad de registrar paradas intermedias, llevar histórico de múltiples paradas por proceso, ni reanudar procesos detenidos. Los operarios necesitan registrar paradas en medio de la producción, reportar cantidad parcial realizada, reanudar procesos, y poder iniciar el siguiente proceso aunque el anterior no haya finalizado — siempre que tenga avance registrado.

## What Changes

- **Nueva entidad `Parada`**: modelo independiente para registrar histórico de todas las paradas de un proceso (código de parada, cantidad reportada, fecha)
- **Campos de cantidad en `ProcesoXTarjeta`**: agregar `cantidad`, `cantidadRealizada`, `cantidadRegistrada` para rastrear avance por proceso
- **Nuevo endpoint `POST /proceso-x-tarjeta/{id}/registrar-parada`**: registra una parada en medio de la ejecución sin finalizar el proceso
- **Modificar `POST /proceso-x-tarjeta/{id}/iniciar`**: cambiar validación secuencial de "proceso anterior debe tener `fechaFinal`" a "proceso anterior debe tener `cantidadRegistrada > 0`"; permitir reiniciar un proceso con paradas
- **Modificar `POST /proceso-x-tarjeta/{id}/finalizar`**: cambiar condición de "todos los procesos con `fechaFinal`" a "todos los procesos con `cantidadRegistrada == cantidad`" para determinar si la tarjeta pasa a `finalizada`
- **Estado de tarjeta**: se mantiene `por_hacer → en_proceso → finalizada`. Las paradas no cambian el estado de la tarjeta
- **Eliminar `codigoDeParadaId` de `ProcesoXTarjeta`** (opcional, se migra a la entidad `Parada`)

## Capabilities

### New Capabilities
- `gestion-paradas`: Registro de paradas intermedias durante la ejecución de procesos, con histórico de múltiples paradas por proceso, cantidad reportada por parada, y trazabilidad completa

### Modified Capabilities
- `proceso-xtarjeta-transiciones`: Cambio en la validación de secuencialidad de `iniciar` (de validar por `fechaFinal` a validar por `cantidadRegistrada > 0`), y cambio en la condición de finalización de tarjeta (de "todos con `fechaFinal`" a "todos con `cantidadRegistrada == cantidad`")

## Impact

- **Modelos**: Modificar `ProcesoXTarjeta` (agregar 3 campos), crear `Parada` (nuevo modelo), opcionalmente eliminar `codigoDeParadaId` de `ProcesoXTarjeta`
- **Repositorios**: Crear `ParadaRepository`
- **Controladores**: Modificar `ProcesoXTarjetaController` (iniciar, finalizar), crear endpoints para `Parada`
- **Base de datos**: Migración para nueva tabla `Parada` y columnas en `ProcesoXTarjeta`
- **API**: Nuevo endpoint `POST /registrar-parada`, cambios en `POST /iniciar` y `POST /finalizar`
- **Frontend**: Requerirá cambios en el tablero kanban para consumir los nuevos endpoints y mostrar estado de paradas por proceso
