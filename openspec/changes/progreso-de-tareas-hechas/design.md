## Context

La pantalla de la lista (`pages/tasks-page.tsx`) pide `GET /api/v1/tasks` con un único estado como máximo, y filtra otra vez en cliente (`matchesFilter`) para que un cambio de estado saque la fila de la vista sin recargar. La vista por defecto son pendientes y en curso; el contrato de la lista prohíbe expresamente pedir dos estados a la vez y cualquier alcance que mezcle lo hecho con el resto. Por eso la pantalla **no tiene hoy forma de saber el total del espacio**: solo conoce lo que la vista actual trae, más, en un caso concreto, el recuento de hechas (`doneCount`, una segunda consulta que solo se hace con la vista por defecto vacía).

Las tareas borradas van a la papelera (`deleted_at`) y no cuentan. Ver `proposal.md` para el porqué y los requisitos de `specs/tasks/spec.md` para el comportamiento.

No se toca el esquema ni se mueven datos: las reglas 2 a 6 de `docs/convenciones/base-de-datos.md` no aplican a este cambio. El servidor MCP `dbhub` no conectó al iniciar esta sesión (`CONNECTION_CLOSED`), así que la regla 1 (mirar la base real) queda pendiente para el cierre de la tarea de backend; ver Riesgos.

## Goals / Non-Goals

**Goals:**
- Que la pantalla conozca el recuento por estado de todo el espacio con una sola petición pequeña.
- Que el indicador no cuente nunca sobre las filas visibles y no se desincronice tras crear o cambiar de estado.
- Que el indicador se componga con las piezas existentes de `components/ui/` y use solo tokens de `index.css`.

**Non-Goals:**
- Tocar `GET /api/v1/tasks` o la regla de que no existe un alcance «todas».
- Tiempo real entre cuentas: el resumen se pide al entrar y al cambiar el filtro, no se refresca por sondeo ni por eventos.
- Contar por responsable o por periodo.

## Decisions

### 1. Un endpoint de resumen, `GET /api/v1/tasks/summary`

Devuelve `{"data": {"pending", "inProgress", "done", "total"}}` (camelCase, como `createdAt`), con `total` igual a la suma de los tres.

*Alternativas descartadas:*
- **Tres `listTasks` en cliente** (una por estado) y contar las filas: sin tocar el backend, pero trae tres listas completas, con responsable precargado, para quedarse con tres números. La lista no se pagina, así que el coste crece con el espacio.
- **Metadatos o cabecera en `GET /api/v1/tasks`**: cambia el contrato de la lista y su envoltorio `{ data }`, y el valor dependería del filtro o habría que explicar que no depende.
- **Calcularlo en cliente con lo ya cargado**: es justo la opción descartada en la propuesta; da 0 % o 100 %.

La ruta se registra **antes** de `:id`, como ya se hace con `trash`, para que «summary» no se lea como un identificador. Pasa por `serialize()` con un transformer, como el resto.

### 2. Una sola consulta agrupada, excluyendo la papelera con el mecanismo que ya usa el modelo

Un `GROUP BY status` sobre las tareas no borradas. Los estados sin filas salen a `0`. `total` se calcula como `pending + inProgress + done`, no con un `COUNT(*)` aparte: así el porcentaje es coherente aunque exista una fila con un estado fuera de los tres (hoy `tasks.status` es un `varchar(255)` sin `CHECK`). Una fila así no cuenta en ninguna parte del indicador.

### 3. Estado y cálculo en la pantalla, con ajustes locales y sin volver a pedir

La pantalla guarda `summary` junto al resto de su estado. Se pide en el mismo efecto que carga la lista, pero **sin bloquearla**: la lista se pinta cuando llega, y el indicador cuando llegan lista y resumen. Después:

- **Crear**: `pending` y `total` suben uno.
- **Cambiar de estado**: se resta del estado anterior y se suma al nuevo, en el mismo punto donde hoy se pinta el cambio optimista; el `catch` que restaura la fila restaura también el resumen.
- Cambiar el filtro **no** vuelve a pedir el resumen: no depende de él.

*Alternativa descartada:* volver a pedir el resumen tras cada acción. Es más sencillo, pero compite con el pintado optimista (el indicador parpadearía a un valor viejo si la respuesta del resumen llega antes que la del cambio) y duplica tráfico por algo que se sabe calcular.

El porcentaje es `Math.floor(done * 100 / total)`, nunca con `Math.round`, para que «100 %» signifique todo hecho (spec: 299 de 300 es 99 %).

### 4. Cuándo se pinta

Se pinta solo si hay filas visibles (`visibleTasks` con longitud mayor que cero), no hay filtro inválido, el resumen está cargado y `total > 0`. Va dentro de la rama de la pantalla que pinta el `<ul>`, justo encima. Un fallo del resumen deja `summary` a `null`: no pinta el indicador y no toca `loadError`, `statusError` ni `notice`.

### 5. Un componente propio que compone la pieza `Progress` del catálogo

*Revisado al aplicar: la propuesta lo dejaba en solo texto; se pidió una barra.* La barra no se dibuja a mano: se trae `Progress` con `npx shadcn@latest add progress` (queda en `components/ui/progress.tsx`, sin editarla) y `components/task-progress.tsx` la compone. Recibe `done` y `total` y pinta la línea «3 de 12 hechas · 25 %» (`text-muted-foreground text-sm`, concordando con el total: «1 de 1 hecha») y debajo la barra con el mismo porcentaje. Solo tokens de color de `index.css`, ninguno literal. El porcentaje de la barra es el entero redondeado hacia abajo, el mismo que el texto, para que no se contradigan.

Accesibilidad: la barra lleva un nombre accesible («Tareas hechas») y su valor; el texto visible es el que se lee. Sin región `aria-live`: el cambio de estado ya se anuncia en la fila y un segundo anuncio por cada clic sería ruido.

## Risks / Trade-offs

- [Estados fuera de los tres en la base: el indicador los ignora en silencio] → es consecuencia de que no haya `CHECK` (regla 2 de las convenciones), no de este cambio. Al cerrar la tarea de backend se cuentan por `dbhub` las filas con un estado distinto de los tres y se anota el resultado en el PR; no se corrige aquí.
- [Dos pestañas o dos cuentas: el resumen se queda viejo hasta la siguiente carga] → aceptado, igual que la lista, que tampoco se refresca sola. Fuera del alcance.
- [Los ajustes locales pueden divergir del servidor si una acción falla a medias] → el `catch` los revierte con la misma información que ya revierte la fila; una recarga siempre vuelve a la verdad.
- [Un endpoint más que mantener] → es de solo lectura, sin parámetros y con una consulta; entra en el README de la capability y en el OpenAPI.
- [`dbhub` caído en esta sesión] → la comprobación de cierre de `backend-feature` (esquema real y recuento de estados) no se puede hacer hasta que conecte; se reintenta al implementar y, si sigue caído, se dice en el PR en lugar de darla por hecha.
