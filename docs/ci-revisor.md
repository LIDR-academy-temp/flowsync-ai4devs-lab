# El revisor automático: lo que falta para que funcione

[`.github/workflows/revisor.yml`](../.github/workflows/revisor.yml) lanza la acción
oficial [`anthropics/claude-code-action@v1`](https://github.com/anthropics/claude-code-action)
sobre cada pull request —al abrirlo y en cada push que lo actualice— y publica los
hallazgos **en el propio pull request**: comentarios de línea con
`mcp__github_inline_comment__create_inline_comment` y un resumen con `gh pr comment`.
Lleva `--max-turns 15` y `timeout-minutes: 15`, y pide solo `contents: read` y
`pull-requests: write`.

> **Nada de esto se ha ejecutado todavía.** El workflow está escrito y su YAML es
> válido, pero no ha corrido ni una vez: hasta que existan el secreto y un pull
> request de prueba, no hay ninguna ejecución que lo demuestre.

## Pasos manuales pendientes

### 1. Crear el secreto `ANTHROPIC_API_KEY`

En **Settings → Secrets and variables → Actions → New repository secret**, con ese
nombre exacto (es el que lee el workflow). La clave se saca de
[console.anthropic.com](https://console.anthropic.com) → API Keys.

Sin ese secreto el trabajo falla en el paso de revisión: la acción no tiene con qué
autenticarse.

Si en vez de facturar por API prefieres usar una suscripción de Claude, la acción
acepta `claude_code_oauth_token` en lugar de `anthropic_api_key`; hay que cambiar el
nombre de la entrada en el workflow, no solo el del secreto.

### 2. Comprobar que la organización permite la acción

Si la organización restringe qué acciones se pueden usar
(**Settings → Actions → General → Allowed actions**), `anthropics/claude-code-action`
tiene que estar en la lista. Con la política por defecto no hay nada que hacer.

### 3. Comprobar el permiso de escritura sobre pull requests

El workflow declara `pull-requests: write`, que es lo que necesita para comentar. Una
política de organización puede recortar el `GITHUB_TOKEN` por debajo de lo declarado
(**Settings → Actions → General → Workflow permissions**). Si los comentarios no
aparecen pero el trabajo sale en verde, mira ahí primero.

### 4. Decidir el gasto

Cada pull request lanza una revisión y cada revisión consume crédito de la API. Los
dos topes que lleva el workflow son de *tiempo* y de *turnos*, no de dinero: acotan
cuánto puede alargarse una ejecución, no cuánto puede costar el mes. Si eso importa,
el control está en la consola de Anthropic, no aquí.

### 5. Probarlo

Abre un pull request de prueba contra `main` desde una rama **de este repositorio** y
comprueba en la pestaña Checks que el trabajo corre, y en Files changed que los
comentarios aparecen. Es la primera vez que la acción se ejecuta: cuenta con ajustar
el prompt o los `--allowedTools` después de verla trabajar.

## Los pull requests desde un fork

En un repositorio público, cualquiera puede abrir un pull request desde su fork. **Ahí
este workflow no va a revisar nada, y es a propósito.** GitHub impone dos cosas sobre
un evento `pull_request` que viene de un fork:

- **No pasa los secretos.** Literalmente: «with the exception of `GITHUB_TOKEN`,
  secrets are not passed to the runner when a workflow is triggered from a forked
  repository». Así que `secrets.ANTHROPIC_API_KEY` llega vacío.
- **Degrada el token a solo lectura.** Los permisos de escritura declarados en el
  workflow «are adjusted to change any write permissions to read only», salvo que un
  administrador active *Send write tokens to workflows from pull requests*. Sin
  escritura no hay comentarios que publicar.

Por eso el trabajo lleva esta guarda:

```yaml
if: github.event.pull_request.head.repo.full_name == github.repository
```

Sin ella, cada contribución externa arrastraría un fallo rojo que no dice nada útil
sobre el código. Con ella, el trabajo aparece como *skipped* y el pull request queda
para revisión humana.

Ojo con el atajo tentador: activar *Send write tokens…* devuelve la escritura pero
**no** devuelve los secretos, así que el revisor seguiría sin poder autenticarse. No
resuelve el problema.

### Si algún día quieres cubrir también los forks

Ninguna de estas opciones está implementada aquí. Las tres tienen coste:

| Opción | Qué hace | Qué te cuesta |
|---|---|---|
| `pull_request_target` | Corre con los secretos y el token del repositorio base | Ejecuta con **tus** secretos en un contexto donde el código propuesto es de un desconocido. La documentación de la acción avisa: no metas la rama del fork en la raíz del workspace; se saca el base en la raíz y la rama propuesta va a un subdirectorio con `--add-dir` |
| `workflow_run` | Se dispara tras otro workflow ya ejecutado, con los secretos del base | Mismo riesgo de fondo. La acción comprueba el acceso del actor que originó la ejecución, y hay que combinarlo con `allowed_non_write_users` |
| Nada | Los forks los revisa una persona | Cero riesgo, cero automatización |

Para un repositorio de prácticas, la tercera es la respuesta razonable. Si esto fuera
un repositorio abierto de verdad, la conversación empieza por leer
[la guía de seguridad de la acción](https://github.com/anthropics/claude-code-action/blob/main/docs/security.md),
no por copiar un `pull_request_target` de internet.

## Lo que este revisor no es

No sustituye al pase del subagente `adversarial-reviewer` que piden las reglas de
proceso de [`CLAUDE.md`](../CLAUDE.md): aquel corre en local sobre la unidad de trabajo
terminada y contrasta contra `openspec/specs/`. Este comenta cambios propuestos, uno a
uno, y puede equivocarse: sus hallazgos son una opinión más en el pull request, no una
puerta que haya que pasar. Quien decide sigue siendo quien revisa.
