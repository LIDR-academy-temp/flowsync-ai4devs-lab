## Context

La pantalla `frontend/src/pages/tasks-page.tsx` carga la lista con `GET /tasks` y guarda en `tasks` solo lo que pide el filtro de la URL. Con la vista por defecto (`DEFAULT_LIST_STATUSES`: pendientes y en curso) las hechas no llegan nunca al cliente, y con un filtro de un solo estado llega únicamente ese estado. Por eso `tasks` no sirve para calcular el avance del equipo, y por eso la propuesta mide el equipo entero y no «lo que se ve» (ver `proposal.md`, Why).

El backend ya garantiza lo necesario: el spec dice que no existe un alcance que mezcle las hechas con el resto, que la lista llega entera sin paginar, y que las borradas no salen. Así que `total = tareas de la lista por defecto + tareas de status=done` es exacto con las dos consultas que ya existen. El cambio es solo de frontend y **no toca el esquema ni los datos**, por lo que no aplica la sección `## Reversibilidad`.

## Goals / Non-Goals

**Goals:**
- Un indicador «X de Y hechas · Z %» encima del listado, independiente del filtro y coherente con las acciones de la pantalla.
- Cero cambios de backend, de API, de OpenAPI y de Postman.
- Sin colores literales ni elementos de interfaz a mano que el catálogo de `ui/` ya sepa hacer.

**Non-Goals:**
- Gráficos más allá de la barra.
- Refrescar el indicador por sondeo cuando otra persona cambia algo (la lista tampoco lo hace); solo se pone al día con las acciones propias o al recargar.
- Un endpoint de recuento en el backend.
- Refactorizar `doneCount`, el recuento que ya usa el final «No queda nada pendiente ni en curso».

## Decisions

**1. El total sale de dos consultas existentes, no de un endpoint nuevo.**
`Promise.all([listTasks(token), listTasks(token, 'done')])` y `done = hechas.length`, `total = abiertas.length + hechas.length`. *Alternativa:* `GET /tasks/count`. Exigiría pasar por `backend-feature` (contrato, tests, OpenAPI, Postman) para ahorrar transferir listas que el cliente ya sabe pedir enteras. *Coste asumido:* se traen filas solo para contarlas; ver Riesgos.

**2. El avance es un estado propio, `progress: { done, total } | null`, no una derivación de `tasks`.**
`tasks` es un subconjunto (el que deja pasar el filtro) y cambia con él. El avance se pide una vez por sesión de la pantalla (depende de `token`, no de `statusParam`), así que cambiar de filtro no lo recarga ni lo parpadea. `null` significa «no se muestra»: cargando, fallo o espacio sin tareas (`total === 0`).

**3. Las acciones propias ajustan el estado por deltas, con la misma optimización y reversión que ya tiene la fila.**
- Crear: `total + 1` (toda tarea nace pendiente).
- Cambiar estado: `done + 1` si el destino es `done` y el origen no; `done - 1` en el caso inverso; nada si es entre pendiente y en curso.
- En el `catch` de `handleChangeStatus` se aplica el delta inverso, junto a la reversión de la fila.

*Alternativa:* volver a pedir las dos listas tras cada acción. Es siempre exacto, pero incumple «al instante» y duplica el tráfico por clic. *Alternativa:* contar sobre `tasks`: falso, por lo dicho en la decisión 2.

**4. Cada ajuste local se confirma contra el servidor, y gana siempre la última respuesta.**
Los deltas dan lo «instantáneo», pero una carga que salió antes de una acción puede traer una cifra que ya no incluye su efecto. Un contador de versión (`useRef`) sube con cada petición de recuento y con cada ajuste local; una respuesta solo se aplica si sigue siendo la última. Tras cada acción (al crear, y al terminar el cambio de estado, sea bueno o malo) se vuelve a pedir el recuento, de modo que la cifra final es siempre la del servidor y además recoge lo que hayan hecho otras personas. *Alternativa descartada:* descartar y repetir solo la carga inicial (la versión «época» de la primera redacción): deja un desfase de uno si el servidor aún no había aplicado el cambio cuando se repite la consulta. *Coste:* dos consultas más por acción. Si la petición falla, `progress` queda en `null` sin mensaje de error (o conserva la cifra buena que ya tenía): es información secundaria y el spec prefiere no enseñar nada a enseñar algo falso.

**5. El porcentaje es una función pura con el redondeo acotado.**
`Math.round(done / total * 100)`, pero con el resultado forzado a `1` si hay alguna hecha y redondea a 0, y a `99` si queda alguna por hacer y redondea a 100. 0 % solo con `done === 0` y 100 % solo con `done === total`. Como el frontend no tiene runner de tests, la función va aislada y sin dependencias para poder comprobarla a mano con casos límite.

**6. Presentación: texto más barra, en un componente nuevo, `components/team-progress.tsx`.**
Una línea `<p>` con «3 de 12 tareas hechas · 25 %» (singular con total 1) y debajo una barra con `Progress` de shadcn, traída con `npx shadcn@latest add progress` en `components/ui/progress.tsx` (el catálogo no la tenía; no se dibuja a mano). El texto se mantiene porque el spec exige el recuento y porque una barra sola no se lee con precisión ni para quien no la ve. La barra lleva `aria-label` y recibe el mismo porcentaje que el texto. Solo tokens de `index.css` (`bg-primary`, `bg-primary/20`), `text-muted-foreground text-sm` como los párrafos vecinos. El contenedor lleva `role="status"`.

**7. Ubicación: justo encima del listado, tras los avisos.**
Se pinta inmediatamente antes del bloque que resuelve la lista (cargando / filtro inválido / filas / finales vacíos), después de los avisos de error y de «notice». *Alternativa descartada:* bajo el filtro y antes de los avisos (la propuesta inicial): no es «justo encima del listado» y deja los avisos entre la barra y las filas.

## Risks / Trade-offs

- **Se traen listas enteras para contar** → aceptable al tamaño de un equipo; si el espacio crece, el siguiente paso es el endpoint de recuento (decisión 1), que no cambia el spec.
- **La cifra puede quedar atrás si otra persona cambia algo** → igual que la propia lista; se corrige con la siguiente acción propia o al recargar.
- **El CLI de shadcn generó mal `Progress`** (importaba `cn` del paquete npm `cn`, que no es nuestra utilidad, y no reenviaba `value` a Radix, con lo que la barra no anunciaba su valor) → se ha corregido a mano el import y el reenvío, y se ha retirado la dependencia `cn` que se instaló sin que nadie la pidiera.
- **Dos copias de la lógica de estados (`DEFAULT_LIST_STATUSES` y el delta de `done`)** → el delta solo mira `done`, que es uno de los tres estados fijos del dominio, no el conjunto por defecto.
- **Duplicidad con `doneCount`** (misma consulta `status=done` en la vista por defecto vacía) → se deja como está para no tocar un comportamiento ya especificado; es una limpieza posterior.
- **El frontend no tiene tests automáticos** → la verificación del spec es manual; las tareas la listan escenario a escenario.
