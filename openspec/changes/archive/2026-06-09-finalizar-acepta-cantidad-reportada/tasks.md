## 1. Modificar controlador

- [x] 1.1 Agregar `@requestBody` opcional con `cantidadReportada` al método `finalizar` en `proceso-x-tarjeta.controller.ts`
- [x] 1.2 Implementar lógica condicional: si `cantidadReportada` está presente, validar que `cantidadRegistrada + cantidadReportada <= cantidad` (error 422 si excede)
- [x] 1.3 Si `cantidadReportada` está presente: actualizar `cantidadRealizada = cantidadReportada` y `cantidadRegistrada += cantidadReportada` además de `fechaFinal`
- [x] 1.4 Si `cantidadReportada` NO está presente: solo actualizar `fechaFinal` (comportamiento actual)

## 2. Verificar compilación

- [x] 2.1 Ejecutar `npm run build` (lb-tsc) para verificar que no hay errores de tipo
