## 1. Backend: resumen por estado (skill `backend-feature`)

- [x] 1.1 Plan por capas del endpoint `GET /api/v1/tasks/summary` y parada para aprobarlo (ruta antes de `:id`, controlador, transformer, sin migración)
- [x] 1.2 Tests de contrato con `test-writer`, uno por Scenario del requisito «Resumen de tareas por estado», y comprobar el rojo
- [x] 1.3 Congelar los tests por su `shasum`
- [x] 1.4 Implementar con `implementer` hasta el verde: consulta agrupada que excluye la papelera, ceros para los estados sin filas, `total` como suma de los tres
- [ ] 1.5 Cierre de backend: comprobar por `dbhub` el esquema y las filas con estado fuera de los tres (si `dbhub` sigue sin conectar, dejarlo dicho), `npm run openapi:check` y colección de Postman

## 2. Frontend: llamada y tipo

- [x] 2.1 Añadir el tipo del resumen en `src/lib/types.ts`
- [x] 2.2 Añadir `getTasksSummary` en `src/lib/api.ts` (único punto de contacto con el backend)

## 3. Frontend: indicador en la pantalla de la lista

- [x] 3.0 Traer la pieza del catálogo: `npx shadcn@latest add progress` desde `frontend/` (no se edita a mano)
- [x] 3.1 Crear `src/components/task-progress.tsx`: línea «X de Y hechas · Z %» y debajo la barra `Progress` con el mismo porcentaje, redondeado hacia abajo, concordancia con el total, solo tokens de color
- [x] 3.2 Pedir el resumen en `pages/tasks-page.tsx` junto a la lista sin bloquearla; un fallo deja el indicador sin pintar y no toca ningún aviso
- [x] 3.3 Pintar el indicador justo encima del `<ul>` solo con filas visibles, filtro válido, resumen cargado y `total > 0`
- [x] 3.4 Ajustar el resumen al crear una tarea y al cambiar de estado, y revertirlo en el `catch` que restaura la fila
- [ ] 3.5 `npm run build` y `npm run lint` en verde; comprobar a mano en el navegador los escenarios de los requisitos del indicador (vista por defecto, filtro, sin filas, crear, cambiar de estado, fallo del cambio)

## 4. Documentación y cierre

- [ ] 4.1 Actualizar `docs/capabilities/tasks/README.md` con el endpoint y el indicador, y commitear el diff regenerado de `.adonisjs/` junto al resto
- [ ] 4.2 Commit con la skill `/commit` al cerrar la petición
- [ ] 4.3 Al terminar la unidad de trabajo, una sola vez: `gh pr create` con descripción completa, pase del subagente `adversarial-reviewer` sobre el PR y responder solo con la URL
