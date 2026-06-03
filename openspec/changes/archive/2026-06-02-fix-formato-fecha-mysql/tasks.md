## 1. Corregir formato de fecha en endpoints iniciar/finalizar

- [x] 1.1 Reemplazar `new Date().toISOString()` por `new Date().toLocaleString('sv-SE')` en `iniciar` (líneas 154 y 156)
- [x] 1.2 Reemplazar `new Date().toISOString()` por `new Date().toLocaleString('sv-SE')` en `finalizar` (línea 202)
- [x] 1.3 Rebuild y verificar que `POST /proceso-x-tarjeta/{id}/iniciar` responde 200 sin error
