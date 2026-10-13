#!/usr/bin/env bash
# PostToolUse (Write|Edit): avisa (exit 2) cuando lo que se acaba de escribir en
# frontend/src/ lleva un color a pelo:
#   - un hexadecimal literal (#fff, #1a2b3c, #1a2b3c80)
#   - una clase de paleta cruda de Tailwind: familia de color + número, con
#     cualquier variante delante (bg-blue-600, hover:text-red-500, border-t-gray-200/50)
# Los colores con nombre (--primary, --destructive...) viven en
# frontend/src/index.css, y las clases que los usan son bg-primary, text-destructive...
#
# AVISA, NO BLOQUEA: es PostToolUse, así que el cambio ya está escrito; el exit 2
# solo hace que el mensaje llegue al agente. Hay casos legítimos y lo que se
# busca es que la desviación se vea, no que sea imposible.
#
# Solo mira lo que la herramienta ha introducido (`new_string` de Edit,
# `content` de Write), no el archivo entero: así no regaña por lo que ya había.
# `frontend/src/index.css` queda exceptuado: es donde el literal se escribe, una vez.
#
# ESTO ES UNA RED, NO UN CANDADO. Lo que NO ve:
#   - `rgb()`, `hsl()`, `oklch()`, colores con nombre CSS (`red`) ni `text-white` /
#     `bg-black` (no llevan número), ni colores en un `style={{...}}` escrito así.
#   - Cualquier cambio hecho por Bash (`sed -i`, `cp`, el CLI de shadcn...): el
#     matcher es Write|Edit.
#   - Un valor armado por partes (`'bg-' + color + '-600'`).
# Y puede dar falsos positivos: un `#123` o `#abc` que no sea un color (un número
# de issue en un comentario, el id de un gradiente SVG en `url(#abc)`). Para eso
# es un aviso.
set -uo pipefail

input=$(cat)
[ -n "$input" ] || exit 0

f=$(printf '%s' "$input" | jq -r '.tool_response.filePath // .tool_input.file_path // empty')
[ -n "$f" ] || exit 0

proyecto=${CLAUDE_PROJECT_DIR:-$(pwd)}
case "$f" in
  "$proyecto"/frontend/src/index.css) exit 0 ;;
  "$proyecto"/frontend/src/*) ;;
  *) exit 0 ;;
esac

nuevo=$(printf '%s' "$input" | jq -r '.tool_input.new_string // .tool_input.content // empty')
[ -n "$nuevo" ] || exit 0

# Se parte el texto en fichas (todo lo que no sea parte de una clase o de un
# literal hace de separador) y se mira cada ficha entera: así dos colores
# pegados, o `text-[#fff]`, o `hover:bg-red-500/50`, se ven igual.
fichas=$(printf '%s\n' "$nuevo" | tr -c 'A-Za-z0-9#:/_&-' '\n' | sed -E 's/^.*://; s#/.*$##')

# Hexadecimal de 3, 4, 6 u 8 cifras que sea la ficha entera (no `&#123;`, no `a#fff`).
hex='^#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})$'

# Utilidad + familia de color de Tailwind + número (50, 100...900, 950).
familias='slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|mauve|olive|mist|taupe'
paleta="^([a-z]+-)+($familias)-(50|[1-9]00|950)\$"

encontrados=$(
  printf '%s\n' "$fichas" | grep -E "$hex|$paleta" | sort -u | head -n 8 | paste -sd ',' - | sed 's/,/, /g'
)
[ -n "$encontrados" ] || exit 0

{
  echo "AVISO de color-con-nombre.sh: ${f#"$proyecto"/} escribe un color a pelo: $encontrados."
  echo "Por qué: los colores del sistema de diseño tienen nombre (--primary, --destructive, --muted-foreground...) y viven en frontend/src/index.css; se usan con clases como bg-primary o text-destructive. Un color suelto no sigue el tema ni el modo oscuro."
  echo "Es un aviso, no un bloqueo: el cambio ya está escrito. Si es un caso legítimo, déjalo y dilo en la respuesta; si no, cámbialo por el valor con nombre."
} >&2
exit 2
