## Why

La vista por defecto de la lista deja las tareas hechas fuera a propósito, y cada filtro enseña un único estado. El resultado es que nadie puede responder de un vistazo «¿cuánto llevamos hecho?»: lo hecho está escondido justo donde se mira el trabajo abierto. Un indicador encima del listado cierra esa pregunta sin tocar qué filas se enseñan.

## What Changes

- La pantalla de la lista enseña, encima del listado, el recuento de tareas hechas sobre el total del equipo y el porcentaje que suponen («3 de 12 hechas · 25 %»).
- El indicador se calcula sobre **todas las tareas no borradas del equipo**, vea lo que vea la lista. Se descartó calcularlo sobre «lo que se está viendo»: la vista por defecto excluye lo hecho y cada filtro enseña un solo estado, así que daría siempre 0 % o 100 % y no diría nada.
- El indicador **no aparece** cuando la lista no tiene ninguna fila a la vista: mientras carga, en el espacio vacío, en un filtro válido sin resultados, ante un filtro inventado y ante un fallo de carga.
- Se mantiene al día sin recargar: crear una tarea, cambiar su estado desde la fila (incluida la vuelta atrás si la petición falla) mueve el recuento en el acto.
- Nuevo `GET /api/v1/tasks/summary`, de solo lectura y con sesión, que devuelve cuántas tareas no borradas hay en cada estado. Hace falta porque el contrato de la lista no permite pedir los tres estados a la vez (y es una regla vigente que no se pueda), y traer tres listas enteras para contar es desproporcionado.
- Si el resumen falla, el indicador no se pinta y la lista sigue funcionando; no se presenta como error de la pantalla.

No hay cambios de esquema ni de datos, y nada es **BREAKING**: el contrato de `GET /api/v1/tasks` no cambia.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `tasks`: se añaden el requisito del resumen por estado (`GET /api/v1/tasks/summary`) y el del indicador de progreso en la pantalla de la lista, con sus condiciones de aparición y de actualización.

## Impact

- **Backend** (por la skill `backend-feature`): ruta nueva en `start/routes.ts` (registrada antes de `:id`), controlador, transformer, y regeneración de `.adonisjs/`. Sin migración.
- **Frontend**: `lib/api.ts` (llamada nueva y su tipo en `lib/types.ts`), `pages/tasks-page.tsx` y un componente nuevo del indicador compuesto con las piezas de `components/ui/`.
- **Documentación**: documento OpenAPI regenerado (diff de `.adonisjs/`), `docs/capabilities/tasks/README.md` y colección de Postman.
- **Dependencias**: ninguna nueva.
