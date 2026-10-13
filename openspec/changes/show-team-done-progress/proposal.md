## Why

La pantalla de tareas deja las hechas fuera de la vista por defecto, así que el equipo no ve nunca cuánto ha avanzado: para saberlo tiene que acotar por «Hecho» y contar a ojo. Un indicador de avance a la vista responde a «¿cómo vamos?» sin tocar nada.

Se descartó medir el avance sobre «las tareas que se están viendo»: con la vista por defecto (pendientes y en curso) nunca hay ninguna hecha a la vista, y con un filtro de un solo estado el resultado es siempre 0 % o 100 %. El indicador mide el avance de **todo el equipo**, no el de la vista.

## What Changes

- La pantalla de la lista enseña, justo encima del listado, cuántas tareas del equipo están hechas sobre el total de tareas del espacio: el recuento («X de Y»), el porcentaje y una barra de progreso.
- El indicador no depende del filtro: es el mismo en la vista por defecto y en cualquier vista acotada por estado.
- Se mantiene al día con las acciones de la propia pantalla: crear una tarea y cambiar el estado de una fila lo actualizan sin recargar.
- No aparece cuando el espacio no tiene ninguna tarea; ahí sigue mandando el mensaje de «El espacio sin tareas».
- Sin cambios en el backend ni en la API: el total sale de las dos consultas que ya existen (la lista por defecto y la de `done`). **No hay migración ni cambio de esquema.**

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `tasks`: se añade un requirement a la parte de pantalla de la lista, «Avance del equipo sobre la lista». No cambia ninguno de los existentes.

## Impact

- `frontend/src/pages/tasks-page.tsx`: obtener el total y las hechas del espacio, y mantenerlos al crear o cambiar de estado.
- Un componente nuevo en `frontend/src/components/` para el indicador: el recuento y el porcentaje en texto, más una barra de progreso con la pieza `Progress` de shadcn añadida al catálogo de `ui/`. Solo tokens de `index.css`, sin colores literales.
- `frontend/src/lib/api.ts` y `types.ts`: sin cambios previstos; se reutilizan `listTasks` y `DEFAULT_LIST_STATUSES`.
- Backend, rutas, controladores, validadores, transformers, OpenAPI y Postman: no se tocan.
- `docs/capabilities/tasks/README.md`: se actualiza para reflejar el nuevo comportamiento de la pantalla.
