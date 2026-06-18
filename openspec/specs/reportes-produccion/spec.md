## ADDED Requirements

### Requirement: Reporte de total producido por día

El sistema DEBE exponer `GET /reportes/total-por-dia` que devuelva la suma de cantidad producida agrupada por día, ordenada por fecha ascendente. Solo DEBE incluir registros de tipo `produccion`.

#### Scenario: Reporte devuelve totales diarios

- **WHEN** se envía `GET /reportes/total-por-dia`
- **THEN** el sistema DEBE retornar un array de objetos con `{ fecha: string, totalProducido: number }`
- **AND** DEBE estar ordenado por `fecha ASC`
- **AND** solo DEBE incluir registros de `RegistroDeCantidad` con `tipo = 'produccion'`

#### Scenario: No hay registros de producción

- **WHEN** se envía `GET /reportes/total-por-dia` y no existen registros de producción
- **THEN** el sistema DEBE retornar un array vacío

### Requirement: Reporte de producción por operario y proceso

El sistema DEBE exponer `GET /reportes/por-operario` que devuelva la cantidad total producida por cada operario, desglosada por proceso. El reporte DEBE cruzar `RegistroDeCantidad` con `Operario`, `ProcesoXTarjeta` y `Proceso`.

#### Scenario: Reporte devuelve producción por operario y proceso

- **WHEN** se envía `GET /reportes/por-operario`
- **THEN** el sistema DEBE retornar un array de objetos con `{ operario: string, proceso: string, totalProducido: number }`
- **AND** DEBE incluir solo registros de `tipo = 'produccion'`
- **AND** DEBE ordenar por nombre de operario ASC

#### Scenario: Operario sin producción registrada

- **WHEN** se envía `GET /reportes/por-operario` y un operario no tiene registros de producción
- **THEN** el sistema NO DEBE incluir a ese operario en el resultado

### Requirement: Reporte de tiempos estándar vs real

El sistema DEBE exponer `GET /reportes/tiempos` que devuelva la comparación entre el tiempo estándar (definido en `ProcesoXTarjeta.tiempo`) y el tiempo real consumido (`ProcesoXTarjeta.tiempoConsumido`), incluyendo la diferencia y el porcentaje de cumplimiento. Solo DEBE incluir procesos donde `tiempo` no sea nulo.

#### Scenario: Reporte devuelve comparación de tiempos

- **WHEN** se envía `GET /reportes/tiempos`
- **THEN** el sistema DEBE retornar un array de objetos con `{ tarjetaCodigo: string, proceso: string, tiempoEstandar: number, tiempoReal: number, diferencia: number, porcentaje: number }`
- **AND** DEBE excluir registros donde `tiempo` sea nulo

#### Scenario: Diferencia positiva indica tiempo ahorrado

- **WHEN** `tiempoReal < tiempoEstandar`
- **THEN** `diferencia` DEBE ser positiva y `porcentaje` DEBE ser menor a 100

#### Scenario: Diferencia negativa indica tiempo excedido

- **WHEN** `tiempoReal > tiempoEstandar`
- **THEN** `diferencia` DEBE ser negativa y `porcentaje` DEBE ser mayor a 100

### Requirement: Reporte de paradas

El sistema DEBE exponer `GET /reportes/paradas` que devuelva las paradas agrupadas por código de parada, mostrando la frecuencia de cada una y la cantidad total perdida.

#### Scenario: Reporte devuelve paradas agrupadas

- **WHEN** se envía `GET /reportes/paradas`
- **THEN** el sistema DEBE retornar un array de objetos con `{ codigo: string, descripcion: string, veces: number, cantidadPerdida: number }`
- **AND** DEBE agrupar por `codigoDeParadaId`
- **AND** DEBE ordenar por `veces DESC`

#### Scenario: No hay paradas registradas

- **WHEN** se envía `GET /reportes/paradas` y no existen paradas
- **THEN** el sistema DEBE retornar un array vacío

### Requirement: Inserts de menú y permisos para gerente

El sistema DEBE incluir scripts SQL para crear las entradas de menú de los 4 reportes y sus permisos asociados para el rol de gerente (id=3) con `Listar = 1`.

#### Scenario: Menú de reportes existe en base de datos

- **WHEN** se ejecutan los inserts de menú
- **THEN** DEBEN existir 4 registros en la tabla `menu` con los nombres de los reportes
- **AND** DEBEN existir 4 registros en `menu_del_rol` con `rolId = 3` y `Listar = 1`

#### Scenario: Gerente puede listar reportes

- **WHEN** un usuario con `rolId = 3` inicia sesión
- **THEN** el menú devuelto DEBE incluir los 4 reportes con `Listar = 1`
