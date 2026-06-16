## 1. Modificar registrar-parada

- [x] 1.1 Calcular `duracionSesion = (now - fechaInicio) / 1000` y sumarlo a `tiempo`
- [x] 1.2 Establecer `fechaInicio = null` después de la parada
- [x] 1.3 Auto-asignar `fechaFinal = now` si `cantidadRegistrada >= cantidad`

## 2. Modificar finalizar

- [x] 2.1 Permitir finalizar procesos con `fechaInicio == null` si `cantidadRegistrada > 0`
- [x] 2.2 Si está activo (`fechaInicio != null`) y hay `cantidadReportada`: calcular y sumar tiempo de sesión
- [x] 2.3 Si está en pausa (`fechaInicio == null`) y hay `cantidadReportada`: actualizar solo cantidades, sin tiempo

## 3. Verificar compilación

- [x] 3.1 Ejecutar `npm run build` (lb-tsc) sin errores
