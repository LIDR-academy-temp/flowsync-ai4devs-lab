---
name: frontend-feature
description: Procedimiento obligatorio para cualquier pieza de interfaz nueva del frontend de FlowSync. Explora el encargo y el catálogo (frontend/src/components/ui/), propone un plan con la pieza, de dónde sale cada parte (catálogo, CLI de shadcn o nueva y declarada) y la lista de estados con su historia, y se para a esperar aprobación. Después lanza el subagente story-writer, comprueba con make test-ui que las historias nuevas fallan, las congela por su huella, lanza ui-implementer hasta el verde y comprueba que las historias no cambiaron. Cierra con lint y build, commit en una rama feat/ y pull request. Usar siempre que una tarea cree o cambie una pieza de interfaz, aunque nadie lo pida.
---
# Una pieza de interfaz, del encargo al verde

Este es el orden, y no se cambia: **explorar → plan → (aprobación) → historias → rojo → congelar → implementar → verde → huella intacta → cierre**. Es el mismo esqueleto que `backend-feature`, con las historias de Storybook haciendo de tests de contrato: describen cada estado de la pieza y, donde hay comportamiento, lo comprueban.

Rutas: `make` desde la **raíz** del repo; `npm` y `npx` desde **`frontend/`**. Usa un subshell, `(cd frontend && …)`, o `make -C <raíz>`: un `cd` suelto se queda puesto y el comando siguiente falla en el directorio equivocado («No rule to make target `test-ui`»).

## 0. Antes de empezar

- Rama: la de `CLAUDE.md` («Reglas de proceso»). Si estás en `main` o en una `sN/*`, crea `feat/<slug>`. Si ya es una rama de trabajo, sigues en ella.
- `git status --short`: apunta lo que ya estaba sin commitear. No es de esta tarea, y los subagentes no deben tocarlo.
- Línea base: `make test-ui` en verde antes de tocar nada, y apunta cuántos tests hay (`Tests N passed`). Si ya fallaba algo, no se lo atribuyas a esta tarea.
- Si el encargo incluye datos de la API, mira antes el contrato en `docs/capabilities/<capability>/README.md` y `lib/api.ts`: una pieza no llama a la red, la pantalla que la usa sí.

## 1. Explorar

- Lee el encargo entero. Separa **qué hace la pieza** de **cómo se ve**, y apunta los casos que el encargo no dice (vacío, cargando, error, deshabilitado, texto largo).
- **Mira el catálogo antes de decidir nada**: `ls frontend/src/components/ui/` y lee los archivos que pueden servir. Las variantes y los tamaños se leen del archivo (`buttonVariants`, `alertVariants`…), no se suponen. La lista de verdad es el directorio.
- Mira lo que ya hay fuera del catálogo (`frontend/src/components/*.tsx`) por si la pieza ya existe o se parece, los tokens de `frontend/src/index.css` y las historias existentes (`**/*.stories.tsx`) como guía de estilo.
- Decide el **contrato**: ruta del archivo, nombre que exporta y props. Es lo que `story-writer` y `ui-implementer` tienen que compartir sin verse; si no se fija ahora, cada uno elige un nombre distinto.

## 2. Plan, y PARA

Presenta el plan con tres tablas y nada más. Una parte sin origen no se omite: se declara.

**a) La pieza**

| Pieza | Archivo | Exporta | Props (el contrato) | Historias en |
|---|---|---|---|---|

**b) De dónde sale cada parte**

| Parte | Origen | Detalle |
|---|---|---|
| (un botón, un aviso, un campo, un icono…) | **catálogo** / **CLI** / **nueva y declarada** | catálogo: qué pieza y qué variante o tamaño; CLI: `npx shadcn@latest add <x>`; nueva y declarada: por qué no vale el catálogo |

- Si falta una pieza, **se trae con el CLI**, no se escribe a mano.
- «Nueva y declarada» es un elemento de interfaz dibujado a mano fuera de `ui/`: una decisión, con un comentario en el componente que diga por qué. Un contenedor de maquetación no cuenta.
- Los colores salen de los tokens de `index.css`. Si el encargo pide un color que no existe, dilo aquí: el hook `color-con-nombre.sh` avisará.

**c) Estados e historias**

| Estado | Historia (nombre del export) | ¿`play`? | Qué comprueba |
|---|---|---|---|

Una fila por estado, no una por pieza. Cada estado con comportamiento (escribir, pulsar, abrir, un callback) lleva su función de interacción; los que solo cambian el aspecto, no. Cuenta las filas: serán los tests nuevos de `make test-ui`.

Debajo de las tablas, añade:
- las decisiones abiertas que vea quien aprueba (¿el estado vacío es un error o un mensaje?, ¿qué pasa con un texto muy largo?, ¿accesible solo con teclado?);
- los estados que quedan fuera, con su porqué;
- si la pieza toca una capability (rutas, controladores, README de `docs/capabilities/`), qué hay que actualizar.

**Detente aquí y espera la aprobación explícita.** No lances ningún subagente ni crees ningún archivo antes. Si piden cambios, rehaz el plan y vuelve a parar. Una aprobación vale para ese plan: si cambia, se vuelve a pedir.

## 3. Historias: subagente `story-writer`

Lánzalo y **espera su informe antes de seguir**: lo siguiente depende de él. Pásale el plan aprobado entero (las tres tablas), la ruta donde van las historias y el contrato. No le pases la implementación: no existe, y no puede leerla.

Al volver, lee el archivo tú: una historia por estado del plan ni más ni menos, `args` como datos, nada de red ni de hora, `play` solo donde el plan lo pide y con aserciones, y los elementos localizados por rol, etiqueta o texto (nunca por clase ni por `data-slot`). Comprueba que `npx prettier --check` y `npx oxlint` pasan sobre él, desde `frontend/`.

## 4. Comprueba el rojo

```bash
make test-ui > <scratchpad>/rojo.txt 2>&1; sed 's/\x1b\[[0-9;]*m//g' <scratchpad>/rojo.txt | grep -E 'FAIL|×|✓|Test Files|Tests |Error|Failed to resolve' | head -60
```

- Las historias nuevas tienen que fallar **y por un motivo que se entienda**: la pieza aún no existe (`Failed to resolve import`) o la aserción no se cumple. Enseña por qué falla cada una.
- **Si alguna nace en verde, para y dilo.** Pasa cuando la pieza ya existía (una historia de un componente del catálogo) y la historia solo afirma lo que ya se ve, o cuando un `play` no tiene aserciones. Se arregla volviendo a `story-writer` para que la historia afirme algo que hoy no se cumple, nunca dejándola pasar.
- Las historias que ya existían tienen que seguir como en la línea base. Si un import roto de la pieza nueva tira abajo también los archivos de historias existentes, apúntalo: es del rojo, no una regresión.

## 5. Congela las historias

```bash
git add <ruta-de-las-historias>
shasum <ruta-de-las-historias> | tee <scratchpad>/congeladas.sha
```

Enseña la huella en el chat. Esa huella es la garantía: no hay hook ni script que la sustituya. Si la sesión no tiene scratchpad, guárdala donde puedas volver a leerla y no la commitees.

## 6. Implementación: subagente `ui-implementer`

Lánzalo y espera su informe. Pásale el plan aprobado entero, la ruta de las historias congeladas y la lista de cambios ajenos sin commitear del paso 0. Trabaja hasta que `make test-ui` sale en verde, trayendo con el CLI lo que falte y revisando lo que el CLI toca.

**Disputas.** Si devuelve una, se la trasladas a quien aprobó el plan tal cual: historia, archivo, lo que dice el plan, lo que exige la historia y la propuesta. No cambias la historia tú, y él tampoco. Si se acepta, la corrige `story-writer`, se vuelve a comprobar el rojo de esa historia y se vuelve a congelar (pasos 4 y 5) antes de seguir.

## 7. Verde y huella intacta

```bash
shasum -c <scratchpad>/congeladas.sha
git diff --stat -- <ruta-de-las-historias>   # vacío: nada sin stagear encima de lo congelado
git status --short                           # nada nuevo fuera de la pieza y de lo que ya había
make test-ui                                 # tú, no solo el subagente
```

Si la huella no cuadra, la implementación no se da por buena aunque esté en verde: dilo y para. Contrasta además el número de tests con el plan: línea base + las filas de la tabla de estados.

## 8. Cierre

### 8.1 Lo que el subagente pudo haber dejado

- `git diff -- frontend/package.json frontend/package-lock.json`: solo las dependencias que el plan esperaba. Una que no entiendas es un colado: se quita con `npm uninstall <paquete> --legacy-peer-deps`, nunca con `git checkout` de `package.json` si tiene otros cambios sin commitear.
- Los archivos nuevos de `components/ui/` que haya traído el CLI: imports solo de `react`, `radix-ui`, `class-variance-authority`, `lucide-react` y `@/…`, y formateados con Prettier.
- El hook de colores no puede haber dejado avisos sin explicar. Un color a pelo que se queda se declara en un comentario del componente y en el informe.

### 8.2 Lint y build

```bash
(cd frontend && npm run lint && npm run build)
```

Los dos limpios. El typecheck vive dentro del build.

### 8.3 Verlo

`make ui` arranca el catálogo en `http://localhost:6006` para mirar las historias y el panel de accesibilidad (está en `todo`: las violaciones se ven, pero no hacen fallar `test-ui`). Si la pieza ya está montada en una pantalla, mírala con la aplicación en marcha. Si no hay navegador conectado, dilo: no des por visto lo que no se ha visto. `make test-web` solo cuando el encargo cambia el recorrido de varias piezas; necesita la aplicación en marcha y deja datos en la base de desarrollo.

### 8.4 Commit, rama y pull request

Según las «Reglas de proceso» de `CLAUDE.md`:
1. La rama es `feat/<slug>` (la que ya tenías, o la que creaste en el paso 0). Nunca commit directo en `main` ni en una `sN/*`.
2. Commit con la skill `/commit`. Si el cambio toca la interfaz de una capability, el README de `docs/capabilities/<nombre>/README.md` va en el mismo commit.
3. Al terminar la unidad de trabajo, una sola vez: `git push` (el hook `pre-push` corre `make test-ui`; si no está instalado, `make hooks`) y `gh pr create` con una descripción completa en el cuerpo: qué pieza, de dónde sale cada parte, la tabla de estados e historias, qué se trajo del CLI y qué se revisó, y lo que no se pudo ver. En cada pull request el workflow `chromatic.yml` publica el Storybook en Chromatic: la revisión visual está ahí.
4. El pase del subagente `adversarial-reviewer` sobre ese PR es lo último, antes de dar la unidad por terminada.
5. Cuando abras el PR, no repitas el resumen en el chat: responde solo con la URL.

### 8.5 Informe final (si no se abre PR en esta petición)

- Tabla pieza → archivo, y parte → origen (catálogo / CLI / nueva y declarada).
- Tabla estado → historia → rojo (con el motivo) → verde, con el número de tests.
- La huella: `shasum -c` en OK.
- Lo que trajo el CLI y lo que se quitó; lint y build; lo que no se pudo ver.
- Disputas, decisiones abiertas y todo lo que se hizo fuera del plan.

## Lo que ya se aprendió haciéndolo

- **El CLI de shadcn cuela cosas.** `npx shadcn@latest add progress` trajo el archivo con `import { cn } from "cn"` y, para satisfacerlo, **instaló un paquete de npm ajeno llamado `cn`** en `package.json`. Hay que mirar el diff de `package.json` y de los `import` del archivo generado antes de seguir, y arreglar el import a `@/lib/utils`. El archivo del CLI llega además con comillas dobles y punto y coma: el hook de Prettier no lo toca, hay que pasarlo.
- **No restaures `package.json` con git cuando tenga otros cambios.** La primera vez bastó `git checkout -- package.json package-lock.json` porque no había nada más; hoy ya tiene Storybook y Playwright sin commitear, y se los llevaría por delante. `npm uninstall <paquete> --legacy-peer-deps`, y `npm ls <paquete>` para ver que no queda.
- **`cd` se queda puesto.** Tras un `cd frontend` suelto, `make test-ui` falla con «No rule to make target» porque el `Makefile` está en la raíz. Subshell o `make -C`.
- **Un `ui/*.tsx` no se edita, y se estiliza desde fuera.** Para cambiar el relleno de la barra sin tocar `ui/progress.tsx` se usó una variante arbitraria sobre la raíz: `className="[&>[data-slot=progress-indicator]]:bg-…"`. Eso es lo que el catálogo deja.
- **Los colores a pelo avisan, no bloquean.** `color-con-nombre.sh` sale con 2 en PostToolUse: la edición ya está hecha. Si el color es una petición expresa, se deja y se declara en un comentario; si no, se vuelve a los tokens.
- **Las historias son datos y se comprueban.** `args` en vez de cuerpo; un campo o un botón de solo icono lleva `aria-label` (lo exige el addon de accesibilidad y es por lo que se localiza); los hijos de `Alert` son JSX fijo dentro de `args.children`. En el `play`, `canvas` y `userEvent` vienen del contexto y `expect` de `storybook/test`; se localiza con `getByRole('textbox', { name })`, nunca por clase.
- **Una historia con `play` se prueba rompiéndola.** `EscribirYBorrar` se verificó cambiando a propósito la aserción final y viendo que `make test-ui` fallaba solo en esa historia. Una aserción que no puede fallar no comprueba nada.
- **El rojo de una pieza que no existe es un import roto.** Vale como rojo si se entiende; lo que no vale es una historia que pase sin pieza.
- **El aviso «No story files found … `*.mdx`» es inofensivo**: el patrón de `.storybook/main.ts` ya no encuentra ningún `.mdx`.
- **`.storybook/preview.tsx` importa `index.css`.** Sin eso las historias se pintan sin Tailwind ni tokens y no representan el catálogo real.
- **`make test-web` no entra en este bucle.** Necesita la aplicación entera en marcha (`make start`) y deja una cuenta y una tarea nuevas en la base de desarrollo en cada pasada. Las historias son estados de un componente; el recorrido de varias piezas es otra altura.
- **El resultado de un comando hay que mirarlo, no suponerlo.** Cuando el navegador de Claude no estaba conectado no se dio por vista la barra; cuando el test falló con `ERR_CONNECTION_REFUSED`, no decía nada sobre el test. Qué se ha visto y qué no, se dice.
- **El `pre-push` corre `make test-ui`** (`make hooks` lo instala, una vez por clon). `--no-verify` lo salta, y quien revise no verá que no pasó.
