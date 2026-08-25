import type { ApplicationService, ContainerBindings } from '@adonisjs/core/types'

/**
 * El documento tal cual lo construye `@foadonis/openapi`. El tipo se deriva del
 * binding del contenedor a propósito: así no hay que importar el paquete de
 * decoradores, que aquí es una dependencia transitiva.
 */
export type OpenapiDocument = Awaited<ReturnType<ContainerBindings['openapi']['buildDocument']>>

/**
 * Una diferencia entre el documento versionado y el que se acaba de regenerar,
 * situada por su ruta dentro del documento (`paths./api/v1/tasks.get.summary`).
 */
export type OpenapiDifference =
  | { path: string; kind: 'missing'; regenerated: unknown }
  | { path: string; kind: 'extra'; versioned: unknown }
  | { path: string; kind: 'changed'; versioned: unknown; regenerated: unknown }

/**
 * Ruta del documento versionado. Vive en el `docs/` de la raíz del monorepo, no
 * dentro de `backend/`: describe el contrato de la API para todo el repositorio
 * y acompaña al resto de la documentación.
 */
export function openapiDocumentPath(app: ApplicationService) {
  return app.makePath('../docs/api/openapi.json')
}

/**
 * Construye el documento desde el router. Es la misma llamada que sirve
 * `GET /api.json`, así que el fichero versionado no es una segunda fuente que
 * se pueda desviar de la que ve quien consume la API.
 *
 * `router.commit()` es lo que hace `list:routes` antes de leer las rutas: fuera
 * del servidor HTTP nadie las ha volcado todavía al store, y sin ese volcado
 * `buildDocument()` no vería ninguna.
 */
export async function buildOpenapiDocument(app: ApplicationService) {
  const router = await app.container.make('router')
  router.commit()

  const openapi = await app.container.make('openapi')
  return openapi.buildDocument()
}

/**
 * Serializa siempre igual —dos espacios de sangría y salto de línea final— para
 * que el fichero versionado dé diffs legibles y para que la comparación byte a
 * byte de `openapi:check` no salte por una diferencia de formato.
 */
export function serializeOpenapiDocument(document: OpenapiDocument) {
  return `${JSON.stringify(document, null, 2)}\n`
}

/**
 * Compara los dos documentos ya parseados y devuelve las diferencias una a una.
 * Recorre en paralelo las dos estructuras en vez de comparar texto, para poder
 * decir *qué* cambió y *dónde*, y no solo que los ficheros no coinciden.
 */
export function diffOpenapiDocuments(
  versioned: unknown,
  regenerated: unknown
): OpenapiDifference[] {
  const differences: OpenapiDifference[] = []
  collectDifferences(versioned, regenerated, '', differences)
  return differences
}

function collectDifferences(
  versioned: unknown,
  regenerated: unknown,
  path: string,
  differences: OpenapiDifference[]
) {
  if (Array.isArray(versioned) && Array.isArray(regenerated)) {
    const length = Math.max(versioned.length, regenerated.length)
    for (let index = 0; index < length; index++) {
      compareMember(
        versioned,
        regenerated,
        index,
        index < versioned.length,
        index < regenerated.length,
        `${path}[${index}]`,
        differences
      )
    }
    return
  }

  if (isPlainObject(versioned) && isPlainObject(regenerated)) {
    // El orden de las claves no cuenta como diferencia de contenido: de eso ya
    // se encarga la comparación byte a byte de `openapi:check`.
    for (const key of new Set([...Object.keys(versioned), ...Object.keys(regenerated)])) {
      compareMember(
        versioned,
        regenerated,
        key,
        key in versioned,
        key in regenerated,
        path === '' ? key : `${path}.${key}`,
        differences
      )
    }
    return
  }

  if (!Object.is(versioned, regenerated)) {
    differences.push({ path: pathOrRoot(path), kind: 'changed', versioned, regenerated })
  }
}

function compareMember(
  versioned: Record<string, unknown> | unknown[],
  regenerated: Record<string, unknown> | unknown[],
  key: string | number,
  inVersioned: boolean,
  inRegenerated: boolean,
  path: string,
  differences: OpenapiDifference[]
) {
  const left = (versioned as Record<string | number, unknown>)[key]
  const right = (regenerated as Record<string | number, unknown>)[key]

  if (!inVersioned) {
    differences.push({ path, kind: 'missing', regenerated: right })
    return
  }

  if (!inRegenerated) {
    differences.push({ path, kind: 'extra', versioned: left })
    return
  }

  collectDifferences(left, right, path, differences)
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function pathOrRoot(path: string) {
  return path === '' ? '(documento entero)' : path
}
