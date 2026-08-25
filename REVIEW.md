# Instrucciones de revisión

Calibran al revisor automático de [`.github/workflows/revisor.yml`](.github/workflows/revisor.yml).
Solo valen para revisar: cómo se trabaja en este repo está en [`CLAUDE.md`](CLAUDE.md).

## Qué es grave aquí

Solo estas cuatro cosas. Un hallazgo que no encaje en ninguna no es grave.

1. **El código se desvía de un scenario de `openspec/specs/`.** Cita el requisito y el
   scenario. La spec manda sobre el código, sobre el comentario y sobre el nombre del
   método ([ADR 0001](docs/adr/0001-openspec-como-fuente-de-verdad.md)).
2. **Desaparece una guarda que la spec exige.** Un validador que deja de acotar, una
   condición que se cae de una comprobación, un caso que antes se rechazaba y ahora pasa.
3. **Viaja un dato que el transformer no declara**, o una respuesta deja de pasar por un
   transformer de `app/transformers/`.
4. **Un error se vuelve indistinguible de un resultado vacío**, o al revés.

Lo demás es sugerencia: nombres, estructura, duplicación, comentarios, o tests que faltan
en código que este cambio no toca.

## Cuántas sugerencias caben

**Tres por revisión, como mucho** — las de más valor. El resto no se enumera: una línea al
final diciendo cuántas quedan y de qué tipo («4 más: 2 de nombres, 2 de duplicación»). Un
listado largo entierra los hallazgos graves, que es justo lo contrario de revisar.

## Dónde no se reporta

Nada de esto entra, ni siquiera como sugerencia:

- **Formato** — lo escribe Prettier (`npm run format`).
- **Lint** — `npm run lint`: eslint en `backend/`, oxlint en `frontend/`.
- **Tipos** — `npm run typecheck` en `backend/`, `npm run build` en `frontend/`.
- **El documento OpenAPI desactualizado** — lo vigila `npm run openapi:check` desde
  [`.github/workflows/openapi.yml`](.github/workflows/openapi.yml), y tumba el PR por su
  cuenta.
- **Código generado** — `backend/.adonisjs/`, `backend/database/schema.ts`.
- **Componentes de shadcn** — `frontend/src/components/ui/`: se regeneran, no se editan.
- **`package-lock.json`.**
- **Lo que el cambio no toca.** Si no está en el diff, no es de esta revisión.

Callarse en lo que otra comprobación ya vigila no es dejarlo pasar: es no duplicar el aviso.

## Cita, no deduzcas

Para afirmar que algo se comporta de una manera, cita el `archivo:línea` donde lo has
leído. No vale el nombre del método, ni el comentario de encima, ni «esto suele hacerse
así». Lo que no hayas abierto no se afirma: se marca como no verificado y se deja como
pregunta.

No es un temor teórico. `isOverdueOn` se llama así, su docblock anuncia tres condiciones,
y el código comprueba dos.
