#!/usr/bin/env bash
# PostToolUse (Write|Edit): AVISA (exit 2) cuando lo que se acaba de escribir en
# `frontend/src/` lleva un color a pelo:
#   - un hexadecimal literal (#fff, #1a2b3c, #1a2b3c80);
#   - una clase de paleta cruda de Tailwind: utilidad + familia + número
#     (bg-blue-600, text-red-500, hover:border-t-gray-200, ring-sky-400/50).
# El valor con nombre (--primary, --destructive...) está en `frontend/src/index.css`,
# que queda exceptuado: es la capa donde el literal se escribe, y una sola vez.
#
# AVISA, NO BLOQUEA. Es PostToolUse: la edición ya está hecha y el exit 2 solo le
# pone el mensaje delante al agente. Hay casos legítimos; lo que se busca es que la
# desviación se vea, no que sea imposible.
#
# ESTO ES UNA RED, NO UN CANDADO. Lo que NO ve:
#   - Colores que no sean hexadecimales ni de la paleta cruda: `rgb()`, `hsl()`,
#     `oklch()`, nombres CSS (`red`), valores arbitrarios (`bg-[#fff]` sí lo ve por
#     el hexadecimal, pero `bg-[rgb(1,2,3)]` no) o `style={{ color: ... }}`.
#   - `white` y `black` a secas (`text-white`): no llevan número, y shadcn los usa.
#   - Una clase armada por partes (`` `bg-${color}-600` ``).
#   - Lo que ya hubiera en el archivo: solo mira el texto que esta edición añade
#     (`new_string` de Edit, `content` de Write).
#   - Falsos positivos que sí da: un ancla `#add` o un `#123` en un comentario o en
#     un `href` parecen un hexadecimal de 3 dígitos.
set -uo pipefail

entrada=$(cat)

# La ruta del archivo tocado, como la saca el hook de Prettier de settings.json.
f=$(printf '%s' "$entrada" | jq -r '.tool_response.filePath // .tool_input.file_path // empty')
[ -n "$f" ] || exit 0

raiz="${CLAUDE_PROJECT_DIR:-}"
[ -n "$raiz" ] || exit 0

# Solo frontend/src/, y dentro de él no la capa donde el literal se escribe.
case "$f" in
  "$raiz"/frontend/src/index.css) exit 0 ;;
  "$raiz"/frontend/src/*) ;;
  *) exit 0 ;;
esac

# Lo que esta edición introduce.
nuevo=$(printf '%s' "$entrada" | jq -r '.tool_input.new_string // .tool_input.content // empty')
[ -n "$nuevo" ] || exit 0

# Hexadecimal de 3, 4, 6 u 8 dígitos que no sea parte de otra palabra ni de una
# entidad HTML (`&#123;`) ni de una ruta o clase (`/#`, `-#`).
hex='(^|[^[:alnum:]_&#/-])#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})([^[:alnum:]_-]|$)'

# Utilidad de color + familia de la paleta de Tailwind + número (50 a 950). Admite
# variantes delante (`dark:hover:`) y la dirección en `border-t-`, `border-x-`...
utilidad='(bg|text|border|border-[trblxyse]|ring|ring-offset|fill|stroke|from|via|to|divide|outline|decoration|accent|caret|shadow|placeholder)'
familia='(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)'
paleta="(^|[^[:alnum:]_-])${utilidad}-${familia}-[0-9]{2,3}([^[:alnum:]_]|\$)"

hallados=$(
  {
    printf '%s\n' "$nuevo" | grep -Eo "$hex" | sed -E 's/^[^#]*#/#/; s/[^0-9a-fA-F]+$//'
    printf '%s\n' "$nuevo" | grep -Eo "$paleta" | sed -E 's/^[^[:alnum:]]*//; s/[^[:alnum:]]+$//'
  } | sort -u | head -8 | paste -sd ',' - | sed 's/,/, /g'
)
[ -n "$hallados" ] || exit 0

{
  echo "AVISO de color-con-nombre.sh: ${f#"$raiz"/} introduce un color escrito a pelo: ${hallados}."
  echo "El valor con nombre está en frontend/src/index.css (tokens como --primary, --destructive o --muted-foreground; en las clases, bg-primary, text-destructive, text-muted-foreground...). Usa uno de ellos."
  echo "Si de verdad hace falta un color que no existe, se añade ahí una sola vez y se usa por su nombre."
  echo "Es un aviso, no un bloqueo: si este caso es legítimo, déjalo como está y di por qué."
} >&2
exit 2
