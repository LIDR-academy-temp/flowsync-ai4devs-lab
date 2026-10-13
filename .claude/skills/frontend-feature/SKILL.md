---
name: frontend-feature
description: Procedimiento obligatorio para cualquier pieza de interfaz nueva del frontend de FlowSync. Explora el encargo y el catálogo, propone un plan con la pieza, de dónde sale cada parte (catálogo, CLI de shadcn, o nueva y declarada) y la lista de estados con su historia, y se para a esperar aprobación. Después escribe las historias con el subagente story-writer, comprueba con make test-ui que fallan, las congela por su huella, construye la pieza con el subagente ui-implementer hasta el verde y comprueba que las historias no cambiaron. Cierra con lint, build, commit en una rama feat/… y un pull request. Usar siempre que una tarea cree una pieza de interfaz, aunque nadie lo pida.
---
# Una pieza de interfaz, del encargo a verde

Este es el orden, y no se cambia: **explorar → plan → (aprobación) → historias → rojo → congelar → construir → verde → huella intacta → cierre**. Cada paso existe porque sin él algo salió mal o solo salió bien porque alguien lo pidió entero y en orden.

Rutas: `make` desde la **raíz** del repo. Los comandos de Node (`npm`, `npx`), desde **`frontend/`**.

## 0. Antes de empezar

- Rama: la de `CLAUDE.md` («Reglas de proceso»). Si estás en `main` o en una `sN/*`, crea `feat/<slug>`. Si ya es una rama de trabajo, sigues en ella.
- Mira `git status --short` y apunta lo que ya estaba sin commitear. No es de esta tarea, no se commitea con ella y los subagentes no deben tocarlo.
- Línea base: `make test-ui` y apunta cuántas historias pasan hoy y cuáles (si alguna ya falla, no es de esta tarea). Si falta el Chromium de las pruebas: `cd frontend && npx playwright install chromium`.

## 1. Explorar

- **El encargo.** Qué se pide, dónde se va a usar y qué hace una persona con ello. Si el encargo no dice qué estados tiene la pieza, no los inventes: pregúntalo al plan.
- **El catálogo, leído en el archivo, no supuesto.** `frontend/src/components/ui/`: qué piezas hay, y de cada una las variantes, los tamaños y las props que declara de verdad. Hoy: `alert`, `button`, `card`, `input`, `label`, `progress`. Los atributos que importan para la interfaz están en `cva(...)`, no en la memoria de cómo suele ser shadcn: este `Button` tiene ocho tamaños, no cuatro.
- **Lo que ya hay fuera del catálogo**, en `frontend/src/components/` y en las pantallas: para reutilizar y no duplicar. `components.json` dice qué trae el CLI y dónde lo deja.
- **Los valores con nombre**: `frontend/src/index.css`. El color de la pieza sale de ahí.
- **Las historias existentes**, `*.stories.tsx`, para que las nuevas sigan el mismo estilo.
- Decide las **piezas de contrato** que las historias van a fijar y que la implementación tendrá que respetar: el archivo de la pieza, lo que exporta y sus props, y los argumentos de cada estado. Si no se fijan ahora, quien escribe las historias y quien construye eligen nombres distintos.

## 2. Plan, y PARA

Presenta el plan en dos tablas. Ninguna fila se omite; lo que no haga falta se declara con su porqué.

**De dónde sale cada parte**

| Parte | Archivo | Origen | Detalle |
|---|---|---|---|
| (cada pieza o elemento de la interfaz) | `frontend/src/components/…` | **catálogo** (`ui/<pieza>`) · **CLI** (`npx shadcn@latest add <x>`) · **nueva y declarada** | para «CLI»: qué trae y que se revisará `package.json`; para «nueva»: **por qué el catálogo no sirve**, que irá en un comentario |

**Estados e historias**

| Estado | `args` | ¿Interacción? | Qué afirma | Historia (`export const`) |
|---|---|---|---|---|

Un estado = una historia. Lleva interacción todo estado con comportamiento (se pulsa, se escribe, se abre…), y lo que afirma se dice aquí, en el plan.

Debajo de las tablas, añade:
- las piezas de contrato del paso 1 (archivo, export, props);
- los colores: «solo tokens de `index.css`», o cada excepción pedida;
- dónde se usa la pieza, si hay que tocar una pantalla;
- lo que queda fuera.

**Detente aquí y espera la aprobación explícita.** No lances ningún subagente, no traigas nada con el CLI y no crees ningún archivo antes. Si piden cambios, rehaz el plan y vuelve a parar.

## 3. Historias: subagente `story-writer`

Lánzalo en primer plano, porque lo siguiente depende de él. Pásale:
- el encargo y las dos tablas del plan aprobado;
- las piezas de contrato (archivo, export, props) y los `args` de cada estado;
- las rutas exactas de los `*.stories.tsx` que debe crear.

No le pases la implementación de la pieza ni la pantalla: no puede leerlas. Al volver:
- `git status --short`: **solo** aparecen los `*.stories.tsx` del plan encima de lo que ya había. Si ha creado o tocado otra cosa, se deshace y se dice.
- Lee las historias tú: una por estado, `args` como datos, `play` en cada estado con comportamiento y con aserciones, elementos localizados por rol o texto, ni esperas fijas ni red ni hora.
- `cd frontend && npx prettier --check src && npx oxlint`.

## 4. Comprueba el rojo

```bash
make test-ui > <scratchpad>/rojo.txt 2>&1; sed 's/\x1b\[[0-9;]*m//g' <scratchpad>/rojo.txt | grep -E 'FAIL|Test Files|Tests '
```

- Todas las historias nuevas tienen que fallar **y por el motivo esperado**. Una pieza nueva falla porque su `import` no resuelve: enséñalo. Si la pieza ya existía, falla cada estado nuevo por su aserción.
- **Si una historia nace en verde, para y dilo.** No sigas. Se arregla volviendo a `story-writer`, nunca dejándola pasar. Una historia con interacción que pasaría con un `<div>` vacío no afirma nada.
- Las historias que ya existían siguen igual que en la línea base del paso 0.

## 5. Congela las historias

```bash
git add <las historias nuevas>
shasum <las historias nuevas> | tee <scratchpad>/congeladas.sha
```

Enseña la huella en el chat. Esa huella es la garantía: no hay hook ni script que la sustituya. Si la sesión no tiene scratchpad, guárdala donde puedas volver a leerla y no la commitees.

## 6. Construcción: subagente `ui-implementer`

Lánzalo en primer plano con:
- el encargo;
- el plan aprobado entero (las dos tablas y las decisiones);
- las rutas de las historias congeladas;
- la lista de cambios ajenos sin commitear del paso 0.

Trabaja hasta que `make test-ui` salga en verde.

**Disputas.** Si devuelve una, se la trasladas a quien aprobó el plan tal cual: historia, archivo y línea, lo que dice el encargo, lo que exige la historia y la propuesta. No cambias la historia tú, y él tampoco. Si se acepta, la corrige `story-writer`, se vuelve a comprobar el rojo de esa historia y se vuelve a congelar (pasos 4 y 5) antes de seguir con `ui-implementer`.

## 7. Verde y huella intacta

```bash
shasum -c <scratchpad>/congeladas.sha
git diff --stat -- <las historias>      # vacío: nada sin stagear encima de lo congelado
make test-ui                            # tú, no solo el subagente
git diff package.json package-lock.json # solo lo que el plan preveía
```

Si la huella no cuadra, la pieza no se da por buena aunque esté en verde: dilo y para.

Si el CLI de shadcn ha traído algo, repasa tú el resultado, no solo el informe: el archivo generado entero y el diff de `package.json`.

**Una interacción tiene que poder fallar.** Para cada pieza con historias de interacción, una vez: copia una de ellas a un archivo temporal `zz-*.stories.tsx` con el estado roto a propósito (el campo `disabled`, el botón sin su `onClick`, otro valor), comprueba que `make test-ui` **falla solo en esa copia**, y **bórrala**. Así sabes que la historia afirma algo y no solo pasa.

## 8. Cierre

1. **Lint y build del frontend**, limpios:
   ```bash
   cd frontend && npm run lint && npm run build && npx prettier --check src
   ```
   `npm run build` es el typecheck. Los `e2e/` y `playwright.config.ts` no entran en él.
2. **Colores**: `grep` en lo nuevo de un hexadecimal o de una clase como `bg-blue-600`. Solo debería salir lo que el plan declaró como excepción, y con su comentario.
3. **Mirarla.** Una vez, de verdad: `make ui` y abre cada historia nueva; o, sin ventana, un script de Playwright contra `iframe.html?id=<ruta>-<archivo>--<historia>` (el id de `components/ui/alert.stories.tsx` es `components-ui-alert--texto-largo`). Pasar las comprobaciones no dice que se vea bien.
4. **Commit**, con la skill `/commit`, sobre la rama `feat/<slug>` (nunca en `main` ni en una `sN/*`). Se añaden **solo** los archivos de esta tarea; lo ajeno del paso 0 se queda fuera. Si el hook `datos-que-no-salen.sh` bloquea, no se esquiva: se arregla el dato (correos solo en `example.com`) y se vuelve a intentar.
5. **Pull request**: `git push -u origin <rama>` y `gh pr create` con una descripción completa en el cuerpo: qué pieza, de dónde sale cada parte, los estados con su historia, la huella de las historias congeladas, lo que trajo el CLI y lo que se quitó, y cómo mirarla. Si el pre-push (`make hooks`) está activo, corre `make test-ui` antes de subir; no se salta con `--no-verify`. El PR dispara el workflow de Chromatic. Si la rama ya tiene un PR abierto, no se abre otro: se empuja a él.
6. **`adversarial-reviewer`** sobre ese PR, como último paso antes de dar la unidad por terminada (`CLAUDE.md`). Cuando abras el PR, no repitas su resumen en el chat: responde con la URL, y con los hallazgos del review si los hay.

Esta skill **no** lanza `make test-web`: el recorrido de navegador es uno solo, necesita la aplicación levantada, y lo que se puede provocar fijando las entradas de una pieza se comprueba en su historia. No se añade un recorrido por pieza.

## Lo que ya se aprendió haciéndolo

- **El CLI de shadcn coló un paquete la primera vez.** `npx shadcn@latest add progress` generó `import { cn } from "cn"` y **añadió `cn` a `package.json`**, un paquete de npm sin relación con nuestro `@/lib/utils`. Por eso el diff de `package.json` y el `import` del archivo generado se revisan antes de seguir. Se arregla con `npm uninstall cn --legacy-peer-deps` y el import a `@/lib/utils`.
- **El mismo componente no reenviaba `value` a Radix**: la barra se dibujaba bien y no tenía `aria-valuenow`. Una barra, un interruptor o un desplegable generados se comprueban en su valor accesible, y la historia lo afirma.
- **El CLI escribe sin pasar por Prettier** (comillas dobles, con `;`): el hook de Prettier solo corre cuando Claude edita un archivo. `npx prettier --write` sobre lo que cree.
- **`npm install` reordena alfabéticamente `devDependencies`**: el diff de `package.json` parece mayor de lo que es. Lo que importa es qué entradas aparecen.
- **Las dependencias del frontend se instalan con `--legacy-peer-deps`**, como el resto del proyecto.
- **Retocar una pieza del catálogo sin editarla.** Un `className` en un envoltorio de Radix llega a la raíz, no a sus hijos. Para teñir el relleno de la barra se usó `[&>[data-slot=progress-indicator]]:bg-blue-600` en la pieza propia, sin tocar `ui/progress.tsx` para eso (el catálogo solo se corrige para arreglar lo que el CLI generó mal).
- **Un color a pelo es una decisión que se declara**, con un comentario en el propio componente y una línea en el diseño. El hook `color-con-nombre.sh` avisa siempre; que aviste no significa que esté mal, significa que se ve.
- **Los `*.stories.tsx` no admiten exportaciones generadas en un bucle**: Storybook las analiza de forma estática. Las 48 combinaciones de `Button` salieron de un script desechable que escribió el texto, pasado por Prettier.
- **Un ancho de columna en las historias** (`decorators` con `max-w-md`) es lo que hace que un texto largo se parta en dos líneas; con el lienzo entero no se ve el caso.
- **El preview de Storybook importa `src/index.css`.** Sin eso las historias salen sin Tailwind ni tokens, y parecen rotas.
- **Las interacciones se localizan por rol y nombre accesible** (`getByRole('textbox', { name: '…' })`), con `userEvent` y `expect` de `storybook/test`. Lo que no se pueda localizar así suele ser una señal de que a la pieza le falta nombre accesible.
- **`make test-ui` necesita el Chromium de Playwright.** Si falta: `cd frontend && npx playwright install chromium`. Un fallo de entorno no es un fallo de la pieza: dilo.
- **El shell de la sesión es zsh**: una variable con varias palabras (`P="git -c … push"; $P …`) no se separa en palabras. Para repetir un comando, una función.
- **Un `pre-push` que fallase por el entorno acaba desactivado.** Por eso `make test-ui` entra y `make test-web` no.
