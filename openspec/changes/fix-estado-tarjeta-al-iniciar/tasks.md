## 1. Corregir condición de primer proceso en endpoint iniciar

- [x] 1.1 Cambiar `if (proceso.orden === 1)` por `if (idx === 0)` en `POST /proceso-x-tarjeta/{id}/iniciar` (`src/controllers/proceso-x-tarjeta.controller.ts:159`)
- [x] 1.2 Rebuild y verificar que al iniciar el primer proceso la tarjeta cambia a `en_proceso`
